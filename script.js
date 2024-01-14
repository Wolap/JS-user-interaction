
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const pokeList = document.querySelector('.poke-list');

let apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=100`;

// fetch data d'un ensemble de pokemon 
fetchData(apiUrl)
.then(data => {
  console.log('Pokemon Data:', data.results.map(element => element.name));
  
  results = data.results.map(element => element.name)
  let pokemonsPanier = JSON.parse(localStorage.getItem("pokemonsPanier")) || [];

  for(let i=0; i < results.length; i++){
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${results[i]}/`;

    const pokeCard = document.createElement('div');
    pokeCard.classList.add('poke-card');
    pokeList.appendChild(pokeCard);

    const btnCart = document.createElement('button');
    btnCart.classList.add('btn-panier');
    
    // fetch data d'un seul pokemon
    fetchData(apiUrl)
    .then(data => {

      let stats = 0;

      for(let i=0; i < data.stats.length; i++){
        stats += data.stats[i].base_stat;
      }

      pokeCard.innerHTML += `
      <img class="poke-sprite" src="${data.sprites.front_default}" alt="poke-sprite">
      <h2 class="poke-name">${data.name}</h2>
      <p class="poke-types">${data.types.map(element => element.type.name).join(', ')}</p>
      <p class="poke-price">${stats} €</p>`;

      btnCart.textContent = 'Ajouter au panier';
      pokeCard.appendChild(btnCart);

      const imgPanier = document.querySelector('.img-panier');
      
      btnCart.addEventListener('click', () => {
        pokemonsPanier.push(data.name)
        localStorage.setItem("pokemonsPanier", JSON.stringify(pokemonsPanier));
        console.log(localStorage.getItem("pokemonsPanier"));
        imgPanier.classList.add('bounce');
        setTimeout(function() {
          imgPanier.classList.remove("bounce");
        }, 1000);
      });
    });
  }

  const btnSearch = document.querySelector(".btn-search");
  const textBox = document.querySelector(".text-box");

  btnSearch.addEventListener("click", function(){
    const searchTerm = textBox.value.toLowerCase();
    
    // vidage liste
    pokeList.innerHTML = "";

    const filteredResults = data.results.filter(element => element.name.includes(searchTerm));

    filteredResults.forEach((result, index) => {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon/${result.name}/`;

      const pokeCard = document.createElement('div');
      pokeCard.classList.add('poke-card');
      pokeList.appendChild(pokeCard);

      const btnCart = document.createElement('button');
      btnCart.classList.add('btn-panier');
      
      fetchData(apiUrl)
      .then(data => {
        let stats = 0;

        for(let i=0; i < data.stats.length; i++){
          stats += data.stats[i].base_stat;
        }

        pokeCard.innerHTML += `
          <img class="poke-sprite" src="${data.sprites.front_default}" alt="poke-sprite">
          <h2 class="poke-name">${data.name}</h2>
          <p class="poke-types">${data.types.map(element => element.type.name).join(', ')}</p>
          <p class="poke-price">${stats} €</p>`;

        btnCart.textContent = 'Ajouter au panier';
        pokeCard.appendChild(btnCart);

        const imgPanier = document.querySelector('.img-panier');
        
        btnCart.addEventListener('click', () => {
          pokemonsPanier.push(data.name)
          localStorage.setItem("pokemonsPanier", JSON.stringify(pokemonsPanier));
          console.log(localStorage.getItem("pokemonsPanier"));
          imgPanier.classList.add('bounce');
          setTimeout(function() {
            imgPanier.classList.remove("bounce");
          }, 1000);
        });

      });

      // Si c'est le premier Pokemon de la liste filtrée, ajoutez une classe spéciale
      if (index === 0) {
        pokeCard.classList.add('first-result');
      }

    });
  });


});




