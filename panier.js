// Panier 

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

let apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=100`;

let local = localStorage.getItem("pokemonsPanier");

let pokemonsPanier = JSON.parse(localStorage.getItem("pokemonsPanier"));

if (local && pokemonsPanier && pokemonsPanier.length > 0) {

    let total = 0;
    let promises = [];

    for (let i = 0; i < pokemonsPanier.length; i++) {
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonsPanier[i]}/`;
        promises.push(fetchData(apiUrl));
    }

    Promise.all(promises)
    .then(pokemonDataArray => {
        const panierList = document.querySelector('.panier-list');
        const panierInfos = document.querySelector('.panier-infos');

        pokemonDataArray.forEach((data, i) => { 
            let stats = 0;

            for (let j = 0; j < data.stats.length; j++) {
                stats += data.stats[j].base_stat;
            }

            const panierCard = document.createElement('div');
            panierCard.classList.add('panier-card');
            panierList.appendChild(panierCard);

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn-delete');
            btnDelete.textContent = 'Supprimer';

            panierCard.innerHTML += `
                <div class="infos-poke">
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p>${data.name}</p>
                </div>
                <div class="infos-prix">
                    <p class="poke-prix">${stats} €</p>
                </div>`;

            panierCard.appendChild(btnDelete);

            btnDelete.addEventListener('click', () => {
                console.log("delete");
                pokemonsPanier.splice(i, 1); 
                localStorage.setItem("pokemonsPanier", JSON.stringify(pokemonsPanier));
                window.location.reload();
            });

            total += stats;

            panierInfos.innerHTML += `<p class="poke-prix">${stats} €</p>`;
        });

        if (total != 0) {
            panierInfos.innerHTML += `<p class="total">Total : ${total} €</p>`;
        }
    })
    .catch(error => console.error('Error fetching Pokemon data:', error));

}
