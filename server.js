const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./database/routers');
const Controller = require('./database/controller');
const controller = new Controller();
const { registration } = controller;
const { login } = controller;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json());
app.use('/auth', router);

mongoose.connect(
  `mongodb+srv://admin:admin12345@cluster.vgejixx.mongodb.net/typing_trainer?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

db.on('error', () => {
  console.log('Error in connection to database');
});
db.once('open', () => {
  console.log('Connected to database');
});

app.post('/signup', (req, res) => {
  registration(req, res);
});

app.post('/auth', (req, res) => {
  login(req, res);
});

app.get('/', (req, res) => {
  res.set({
    'Allow-Access-Allow-Origin': '*',
  });
  return res.redirect('index.html');
});

app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
