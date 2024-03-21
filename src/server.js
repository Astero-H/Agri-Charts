const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());

// Route pour servir le fichier JSON spécifique
app.get("/test2.json", (req, res) => {
  const jsonFilePath = path.join(__dirname, "..", "outputjson", "test2.json");
  res.sendFile(jsonFilePath);
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});
