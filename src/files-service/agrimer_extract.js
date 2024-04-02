const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const apiUrl = "https://rnm.franceagrimer.fr/prix";
const MENSUEL = 1;
// const LASTDATE = process.argv[2]; // ex : 30-01-24";
const config = {
  responseType: "arraybuffer",
};

// if (!LASTDATE) {
//   console.error("Veuillez fournir une date en argument. Exemple: node agrimer.js 30-01-24");
//   process.exit(1);
// }


let date = "28-02-";

for (let year = 1999; year > 1980; year--) {
  let formDataProdMensuel = {
    MENSUEL,
    ESPECE: 117,
    LASTDATE : date + year
  };
  let lastdate =  date + year;
  execJob(lastdate, formDataProdMensuel, config);
}

async function execJob(lastdate, formData, config) {
  try {
    const response = await axios.post(apiUrl, qs.stringify(formData), config);

    // Vérifier si la requête a réussi en examinant le statut de la réponse
    if (response.status === 200) {
      // La requête a réussi, traiter la réponse
      const workbook = xlsx.read(response.data, { type: "buffer" });
      const xlsxFilePath = path.join(__dirname, "..", "../extracted_files", `${lastdate}.xlsx`);
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
