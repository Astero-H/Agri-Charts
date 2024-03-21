export async function getAgriData() {
    try {
        const response = await fetch('http://localhost:3000/test2.json');
        const data = await response.json();
        console.log(data);
        const rowFirst = data[0];
        const rowData = data[80];
        const months = rowFirst.slice(4, 16);
        const prices = rowData.slice(4, 16); // Les colonnes 5 à 16 pour les prix
        const espece = rowData[2]
        const unitPrice = rowData[3]; // unité/prix
        const legend = rowData[1]; // légende
        return {
            labels: months,
            datasets: [
                {
                    label: legend + " | Espece = " + espece, // Supposant que 'legend' contient une description appropriée
                    data: prices,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        return null; // Ou gérer l'erreur comme nécessaire
    }
}
