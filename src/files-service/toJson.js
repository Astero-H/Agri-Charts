const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Récupération du nom du fichier depuis les arguments de la ligne de commande
// const FILENAME = process.argv[2];
// if (!FILENAME) {
//   console.error("Veuillez fournir le nom du fichier à convertir en argument. Exemple: node toJson.js test.xlsx");
//   process.exit(1);
// }

const inputDir = path.join(__dirname, "../..", "processed_files/bananes-117-1995_2024");

// Lire tous les fichiers ..json du dossier inputDir
const files = fs.readdirSync(inputDir).filter((file) => path.extname(file) === ".xlsx");
console.log("Liste des fichiers : ", files);

function convertXlsxToJson(inputDir, files) {
  // const filePath = path.join(__dirname, "..", "../processed_files", FILENAME);
  // if (!fs.existsSync(filePath)) {
  //   console.error(`Le fichier ${FILENAME} n'existe pas.`);
  //   process.exit(1);
  // }

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // On suppose que la structure des données dans XLSX est connue et fixe
    const headers = rawData[0];
    let produits = [];

    rawData.slice(1).forEach((row) => {
      let produit = {
        libellé: row[2],
        unité: row[3],
        stades: [
          {
            nom: row[0], // Exemple, ajustez selon vos données
            marchés: [
              {
                nom: row[1], // Supposant que le nom du marché est dans la troisième colonne
                prixParMois: [],
              },
            ],
          },
        ],
      };

      // Supposons que les informations de mois et de prix commencent à la 4ème colonne
      // et que chaque produit a le même nombre fixe de mois/prix listés
      for (let i = 4; i < row.length; i++) {
        let mois = headers[i];
        let prix = row[i + 1]; // Supposant que le prix suit directement le mois dans la prochaine colonne

        if (mois && prix) {
          // Vérifier que la cellule du mois et du prix n'est pas vide
          produit.stades[0].marchés[0].prixParMois.push({
            mois: mois,
            prix: prix,
          });
        } else if (mois && prix == "") {
          produit.stades[0].marchés[0].prixParMois.push({
            mois: mois,
            prix: 0,
          });
        }
      }

      produits.push(produit);
    });

    // Structuration finale
    let finalData = { produits: produits };

    // Écrire le JSON dans un fichier
    const result = file.split(".");
    const titleFile = result[0];
    const outputPath = path.join(__dirname, "../..", "outputjson/bananes-117-1995_2024", titleFile + ".json");
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), "utf8");

    console.log(`Le fichier JSON a été écrit avec succès dans ${outputPath}`);
  });
}

convertXlsxToJson(inputDir, files);
