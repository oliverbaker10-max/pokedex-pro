const pokedex = document.getElementById("pokedex");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");
const shinyToggle = document.getElementById("shinyToggle");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("close");

let caught = JSON.parse(localStorage.getItem("caught")) || {};
let allPokemon = [];
let shinyMode = false;

async function loadPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await res.json();

  allPokemon = data.results.map((p, i) => ({
    name: p.name,
    id: i + 1
  }));

  render();
}

async function showDetails(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const p = await res.json();

  modalBody.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${shinyMode ? p.sprites.front_shiny : p.sprites.front_default}">
    <p>Type: ${p.types.map(t => t.type.name).join(", ")}</p>
    <p>HP: ${p.stats[0].base_stat}</p>
    <p>Attack: ${p.stats[1].base_stat}</p>
    <p>Defense: ${p.stats[2].base_stat}</p>
  `;

  modal.classList.remove("hidden");
}

function render() {
  pokedex.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filtered = allPokemon.filter(p =>
    p.name.includes(search) || p.id.toString() === search
  );

  filtered.forEach(pokemon => {
    const div = document.createElement("div");
    div.classList.add("pokemon");

    if (caught[pokemon.id]) div.classList.add("caught");

    const imgUrl = shinyMode
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    div.innerHTML = `
      <img src="${imgUrl}">
      <p>#${pokemon.id}</p>
      <h3>${pokemon.name}</h3>
    `;

    div.onclick = () => showDetails(pokemon.id);

    div.ondblclick = () => {
      caught[pokemon.id] = !caught[pokemon.id];
      localStorage.setItem("caught", JSON.stringify(caught));
      render();
    };

    pokedex.appendChild(div);
  });

  updateCounter();
}

function updateCounter() {
  const total = allPokemon.length;
  const totalCaught = Object.values(caught).filter(v => v).length;
  counter.textContent = `Caught ${totalCaught} / ${total}`;
}

// Events
searchInput.addEventListener("input", render);

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

shinyToggle.onchange = () => {
  shinyMode = shinyToggle.checked;
  render();
};

closeBtn.onclick = () => modal.classList.add("hidden");

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

loadPokemon();
