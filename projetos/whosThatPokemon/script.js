let url = `https://pokeapi.co/api/v2/pokemon/`;

const wayToName = document.querySelector('h3');
const wayToType = document.querySelector('p');
const wayToImg = document.querySelector('img')
const wayToPic = document.querySelector('#picture')
const wayToMain = document.querySelector('main')
const wayToStats = document.querySelector('#stats');
// const wayToTest = document.querySelector('#type') // type

// const test = () => { // pega a imagem do tipo
//  wayToTest.src = 'https://1.bp.blogspot.com/-5_3AXik_qNk/YBsQVBpAXtI/AAAAAAAAsB8/06k-B7LI-AY1KlJUymBrCfo6N55N4H-KACLcBGAsYHQ/s20/GO_Ghost.webp';
// }

const catTypes = ({ types }) => {
  return types.reduce((acc, curr) => {
    // if (curr.type.name === 'ghost') test();
    return acc += `${curr.type.name} `;
  }, '').toUpperCase();
};

const chageBColor = () => {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);

  return `rgba(${r}, ${g}, ${b}, 0.247)`
};

const changeSpriteBack = (id) => {
  url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      wayToImg.src = `${data.sprites.back_default}`;
    });
};

const changeSpriteFront = (id) => {
  url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      wayToImg.src = `${data.sprites.front_default}`;
    });
};

const getShiny = async (id) => { // async/await try/catch
  try {
    url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const obj = await response.json();
    wayToImg.src = `${obj.sprites.front_shiny}`;
  } catch(erro) {
    console.log(`Ops, algo deu errado! :( ${erro}`)
  }
};

let listStats = [];

const managesProgress = (way, value) => {
  const div = value / 2;
  way.style = `width: ${div}%;`
  if (value <= 49) way.style.backgroundColor = 'rgb(255 0 0 / 67%)';
  if (value >= 50 && value <= 80) way.style.backgroundColor = 'rgb(255 255 0 / 64%)';
};

const createBarProgress = (value) => {
  const createDiv = document.createElement('div');
  const createOtherDiv = document.createElement('div');
  createDiv.setAttribute('class', 'bar');
  createOtherDiv.setAttribute('class', 'progress');
  managesProgress(createOtherDiv, value);
  createDiv.appendChild(createOtherDiv);
  return createDiv;
};

const getStats = (id) => { // Isso te retorna uma promisse. Lembre-se!
  url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      listStats = data.stats.reduce((acc, curr, i) => {
        const status = {
          [i]: {
            info: `${curr.stat.name}: ${curr.base_stat}`,
            value: curr.base_stat,
          }
        };
        acc.push(status);
        return acc;
      }, [])
    })
    .catch((erro) => console.log(`Algo deu errado ${erro}`));
};

const addStats = (arr) => {
  arr.forEach((stat, i) => {
    const createLi = document.createElement('li');
    const createP = document.createElement('p');
    createP.innerText = `${stat[i].info}`;
    createLi.setAttribute('class', 'stat')
    createLi.appendChild(createP);
    createLi.appendChild(createBarProgress(stat[i].value));
    wayToStats.appendChild(createLi);
  })
};

const rmStats = () => {
  let wayToLi = document.querySelectorAll('.stat');
  wayToLi.forEach((stat) => wayToStats.removeChild(stat));
};

const fetchPokemon = (id) => {
  url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      wayToImg.src = `${data.sprites.front_default}`;
      wayToName.innerText = `${data.name} #${id}`;
      wayToType.innerText = catTypes(data);
    })
    .catch((erro) => console.log('Algo deu errado :(', erro));

    wayToPic.style.background = chageBColor();

    getStats(id).then(() => {
      rmStats();
      addStats(listStats);
    });
}

const wayToInput = document.querySelector('input');
const wayToBtn = document.querySelector('button');
const wayToShiny = document.querySelector('#shiny-btn');

let currId;

wayToBtn.addEventListener('click', () => {
  fetchPokemon(wayToInput.value);
  currId = wayToInput.value
  wayToInput.value = "";
});

wayToImg.addEventListener('mouseover', () => {
  if (currId > 0) changeSpriteBack(currId);
});

wayToImg.addEventListener('mouseout', () => {
  if (currId > 0) changeSpriteFront(currId);
});

wayToShiny.addEventListener('click', () => {
  getShiny(currId);
});
