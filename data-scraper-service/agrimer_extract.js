const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { tabIdProduits } = require("./data_product.js");

const apiUrl = "https://rnm.franceagrimer.fr/prix";

const config = {
  responseType: "arraybuffer",
};

module.exports = function extractData() {
  let promises = [];
  for (const [key, value] of Object.entries(tabIdProduits)) {
    const folderName = path.join(__dirname, "../data-extract/extracted_files", key);
    createFolder(folderName);

    let date = "28-03-";
    for (let year = 2024; year > 1994; year--) {
      let formDataProdMensuel = {
        MENSUEL: 1,
        ESPECE: value,
        LASTDATE: date + year,
      };

      let nameFile = key + "_" + year;
      promises.push(execJob(folderName, nameFile, formDataProdMensuel, config));
    }
  }
  return Promise.all(promises)
    .then(() => {
      console.log("Toutes les données ont été extraites.");
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue lors de l’extraction des données:",
        error
      );
    });
};

async function execJob(folderName, nameFile, formData, config) {
  try {
    const response = await axios.post(apiUrl, qs.stringify(formData), config);
    // Vérifier si la requête a réussi en examinant le statut de la réponse
    if (response.status === 200) {
      // La requête a réussi, traiter la réponse
      const workbook = xlsx.read(response.data, { type: "buffer" });
      const xlsxFilePath = path.join(folderName, `${nameFile}.xlsx`);
      xlsx.writeFile(workbook, xlsxFilePath);
      console.log("Response = ", response.status);
      console.log("Fichier XLSX généré avec succès :", xlsxFilePath);
    } else {
      // La requête n'a pas réussi, traiter l'échec
      console.log("La requête a échoué avec le statut :", response.status);
      return;
    }
  } catch (error) {
    console.error("Erreur lors de l'opération : ", error.code);
  }
}

function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}
