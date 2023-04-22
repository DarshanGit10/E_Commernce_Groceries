// DB Connection
const connectToMongo = require('./db')
connectToMongo()

// Import 
const express =  require('express');
const app = express();
require('dotenv').config();


// Middleware
app.use(express.json());

app.get('/', (req, res) =>{
  res.send('Welcome')
})

// Routes
app.use('/api', require('./routes/authentication'))

// Listening to port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
