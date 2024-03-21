const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputDir = './extracted_files';
const outputDir = './processed_files';

// On s'assure que le dossier de sortie existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Lire tous les fichiers .xlsx du dossier inputDir
const files = fs.readdirSync(inputDir).filter(file => path.extname(file) === '.xlsx');

files.forEach(file => {
  const filePath = path.join(inputDir, file);

  // Charger le fichier .xlsx
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  let data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {header:1});
  data = data.slice(3);

  let lastRelevantRowIndex = data.length - 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].every(cell => cell === undefined || cell === '')) {
      lastRelevantRowIndex = i - 1;
      break;
    }
  }
  data = data.slice(0, lastRelevantRowIndex + 1);

  const newSheet = XLSX.utils.aoa_to_sheet(data);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Feuille modifiée');

  // Générer le nouveau chemin de fichier pour le fichier modifié
  const outputFilePath = path.join(outputDir, file);
  // Écrire le fichier modifié dans le dossier outputDir
  XLSX.writeFile(newWorkbook, outputFilePath);

  console.log(`Fichier traité et sauvegardé : ${outputFilePath}`);
});
