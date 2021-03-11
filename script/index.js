// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.

// // Server to handle CORS requests
// // import express from 'express'
// const express = require('express')
// const app = express()

// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res) {
//   res.send('hello world')
// })

// app.listen(3000, () => console.log('Example app listening on port 3000!'))

// app.use(cors())

/////////////////////////////////////
function handleError(err) {
  console.log(err);
}

//////////////////////////////////////////////////////////////////////////
// Global variables
CovidStatistics = ["Confirmed", "New Cases", "Deaths", "Recovered", "Critical"];

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const covidNewCases = [12000, 15000, 13000, 2000, 4000, 24000];
const baseEndpoint_Corona_Countries = "https://corona-api.com/countries/";

// Get country by region:
const baseEndpoint_Countries = "https://restcountries.eu/rest/v2/region/";
const proxy = "https://cors-anywhere.herokuapp.com/";
////////////////////////////////////////////////////////////////////////////
// Utility fucntions and helper functions

// import chart from './covidChart';
async function fetchUrl(url) {
  return await fetch(url)
    .then((response) => (response.ok ? response : Error(response.status)))
    .catch((err) => {
      console.error("fetch failed", err);
    });
}
////////////////////////////////////////////////////////////////////////////
// GUI stuff
// create radio buttons for resource
const selectRegion = document.querySelector(".regions");
selectRegion.addEventListener("change", onChangeRegion);
const selectCountry = document.querySelector(".country");
selectCountry.addEventListener("change", onChangeCountry);

const statsBtns = document.querySelectorAll(".stats");
statsBtns.forEach((btn, i) => {
  btn.addEventListener("click", function () {
    statsBtns.forEach((btn) => {
      //  console.log("Click", btn);

      btn.classList.remove("radio-btn-selected");
      btn.classList.add("radio-btn");
    });

    btn.classList.add("radio-btn-selected");
  });

  btn.value = CovidStatistics[i];

  btn.addEventListener("click", (event) =>
    ((arg) => {
      console.log(event, arg);
      covidControl.setData(arg);
      updateChart();
      updateCountryData();
    })(CovidStatistics[i])
  );
});
const btnNormalise = document.querySelector('.normalise');
btnNormalise.addEventListener("click", () =>{
  covidControl.normaliseData(!covidControl.isNormalised());
  btnNormalise.classList.toggle('checked');
  updateChart();
  updateCountryData();
})
function changeCovidData(e, covidData) {
  console.log(e + ": " + covidData);
}

////////////////////////////////////////////////////
// Classes and Entities

// const dataType = ["confirmed", "newConfirmed", "deaths", "newDeaths", "recovered"];
/////////////
class World {
  constructor() {
    this.regions = [];
    this.currentRegion = regions[0];
  }
  addRegion(name) {
    this.regions.push(new Region(name));
  }

  changeRegion(newRegion) {
    if (regions.includes(newRegion)) {
      this.currentRegion = newRegion;
      return true;
    }
    return false;
  }
  getStates(region) {
    let continent = this.getRegion(region);
    if (continent !== undefined) return continent.getStates();
    throw "undefined continent";
  }
  getRegion(name) {
    let region = this.regions.find((el) => el.name === name);
    if (region === undefined) throw name + " not found";
    return region;
  }
  getState(name) {
    try {
      let region = this.getRegion(this.currentRegion);
      return region.getState(name);
    } catch (err) {
      handleError(err);
    }
  }
}
/////////////
class Region {
  constructor(name) {
    this.name = name;
    this.states = [];
    this.count = 0;
  }

  addCountry(state) {
    console.log(`added ${state.name} to ${this.name} ${typeof state}`);
    this.states.push(state);
    this.count++;
  }
  getStates() {
    return this.states;
  }
  getState(name) {
    let state = this.states.find((el) => el.name === name);
    if (state === undefined) throw name + " not found";
    return state;
  }
  // return an array of covid data from all states
  getData(data, bNormalised) {
    let arr = [];
    
    arr = this.states.map((element) => element.getData(data, bNormalised));
    console.log(arr);
    return arr;
  }
}
/////////////
class Country {
  constructor(data) {
    this.name = data.data.name;
    this.countryCode = data.data.code;
    this.population = data.data.population;
    this.confirmed = data.data.latest_data.confirmed;
    this.newCases = data.data.today.confirmed;
    this.deaths = data.data.latest_data.deaths;
    this.newDeaths = data.data.today.deaths;
    this.recovered = data.data.latest_data.recovered;
    this.critical = data.data.latest_data.critical;

    // this.casesPerMillion = data.calculated.cases_per_million_population;
    // this.death_rate = data.calculated.death_rate;
  }

  getData(data, normalized) {
    let result=0;
    switch (data) {
      case "Confirmed":
        result = this.confirmed;
        break;
      case "Deaths":
        result = this.deaths;
        break;
      case "New Cases":
        result = this.newCases;
        break;
      case "Critical":
        result = this.critical;
        break;
      case "Recovered":
        result = this.recovered;
        break;
    }
    // normalise the data
    if (normalized && (this.population > 0))
      result = Math.floor(result * 10000000 / this.population);

      return result;
  }
}

//////////////////////////////////////////////////////////
// Class CovidControl - holds current data according to UI
class CovidControl {
  constructor() {
    this.currentRegion = "";
    this.currentState = "";
    this.currentData = "";
    this.bNormalised = true;
  }

