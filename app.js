// server.js
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const connectDb = require('./db/connection');


app.listen(port, () =>{
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));

connectDb();

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Optional
  next();
});

const corsOption = {
  origin: 'http://localhost:4200',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: ['Content-Type, Authorization' , 'Content-Type: application/json'],
  credentials: true,
}

app.use(cors(corsOption));

app.use('/api/auth', authRoutes);

