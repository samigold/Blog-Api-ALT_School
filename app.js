const app = require('./index')
const Database = require('./dbConnect');

const PORT = process.env.PORT || 7500

// connect to database
Database.connect();

app.listen(PORT, () => {
    console.log('Listening on port, ', PORT)
})