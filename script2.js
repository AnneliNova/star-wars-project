let pageNumber = 1;
let rendered;
let url = `https://swapi.dev/api/people/?page=${+pageNumber}`;
let characters = [];
let prevPage = [];
let nextPage = [];
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".previous");
const parentHidden = document.querySelector(".parent-hidden");
const textToClickOn = document.querySelector("h1");
const btn = document.querySelector(".btn");

window.addEventListener('load', ()=>{
  if(localStorage.getItem('currentPage')){
      let pageNumber = localStorage.getItem('currentPage')
      let url = `https://swapi.dev/api/people/?page=${+pageNumber}`;
      getCharacterInfo(url);
  } else{
      localStorage.setItem('currentPage', '1');
      getCharacterInfo('https://swapi.dev/api/people/');
    }
  });
  
  textToClickOn.addEventListener("click", getCharacterInfo);
  
const getFilms = (url) => {
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.title;
    });
};

const renderList = async (characters) => {
  // parentHidden.innerHTML = "";
  for (let i = 0; i < characters.length; i++) {
    let character = characters[i];
    let personName = character.name;
    let personYear = character.birth_year;
    let personGender = character.gender;
    const prom = character.films.map((e) => 
      fetch(e) 
        .then((response) => response.json()) 
        .then((data) => { 
          return data.title; 
        }) 
    ); 
    let result = await Promise.allSettled(prom);
    let personFilm = result.map(prom => prom.value); 
    const planetData = await fetch(character.homeworld); 
    const planet = await planetData.json(); 
    let personPlanet = planet.name;
    let fragment = `
     <li class="person">
        <ol class="hidden">
          <img src="https://starwars-visualguide.com/assets/img/characters/${i+1}.jpg" class="person-image"></img>
          <br>
          <h2 class="person-name"> ${personName}</h2>
          <br>
          <li class="person-year"> Рік народження: ${personYear}</li>
          <br>
          <li class="person-gender"> Стать: ${personGender}</li>
          <br>
          <li class="person-film"> Фільми: ${personFilm.join(', <br> ')}</li>
          <br>
          <li class="person-planet">Рідна планета: ${personPlanet}</li>
          <br>
        </ol>
      </li>
    `;
    parentHidden.insertAdjacentHTML("beforeEnd", fragment);
  }
  let btnFragment = `      
  <div class="btn">
  <a href="#" class="previous"><img src="image/left.png" /></a>
  <br/>
  <a href="#" class="next"><img src="image/right.png" /></a>
  </div>
  `
  parentHidden.insertAdjacentHTML("afterEnd", btnFragment);
  nextBtn.addEventListener("click", nextCharacter);
  previousBtn.addEventListener("click", prevCharacter);

  async function nextCharacter() {
    let url = localStorage.getItem('nextPage');
    if (url !== 'null') {
        await clean();
        !rendered && getCharacterInfo(url);
    }
    let pageNumber = +localStorage.getItem('currentPage')+1;
    let str = pageNumber.toString();
    localStorage.setItem('currentPage', pageNumber<9 ? str : '9');

}

async function prevCharacter() {
    let url = localStorage.getItem('previousPage');
    if (url !== 'null') {
        await clean();
        !rendered &&  getCharacterInfo(url);
    }
    
    let pageNumber = +localStorage.getItem('currentPage')-1;
    let str = pageNumber.toString();
    localStorage.setItem('currentPage', pageNumber>0 ? str : '1');
}

function clean() {
  let parentHidden;
  for (let elem of parentHidden) {
      elem.remove();
  }
  isAsideSectionRendered = false;
}

};



function getCharacterInfo() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      characters = data.results;
      prevPage = data.previous;
      nextPage = data.next;
      renderList(characters);
    });
}