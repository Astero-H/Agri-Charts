export async function getDataFile() {
  const response = await fetch("http://localhost:3000/data");
  const files = await response.json();
  console.log('List of files', files);
  return files;
}

export async function getAgriData() {
  const files = await getDataFile();
  let containerElement = document.getElementById('fileList');
  
  // On s'assure que le sélecteur est vidé avant d'ajouter de nouvelles options
  let selectElement = document.getElementById('cat-product');
  selectElement.innerHTML = '<option value="">--Veuillez choisir une option--</option>';
  selectElement.style = "text-align : center";

  // Créer un bouton pour chaque fichier
  files.forEach((file, index) => {
      let button = document.createElement('button');
      button.className = 'btn btn-primary m-1';
      button.textContent = "Fichier " + (index + 1); // Nommer le bouton
      containerElement.appendChild(button);

      button.onclick = () => {
        let div = document.createElement('div');
        div.className = 'fade-out alert alert-success';
        div.innerHTML = 'Fichier ' + (index + 1) +  ' sélectionné'; 
        containerElement.appendChild(div);
        window.currentFileData = file;
        // Vider les options précédentes avant d'en ajouter de nouvelles
        selectElement.innerHTML = '<option value="">--Veuillez choisir une option--</option>';

        // Ajouter les produits du fichier sélectionné comme options dans le sélecteur
        file["produits"].forEach((product, prodIndex) => {
          let opt = document.createElement('option');
          opt.value = prodIndex;
          opt.innerHTML = product['libellé'];
          selectElement.appendChild(opt);
        });  
        setTimeout(() => {
          div.remove();
        }, 3000);
      }; 
  });
}

export function getChartData(file, selectedProductIndex) {
  const selectedProduct = file['produits'][selectedProductIndex];
  console.log('produit choisi', selectedProduct);

  const pricePerMonth = selectedProduct["stades"][0]["marchés"][0]["prixParMois"];
  const supplier = selectedProduct["stades"][0]["nom"];
  const market = selectedProduct["stades"][0]["marchés"][0]["nom"];
  const months = pricePerMonth.map(monthInfo => monthInfo['mois']);
  const prices = pricePerMonth.map(monthInfo => monthInfo['prix']);

  return {
    labels: months,
    datasets: [{
      label: `Marché (${supplier}) : ${market}`,
      data: prices,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
}
