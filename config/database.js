const mongoose = require('mongoose');

const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb://localhost:${port}/${dbName}`)
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));