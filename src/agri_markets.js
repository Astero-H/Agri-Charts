import { Chart } from "chart.js/auto";
import { getAgriData } from "./agridata.js";

(async function () {
  const chartData = await getAgriData();

  if (chartData) {
    new Chart(document.getElementById("agridata"), {
      type: "bar",
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
  } else {
    console.error("Impossible de charger les données du graphique.");
  }
})();