  setRegion(region) {
    this.currentRegion = region;
  }
  setCountry(country) {
    this.currentState = country;
  }
  setData(data) {
    this.currentData = data;
  }
  getRegion() {
    return this.currentRegion;
  }
  getCountry() {
    return this.currentState;
  }
  getData() {
    return this.currentData;
  }

  normaliseData(flag) { this.bNormalised = flag; }
  isNormalised() { return this.bNormalised; }
}

//////////////////////////////////////////////////////
// Global function -
//TODO-Get rid ot them! All should be encapsulated
function onChangeRegion(e) {
  try {
    let name = e.currentTarget.value;
    console.log("changed selection to ", name);
    if (!regions.includes(name))
      throw ("selected region: Region unknown:", name);
    displayCountriesInSelect(name);
    covidControl.setRegion(name);
    world.changeRegion(name);
    // let first = covidControl.getRegion(name).getStates(0)
    let states = world.getRegion(name).getStates();
    covidControl.setCountry(states[0]);
    updateChart();
    updateCountryData();
  } catch (err) {
    console.log(err);
  }
}

//////////////////////////
// Event Handler
function onChangeCountry(e) {
  let name = e.currentTarget.value;
  let country = world.getState(name);
  covidControl.setCountry(country);
  updateChart();
  updateCountryData();
}

/////////////////////////
// display the chart according to current region, state, data
function updateChart() {
  document.querySelector(".continentHeader").textContent = `${covidControl.getRegion()}:`;
  document.querySelector(".graph-desc").textContent = covidControl.getData();
  let states = world.getStates(covidControl.getRegion()).map((el) => el.name);
  let numStates = states.length;
  let normaliseData = covidControl.isNormalised();
  let region = world.getRegion(covidControl.getRegion());
  let dataset = region.getData(covidControl.getData(), normaliseData);
  let labels = world.getStates(covidControl.getRegion()).map((el) => el.name);
  chart.config.data.labels = states;
  chart.config.data.datasets[0].data = dataset;
  // chart.config.data.datasets[0].label = covidControl.getData();
  let borderColors = new Array(numStates);
  let bgColors = new Array(numStates);
  borderColors.fill(`#f17623`);
  bgColors.fill('#ffff88');
  chart.config.data.datasets[0].borderColor = borderColors;
  chart.config.data.datasets[0].backgroundColor = bgColors;

  chart.update();
  updateCountryData();
}

///////////////////////////////////
//Update the data for each state individually
function updateCountryData() {
  let country = covidControl.getCountry();

  document.querySelector(
    ".total-cases"
  ).textContent = `Total Cases: ${country.confirmed}`;
  document.querySelector(
    ".new-cases"
  ).textContent = `New Cases: ${country.newCases}`;
  document.querySelector(
    ".critical"
  ).textContent = `Crical: ${country.critical}`;
  document.querySelector(".deaths").textContent = `Deceased: ${country.deaths}`;
  document.querySelector(
    ".population"
  ).textContent = `Population: ${country.population}`;
}

// load countries to select box
async function displayCountriesInSelect(continent) {
  try {
    let countries = world.getStates(continent);
    let text = "";
    countries.forEach(function (country) {
      text += `<option value="${country.name}">${country.name}</option>`;
    });
    selectCountry.innerHTML = text;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//////////////////////////////////////////////////////////
// load corona-stats by country from this call
async function fetchCovidStats(stateCode) {
  let url = baseEndpoint_Corona_Countries + stateCode;
  let response = await fetchUrl(url);
  if (!response.ok) throw new Error("404-response");
  let data = await response.json();
  return data;
}
                
////////////////////////////////////////////////
// fetch data of countries by continent
async function fetchCountries(region) {
  const _url = baseEndpoint_Countries + region;
  let response = await fetchUrl(_url);
  if (!response.ok) throw new Error(response.status);
  let data = await response.json();
  return data;
}
async function loadDataFromApi() {
  let statesJson = null;
  // let continent = null;
  let i = 0;
  for (i = 0; i < regions.length; i++) {
    world.addRegion(regions[i]);
    try {
      console.log("---!!! new region created", regions[i]);
      statesJson = await fetchCountries(regions[i]);
    } catch (err) {
      console.log(`Error in fetching countries data: ${continent} `, err);
      return;
    }

    // now fetch covid statistics for each state
    for (let j = 0; j < statesJson.length; j++) {
      if (statesJson[j].alpha2Code !== "") {
        try {
          let covidStats = await fetchCovidStats(statesJson[j].alpha2Code);
          console.log(covidStats);
          let country = new Country(covidStats);
          console.log("new state created", country);
          let region = world.getRegion(regions[i]);
          region.addCountry(country);
        } catch (err) {
          console.log("Error in fetching covid stats: ", err);
        }
      }
    }
  }
}
////////////////////////////////////////////////
async function main() {
  document.querySelector("main").style.opacity = 0.2;
  world = new World();
  covidControl = new CovidControl();
  await loadDataFromApi();

  let regionName = regions[0];
  covidControl.setRegion(regionName);
  covidControl.setCountry(world.getRegion(regionName).getStates()[0]);
  covidControl.setData(CovidStatistics[0]);
  let answer = displayCountriesInSelect(covidControl.getRegion());

  updateChart();

  document.querySelector(".loaderWrapper").style.display = "none";
  document.querySelector("main").style.opacity = 1;
}
///////////////////////////////////////////////////
// load data here
try {

  let world = null;
  let covidControl = null;
  window.onload = main().catch(console.log);
  $(window).on("load", function () {
    document.querySelector(".loader").style.display = "none";
    $(".loader").fadeOut();
  });
} catch(err) {
  console.error(err);
}
