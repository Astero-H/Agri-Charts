const extractData = require('./agrimer_extract');
const processFiles = require('./file_processor');
const convertToJson = require('./toJson');

extractData()
  .then(processFiles)
  .then(convertToJson)
  .then(() => {
    console.log('Toutes les tâches ont été effectuées avec succès.');
  })
  .catch(error => {
    console.error("Une erreur est survenue lors de l’exécution des tâches:", error);
  });