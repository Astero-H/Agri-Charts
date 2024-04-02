require('dotenv').config();
require('./config/database');
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT || 3000;

const FileExtract = require('./models/FileExtractModel');
app.use(cors());
app.use(express.json());

app.get('/data', async (req, res) => {
  try {
    const data = await FileExtract.find();
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});