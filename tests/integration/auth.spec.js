const request = require('supertest')
const { connect } = require('../../dbConnect')
const UserModel = require('../../models/user.model')
const app = require('../../index');
const { default: mongoose } = require('mongoose');
require('dotenv').config();



describe('Auth: Signup', () => {

    beforeAll(async () => {
         await connect("mongodb+srv://joejat:joejat2425@cluster0.ezbhlyf.mongodb.net/testrouter?retryWrites=true&w=majority")
    }, 360000)

    // afterEach(async () => {
    //     await UserModel.remove({})
    // })

    afterAll(async () => {
        await UserModel.remove({})
        await mongoose.connection.close()
    }, 360000)

    it('should signup a user', async () => {
        const response = await request(app).post('/signup')
        .set('content-type', 'application/json')
        .send({ 
            username: 'tobi', 
            password: 'Password123', 
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com'
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('username', 'tobi')
        expect(response.body.user).toHaveProperty('firstname', 'tobie')
        expect(response.body.user).toHaveProperty('lastname', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobi@mail.com')        
    }, 360000)


    it('should login a user', async () => {
        // create user in out db
        // const user = await UserModel.create({ username: 'tobi', password: '123456'});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'tobi', 
            password: 'Password123'
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    }, 360000)
})