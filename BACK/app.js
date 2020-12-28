require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
let cors = require('cors');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

//SET CREDENTIALS FROM ENV
const LOCAL_MONGODB = process.env.LOCAL_MONGODB;
const USER = process.env.USER_DATABASE;
const MDP = process.env.MDP_DATABASE;
const ADDRESS = process.env.ADDRESS_DATABASE;

//CONNECT TO MONGODB
let MONGODB_TO_CONNECT = `mongodb+srv://${USER}:${MDP}@${ADDRESS}`;
if(LOCAL_MONGODB === 'true') {
  MONGODB_TO_CONNECT = `mongodb://${ADDRESS}`;
}

mongoose.connect(MONGODB_TO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//SET HEADER REQUEST
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//SET BODY REQUEST
app.use(bodyParser.json());
app.use(cors());


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;