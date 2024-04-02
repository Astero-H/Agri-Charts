import { Chart } from "chart.js/auto";
import { getAgriData, getChartData } from "./agridata.js";
const bootstrap = require('bootstrap');

let myChart = null;

(async function () {
  await getAgriData(); // Initialisation des boutons et écouteurs d'événements
})();

let selectElement = document.getElementById('cat-product');
selectElement.addEventListener('change', async function() {
  const selectedProductIndex = this.value;

  if (window.currentFileData) {
    const chartData = getChartData(window.currentFileData, selectedProductIndex);
    createChart(chartData);
  } else {
    console.error("Aucun fichier n'est sélectionné.");
  }
});

function createChart(chartData) {
  const ctx = document.getElementById("agridata").getContext('2d');

  // Détruire le graphique existant s'il y en a un
  if (myChart) {
    myChart.destroy();
  }

  // Créer un nouveau graphique avec les données fournies
  myChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      animation: true,
      plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            enabled: true,
        },
      },
      scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: value => `${value} €/kg (HT)`
            }
        },
      },
    },
  });
}