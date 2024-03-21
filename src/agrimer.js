const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const apiUrl = "https://rnm.franceagrimer.fr/prix";
const MENSUEL = 1;
const LASTDATE = process.argv[2]; // ex : 30-01-24";
const config = {
  responseType: "arraybuffer",
};

if (!LASTDATE) {
  console.error("Veuillez fournir une date en argument. Exemple: node agrimer.js 30-01-24");
  process.exit(1);
}

for (let index = 1; index < 10; index++) {
  let formDataProdMensuel = {
    MENSUEL,
    ESPECE: index,
    LASTDATE
  };
  execJob(index, formDataProdMensuel, config);
}

async function execJob(index, formData, config) {
  try {
    const response = await axios.post(apiUrl, qs.stringify(formData), config);

    // Vérifier si la requête a réussi en examinant le statut de la réponse
    if (response.status === 200) {
      // La requête a réussi, traiter la réponse
      const workbook = xlsx.read(response.data, { type: "buffer" });
      const xlsxFilePath = path.join(__dirname, "..", "extracted_files", `${index}.xlsx`);
      console.log('PATH',xlsxFilePath);
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
