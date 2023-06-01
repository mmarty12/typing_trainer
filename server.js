const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/auth', router);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin12345@cluster.vgejixx.mongodb.net/typing_trainer?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
