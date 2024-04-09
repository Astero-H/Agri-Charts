const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const { tabIdProduits } = require("./data_product.js");

module.exports = function convertToJson() {
  let conversionPromises = [];

  for (const [key, value] of Object.entries(tabIdProduits)) {
    const inputPath = path.join(__dirname, "../data-extract/processed_files/" + key);
    const outputPath = path.join(__dirname, "../data-extract/outputjson/" + key);
    createFolder(outputPath);
    // Lire tous les fichiers ..json du dossier inputPath
    const files = fs.readdirSync(inputPath).filter((file) => path.extname(file) === ".xlsx");

    files.forEach((file) => {
      conversionPromises.push(
        new Promise((resolve, reject) => {
          try {
            const filePath = path.join(inputPath, file);
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
            const outputDir = path.join(outputPath, result[0] + ".json");
            fs.writeFileSync(outputDir,JSON.stringify(finalData, null, 2),"utf8");
            console.log(`Le fichier JSON a été écrit avec succès dans ${outputDir}`);
            resolve();
          } catch (error) {
            console.error(`Erreur lors de la conversion du fichier ${file}:`,error);
            reject(error);
          }
        })
      );
    });
  }
  return Promise.all(conversionPromises)
    .then(() => {
      console.log("Toutes les conversions JSON ont été effectuées.");
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue lors des conversions JSON:",
        error
      );
    });
};

function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}
