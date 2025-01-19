const express = require("express");
const blogModel = require("../models/blog.model");

const authorBlogRoute = express.Router();
const jwt = require('jsonwebtoken');
const {blogImages, fileSizeConverter} = require ("../uploadFunction");

const readTimeFunction = (text) => {
  const wpm = 250;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
} 



authorBlogRoute.post('/', blogImages.array("files", 10), async (req, res) => {

  // Fetch the secret token from cookies
  const secret_token = req.cookies.token;

  if (!secret_token) {
    return res.status(401).json({ status: false, message: 'Authentication token not found' });
  }

  // Decode the JWT to get the user's full name
  const jwtDecoded = jwt.decode(secret_token);
  const blogAuthor = jwtDecoded?.user?.fullname;

  // Initialize an empty filesArray
  let filesArray = [];

  // Check if req.files exists and has content
  if (req.files && req.files.length > 0) {
    req.files.forEach(element => {
      const file = {
        fileName: element.originalname,
        fileType: element.mimetype,
        fileSize: fileSizeConverter(element.size, 2),
      };
      filesArray.push(file);
    });
  }

  try {
    const body = req.body;
    const blogArticle = body.body;
    let reading_time;

    // Calculate reading time if the blogArticle exists
    if (blogArticle) {
      reading_time = readTimeFunction(blogArticle);
    }

    // Prepare blog details
    const blogDetails = {
      title: body.title,
      description: body.description,
      tags: body.tags,
      author: blogAuthor,
      reading_time,
      body: blogArticle,
      files: filesArray,
    };

    // Save the blog details to the database
    await blogModel.create(blogDetails)
      .then(blog => {
        return res.status(201).json({ status: true, blog });
      })
      .catch(err => {
        return res.status(403).json({ status: false, message: err.message });
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




authorBlogRoute.get('/', async (req, res) => {

  const secret_token = req.cookies.token;
  const { page = 1, limit = 20 } = req.query;
  const state = req.body.state;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;
  

  try {
    let blogs;
    if (state) {
      blogs = await blogModel.find({ author: blogAuthor, state }).limit(limit * 1).skip((page - 1) * limit);
    } else {
      blogs = await blogModel.find({ author: blogAuthor }).limit(limit * 1).skip((page - 1) * limit);
    }
    res.status(200).json({total_blogs: blogs.length, blogs});
  } catch (err) {
     res.status(500).json({ status: false, message: err });

  }
})


authorBlogRoute.get('/:blogId', async (req, res) => {
  const { blogId } = req.params;

  const secret_token = req.cookies.token;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;
  
  await blogModel.findById(blogId)
      .then((blog)=> {
          if(!blog) {
              return res.status(404).json({ status: false, blog : null })
          } else if (blogAuthor === blog.author) {
            const { author, ...result } = blog;
            const blogResult = result._doc
            return res.json({ status: true, witten_by : author, blogResult })
          } else {
            return res.status(401).json({ status: false, message : "you can only view blogs written by you" })
          } 
      }).catch((err) => {
          return res.status(404).json({ status: false, message: err })
  }) 
})



authorBlogRoute.patch('/:id', async (req, res) => {

  const blogId = req.params.id;

  const secret_token = req.cookies.token;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
          blogId,
          {
            $set: req.body,
          },
          { new: true }
        );

        let updatedReadingTime = readTimeFunction(updatedBlog.body);

        updatedBlog.reading_time = updatedReadingTime;

        updatedBlog.save();

        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

authorBlogRoute.put('/:id', async (req, res) => {

  const blogId = req.params.id;

  const secret_token = req.cookies.token;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
          blogId,
          {
            $set: req.body,
          },
          { new: true }
        );

        let updatedReadingTime = readTimeFunction(updatedBlog.body);

        updatedBlog.reading_time = updatedReadingTime;

        updatedBlog.save();

        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

authorBlogRoute.delete('/:id', async (req, res) => {

  const blogId = req.params.id;

  const secret_token = req.cookies.token;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        await blog.delete();
        res.status(200).json("Post successfully deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})



module.exports = authorBlogRoute;