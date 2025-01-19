const request = require('supertest')
const { connect } = require('../../dbConnect')
const app = require('../../index');
const BlogSchema = require('../../models/blog.model');
const UserModel = require('../../models/user.model');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


describe('Author Blog Route', () => {
    let token;
    let idText;

    beforeAll(async () => {
        await connect("mongodb+srv://joejat:joejat2425@cluster0.ezbhlyf.mongodb.net/testrouter?retryWrites=true&w=majority")

        await UserModel.create({
            username: 'tobias', 
            password: 'Password123', 
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobias@mail.com'
        });

        const loginResponse = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'tobias', 
            password: 'Password123'
        });

        token = loginResponse.body.token;

        let testBlog = await BlogSchema.create({
          title: "test blog",
          description: "test blog",
          tags: ["test", "blog"],
          author: "tobie Augustina",
          reading_time: 1,
          body: " Random text for testing purposes"
        })

        idText = testBlog._id.valueOf();

    }, 3600000)

    // afterEach(async () => {
    //     await conn.cleanup()
    // })

    afterAll(async () => {
      await UserModel.remove({})
      await BlogSchema.remove({})
      await mongoose.connection.close()
    }, 3600000)

    it('should create a new blog', async () => {
        // create blog in our db
        const response = await request(app)
        .post(`/authorblog?secret_token=${token}`)
        .set('content-type', 'application/json')
        .send({
            title: "beauty and the beast",
            description: "A book about beauty and the beast",
            tags: ["beauty", "beast"],
            body: "Midsummer Night's Dream is a comedy written by William Shakespeare c. 1595 or 1596. The play is set in Athens, and consists of several subplots that revolve around the marriage of Theseus and Hippolyta. One subplot involves a conflict among four Athenian lovers. another follows a group of six amateur actors rehearsing the play which they are to perform before the wedding. his master play a trick on the fairy queen. In the end, Puck reverses the magic, and the two couples reconcile and marry.Four Athenians run away to the forest only to have Puck the fairy make both of the boys fall in love with the same girl. The four run through the forest pursuing ea. Four Athenians run away to the forest only to have Puck the fairy make both of the boys fall in love with the same girl. The four run through the forest pursuing each other while Puck helps his master play a trick on the fairy queen. In the end, Puck reverses the magic, and the two couples reconcile and marry.Four Athenians run away to the forest only to have Puck the fairy make both of the boys fall in love with the same girl. The four run through the forest pursuing eaFour Athenians run away to the forest only to have Puck the fairy make both of the boys fall in love with the same girl. The four run through the forest pursuing each other while Puck helps his master play a trick on the fairy queen. In the end, Puck reverses the magic, and the two couples reconcile and marry.Four Athenians run away to the forest only to have Puck the fairy make both of the boys fall in love with the same girl"
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("blog")
        expect(response.body.blog).toHaveProperty("author")
        expect(response.body.blog).toHaveProperty("read_count")
        expect(response.body.blog).toHaveProperty("reading_time")
    }, 3600000)

    it('should update a blog', async () => {
      // update a blog in our db
      const response = await request(app)
      .put(`/authorblog/${idText}?secret_token=${token}`)
      .set('content-type', 'application/json')
      .send({
          description: "Updated Description",
          tags: ["updated", "blog"],
          state: "published",
          body: "Blog body for the updated blog."
      })


      expect(response.status).toBe(200)
      expect(response.body.state).toEqual("published")
      expect(response.body).toHaveProperty("author")
      expect(response.body).toHaveProperty("read_count")
      expect(response.body).toHaveProperty("reading_time")
  }, 3600000)


  it('should update a blog', async () => {
    // update a blog in our db
    const response = await request(app)
    .patch(`/authorblog/${idText}?secret_token=${token}`)
    .set('content-type', 'application/json')
    .send({
        description: "Updated Description",
        tags: ["updated", "blog"],
        state: "published",
        body: "Blog body for the  updated blog."
    })


    expect(response.status).toBe(200)
    expect(response.body.state).toEqual("published")
    expect(response.body).toHaveProperty("author")
    expect(response.body).toHaveProperty("read_count")
    expect(response.body).toHaveProperty("reading_time")
}, 3600000)

  it("should get all the author's blogs", async () => {
    // should get all the blogs created by the logged in author
    const response = await request(app)
    .get(`/authorblog?secret_token=${token}`)
    .set('content-type', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("total_blogs")
    expect(response.body).toHaveProperty("blogs")
  }, 3600000)

  it("should get a particular blog from the author", async () => {
    // should get a particular blog from the author
    const response = await request(app)
    .get(`/authorblog/${idText}?secret_token=${token}`)
    .set('content-type', 'application/json')


    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("blogResult")
    expect(response.body).toHaveProperty("witten_by")
    expect(response.body).toHaveProperty("status")
  }, 3600000)


  it("should delete a particular blog from the author", async () => {
    // should get a particular blog from the author
    const response = await request(app)
    .delete(`/authorblog/${idText}?secret_token=${token}`)
    .set('content-type', 'application/json')

    expect(response.status).toBe(200)
  }, 3600000)

});
