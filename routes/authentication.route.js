const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticationRouter = express.Router();

authenticationRouter.post(
    '/signup',
    passport.authenticate('signup', { session: false }), async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

authenticationRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('Username or password is incorrect');
                    return next(error);
                }

                req.login(user, { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, username: user.username, fullname: user.fullname };
                        
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });

                        res.cookie('token', token, {
                            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
                            secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
                            maxAge: 3600000,  // Cookie expiration time in milliseconds (1 hour)
                            sameSite: 'strict',  // Prevents CSRF by restricting cross-origin requests
                          });

                        return res.json({ token});
                    }
                    
                );
            } catch (error) {
                return next(error);
            }
        }
        
        )(req, res, next);
    }
);

module.exports = authenticationRouter;