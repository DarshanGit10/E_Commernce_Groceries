// DB Connection
const connectToMongo = require('./db')
connectToMongo()

// Import 
const express =  require('express');
const app = express();

// Config File 
require('dotenv').config();

// Cross-origin resource sharing policy
const cors = require('cors')
app.use(cors());

const cronJobs = require('./utils/cronJobs');

cronJobs.start();

// Middleware
app.use(express.json());

app.get('/', (req, res) =>{
  res.send('Welcome')
})

// Routes
app.use('/api', require('./routes/authentication'))
app.use('/api', require('./routes/user'))
app.use('/api', require('./routes/address'))
app.use('/api/products', require('./routes/products'))
app.use('/api/payment', require('./routes/payment'))
app.use('/api/orders', require('./routes/orders'))

// Listening to port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
