require ('dotenv').config();

const express = require('express');
const cors = require('cors');
const pg = require('pg');

//create app+DB connection
const app= express();
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});

const routeGuard=require('./middleware/verifyToken');
//Middleware
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());


//Routes
const authRoute=require('./routes/auth');
const wishRoute= require('./routes/wish');


app.use('/user', authRoute);
app.use('/wish', wishRoute);

//404 handler
app.use((req, res) => {
  res.status(404).send('Page not found <a href="/">Get Back Home</a>');
});

//start server
const PORT = process.env.PORT || 3000;
pool.connect()
  .then(() => {
app.listen(PORT,()=>{
console.log(`Server running on  http://localhost:${PORT}`)
});
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err);
  });