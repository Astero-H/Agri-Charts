const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Le fichier se trouve obligatoirement dans le dossier processed_files
const FILENAME = process.argv[2];
console.log(FILENAME);
if (!FILENAME) {
  console.error("Veuillez fournir le nom du fichier à convertir en argument. Exemple: node xlsxtojson.js test.xls");
  process.exit(1);
}
const result = FILENAME.split(".");
const titleFile = result[0];


function convertXlsxToJson() {
  // Définir le chemin vers le fichier XLSX
  const filePath = path.join(__dirname, "..", "processed_files", FILENAME);

  if (!fs.existsSync(filePath)) {
    console.error(`Le fichier ${FILENAME} n'existe pas dans le dossier processed_files.`);
    process.exit(1);
  }

  // Lire le workbook
  const workbook = XLSX.readFile(filePath);

  // Utiliser la première feuille
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convertir en JSON
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Afficher le JSON dans la console ou l'écrire dans un fichier
  console.log(json);

  // Écrire le JSON dans un fichier (optionnel)
  const outputPath = path.join(
    __dirname,
    "..",
    "outputjson/" + titleFile + ".json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2), "utf8");

  console.log(`Le fichier JSON a été écrit avec succès dans ${outputPath}`);
}

convertXlsxToJson();
