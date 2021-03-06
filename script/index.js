function handleError(err) {
  console.log(err);
}


//////////////////////////////////////////////////////////////////////////
// Global variables
const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const covidNewCases = [12000, 15000, 13000, 2000, 4000, 24000];
const baseEndpoint_Corona_Countries = "https://corona-api.com/countries/";

// Get country by region:
// https://restcountries.eu/rest/v2/region/:region_name
// const baseEndpoint_Countries = "https://restcountries.eu/rest/v2/all";
const baseEndpoint_Countries = "https://restcountries.eu/rest/v2/region/";
const proxy = 'https://api.codetabs.com/v2/region/proxy/?quest=';
////////////////////////////////////////////////////////////////////////////
// Utility fucntions and helper functions

// import chart from './covidChart';
async function fetchUrl(url) {
  return await fetch(url).catch((err) => {
    console.error("fetch failed", err); //TODO: add status code checking
  });
}
////////////////////////////////////////////////////////////////////////////
// GUI stuff
// create radio buttons for resource
let selectRegion = document.querySelector(".regions");
selectRegion.addEventListener('change', changeRegion)

let statsBtns = document.querySelectorAll('.stats');
statsBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        statsBtns.forEach((btn) => {
         console.log("Click", btn);
        
        btn.classList.remove("radio-btn-selected");
        btn.classList.add("radio-btn");
      });
    
      btn.classList.add("radio-btn-selected");
    });
  });
////////////////////////////////////////////////////
// Classes and Entities

const dataType = ["confirmed", "newConfirmed", "deaths", "newDeaths", "recovered"];
/////////////
class World {
    constructor() {
        this.regions = [];
        this.currentRegion = "";
    }
    addRegion(region) {
        let name = region.name;
       regions.push({ name: region });
    }

    changeRegion(newRegion) {
        // TODO: assert = newRegion is indeed a region
        this.currentRegion = newRegion;
    }
    getRegion(name) { return this.regions[name]; }
}
/////////////
class Region {
     constructor(name) {
        this.name = name;
        this.states = [];
        this.count = 0;
    }
    // loadStates(map) {
    //     map.array.forEach(state => {
    //         this.states.push(state.name);
    //     });
    //     count = this.states.length;
    // }
    add(state) {
        console.log("added `${state.name}` to `${this.name}`");
        if (typeof state === Country) {
            this.states.push(state);
            this.count++;
        }
    }
    getStates() { return this.states;}
}
/////////////
class Country {
    constructor (data) {
        this.name = data.data.name;
        this.countryCode = data.data.code;
        this.population = data.data.population;
        this.confirmed = data.data.latest_data.confirmed;
        // this.newCofirmed = data.today.cofirmed;
        this.deaths = data.data.latest_data.deaths;
        // this.newDeaths = data.today.deaths;
        this.recovered = data.data.latest_data.recovered;
        // this.casesPerMillion = data.calculated.cases_per_million_population;
        // this.death_rate = data.calculated.death_rate;
    }
}
//////////////////////////////////////////////////////
// Global function - //TODO-Get rid ot them! All should be encapsulated
function changeRegion(e) {
    try{
        let newRegion = e.currentTarget.value;
        console.log(newRegion);
        if (!regions.includes(newRegion))
        throw("selected region: Region unknown:", newRegion);
        // let currStats = chart.getStats();
        console.log(world.getRegion(newRegion).getStates());
        displayBarChart(newRegion, currStats);
    } catch(err) {
        console.log(err);
    }
}

// let myCountries = countriesCases.map(item => { return {name: item.name,
//     deaths: item.latest_data.deaths,
//     confirmed: item.latest_data.confirmed,
//     recovered: item.latest_data.recovered
// };
// });
////////////////////////////////////////
function displayBarChart(name, stats) {
    // find which country
    // find what dataType to display
    try{

        if (!dataType.includes(stats))
            throw("invalid statistics type");
        getCountryData(name, dataType);

        // display the chart
        return;
    }
    catch(err) {
        handleError(err);
    }
}
//////////////////////////////////////////////////////////
// load corona-stats by country from this call
async function fetchCovidStats(stateCode) {
    let url = baseEndpoint_Corona_Countries+stateCode;
    let response = await fetchUrl(url);
    // console.log(response);
    let data = await response.json();
    // console.log("corona/state data:", data);
    return data;
  }
////////////////////////////////////////////////
// fetch data of countries by continent
async function fetchCountries(region) {
    // console.log("fetchCountries: start:", region);
    const _url = baseEndpoint_Countries+region;
    let response = await fetchUrl(_url);
    // console.log("response from Rest coutries api:", response);
    let data = await response.json();
    // console.log("after json: ", data);
    // console.log("fetchCountries: end");
    return data;
  }
  
////////////////////////////////////////////////
let world = new World();
async function main() {
    // console.log("list of hardcoded countries", myCountries);

    for (let i=0;  i < regions.length; i++) {
    // await regions.forEach( (region) => {
        continent = new Region(regions[i]);
        world.addRegion(continent);
        let statesJson = await fetchCountries(regions[i]);
        // console.log("data returned from fetch", statesJson);

        // now fetch covid statistics for each state
        // for (let j=0;  j < statesJson.length; j++) {
        for (let j=0;  j < 4; j++) {
            if (statesJson[j].alpha2Code !== ""){ 
                let covidStats = await fetchCovidStats(statesJson[j].alpha2Code);
                // console.log(covidStats);
                let country = new Country(covidStats);
                // console.log("new state created", state);
                world.getRegion(continent.name).add(country);
            }
        }
    };
    // fetchCovidStats();
}
///////////////////////////////////////////////////
// load data here

main().catch(console.log);