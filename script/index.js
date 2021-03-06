function handleError(err) {
  console.log(err);
}



function changeRegion(newRegion) {
    let currStats = chart.getStats();
    displayBarChart(newRegion, currStats);
}
const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const covidNewCases = [12000, 15000, 13000, 2000, 4000, 24000];
class Country {
    constructor (data) {
        this.name = data.name;
        this.countryCode = data.code;
        this.population = data.population;
        this.confirmed = data.latest_data.confirmed;
        this.newCofirmed = data.today.cofirmed;
        this.deaths = data.latest_data.deaths;
        this.newDeaths = data.today.deaths;
        this.recovered = data.latest_data.recovered;
        this.casesPerMillion = data.calculated.cases_per_million_population;
        this.death_rate = data.calculated.death_rate;
    }
}
const baseEndpoint_Corona_Countries = "https://corona-api.com/countries";
// Get country by region:
// https://restcountries.eu/rest/v2/region/:region_name
// const baseEndpoint_Countries = "https://restcountries.eu/rest/v2/all";
const baseEndpoint_Countries = "https://restcountries.eu/rest/v2/region/";
const proxy = 'https://api.codetabs.com/v2/region/proxy/?quest=';
// import chart from './covidChart';
async function fetchUrl(url) {
  return await fetch(url).catch((err) => {
    console.error("fetch failed", err); //TODO: add status code checking
  });
}

// fetch data of countries by continent
async function fetchCountries(continent) {
  const _url = baseEndpoint_Countries+continent;
  let response = await fetchUrl(_url);
  console.log("response from Rest coutries api:", response);
  let data = await response.json();
  console.log("after json: ", data);

  return data;
}

// load corona-stats by country from this call
async function loadCovidStats() {
  let url = baseEndpoint_Corona_Countries;
  let response = await fetch(url);
  console.log(response);
  let data = await response.json();
  console.log("corona/state data:", data);
  return data;
}
// display to chart
const countriesData = [
    {
        "name": "Albania",
        "topLevelDomain": [
            ".al"
        ],
        "alpha2Code": "AL",
        "alpha3Code": "ALB",
        "callingCodes": [
            "355"
        ],
        "capital": "Tirana",
        "altSpellings": [
            "AL",
            "Shqipëri",
            "Shqipëria",
            "Shqipnia"
        ],
        "region": "Europe",
        "subregion": "Southern Europe",
        "population": 2886026,
        "latlng": [
            41.0,
            20.0
        ],
        "demonym": "Albanian",
        "area": 28748.0,
        "gini": 34.5,
        "timezones": [
            "UTC+01:00"
        ],
        "borders": [
            "MNE",
            "GRC",
            "MKD",
            "KOS"
        ],
        "nativeName": "Shqipëria",
        "numericCode": "008",
        "currencies": [
            {
                "code": "ALL",
                "name": "Albanian lek",
                "symbol": "L"
            }
        ],
        "languages": [
            {
                "iso639_1": "sq",
                "iso639_2": "sqi",
                "name": "Albanian",
                "nativeName": "Shqip"
            }
        ],
        "translations": {
            "de": "Albanien",
            "es": "Albania",
            "fr": "Albanie",
            "ja": "アルバニア",
            "it": "Albania",
            "br": "Albânia",
            "pt": "Albânia",
            "nl": "Albanië",
            "hr": "Albanija",
            "fa": "آلبانی"
        },
        "flag": "https://restcountries.eu/data/alb.svg",
        "regionalBlocs": [
            {
                "acronym": "CEFTA",
                "name": "Central European Free Trade Agreement",
                "otherAcronyms": [],
                "otherNames": []
            }
        ],
        "cioc": "ALB"
    },
    {
        "name": "Andorra",
        "topLevelDomain": [
            ".ad"
        ],
        "alpha2Code": "AD",
        "alpha3Code": "AND",
        "callingCodes": [
            "376"
        ],
        "capital": "Andorra la Vella",
        "altSpellings": [
            "AD",
            "Principality of Andorra",
            "Principat d'Andorra"
        ],
        "region": "Europe",
        "subregion": "Southern Europe",
        "population": 78014,
        "latlng": [
            42.5,
            1.5
        ],
        "demonym": "Andorran",
        "area": 468.0,
        "gini": null,
        "timezones": [
            "UTC+01:00"
        ],
        "borders": [
            "FRA",
            "ESP"
        ],
        "nativeName": "Andorra",
        "numericCode": "020",
        "currencies": [
            {
                "code": "EUR",
                "name": "Euro",
                "symbol": "€"
            }
        ],
        "languages": [
            {
                "iso639_1": "ca",
                "iso639_2": "cat",
                "name": "Catalan",
                "nativeName": "català"
            }
        ],
        "translations": {
            "de": "Andorra",
            "es": "Andorra",
            "fr": "Andorre",
            "ja": "アンドラ",
            "it": "Andorra",
            "br": "Andorra",
            "pt": "Andorra",
            "nl": "Andorra",
            "hr": "Andora",
            "fa": "آندورا"
        },
        "flag": "https://restcountries.eu/data/and.svg",
        "regionalBlocs": [],
        "cioc": "AND"
    },
    {
        "name": "Austria",
        "topLevelDomain": [
            ".at"
        ],
        "alpha2Code": "AT",
        "alpha3Code": "AUT",
        "callingCodes": [
            "43"
        ],
        "capital": "Vienna",
        "altSpellings": [
            "AT",
            "Österreich",
            "Osterreich",
            "Oesterreich"
        ],
        "region": "Europe",
        "subregion": "Western Europe",
        "population": 8725931,
        "latlng": [
            47.33333333,
            13.33333333
        ],
        "demonym": "Austrian",
        "area": 83871.0,
        "gini": 26.0,
        "timezones": [
            "UTC+01:00"
        ],
        "borders": [
            "CZE",
            "DEU",
            "HUN",
            "ITA",
            "LIE",
            "SVK",
            "SVN",
            "CHE"
        ],
        "nativeName": "Österreich",
        "numericCode": "040",
        "currencies": [
            {
                "code": "EUR",
                "name": "Euro",
                "symbol": "€"
            }
        ],
        "languages": [
            {
                "iso639_1": "de",
                "iso639_2": "deu",
                "name": "German",
                "nativeName": "Deutsch"
            }
        ],
        "translations": {
            "de": "Österreich",
            "es": "Austria",
            "fr": "Autriche",
            "ja": "オーストリア",
            "it": "Austria",
            "br": "áustria",
            "pt": "áustria",
            "nl": "Oostenrijk",
            "hr": "Austrija",
            "fa": "اتریش"
        },
        "flag": "https://restcountries.eu/data/aut.svg",
        "regionalBlocs": [
            {
                "acronym": "EU",
                "name": "European Union",
                "otherAcronyms": [],
                "otherNames": []
            }
        ],
        "cioc": "AUT"
    },
];
const countriesCases = [
  {
    coordinates: {
      latitude: 33,
      longitude: 65,
    },
    name: "Afghanistan",
    code: "AF",
    population: 29121286,
    updated_at: "2021-03-04T15:12:11.777Z",
    today: {
      deaths: 2,
      confirmed: 136,
    },
    latest_data: {
      deaths: 2449,
      confirmed: 55933,
      recovered: 49362,
      critical: 4122,
      calculated: {
        death_rate: 4.378452791732966,
        recovery_rate: 88.25201580462338,
        recovered_vs_death_ratio: null,
        cases_per_million_population: 1073,
      },
    },
  },
  {
    "coordinates": {
        "latitude": 41,
        "longitude": 20
    },
    "name": "Albania",
    "code": "AL",
    "population": 2986952,
    "updated_at": "2021-03-04T15:12:11.777Z",
    "today": {
        "deaths": 0,
        "confirmed": 0
    },
    "latest_data": {
        "deaths": 1856,
        "confirmed": 109674,
        "recovered": 72076,
        "critical": 35742,
        "calculated": {
            "death_rate": 1.6922880536863798,
            "recovery_rate": 65.71840180899757,
            "recovered_vs_death_ratio": null,
            "cases_per_million_population": 46
        }
    }
},
{
    "coordinates": {
        "latitude": 0,
        "longitude": 0
    },
    "name": "Åland Islands",
    "code": "AX",
    "population": 26711,
    "updated_at": "2021-03-04T15:12:11.777Z",
    "today": {
        "deaths": 0,
        "confirmed": 0
    },
    "latest_data": {
        "deaths": 0,
        "confirmed": 0,
        "recovered": 0,
        "critical": 0,
        "calculated": {
            "death_rate": null,
            "recovery_rate": null,
            "recovered_vs_death_ratio": null,
            "cases_per_million_population": 0
        }
    }
},
];
let myCountries = countriesCases.map(item => { return {name: item.name,
    deaths: item.latest_data.deaths,
    confirmed: item.latest_data.confirmed,
    recovered: item.latest_data.recovered
};
});
class Region {
    constructor() {
        this.states = [];
        this.count = 0;
    }
    loadStates(map) {
        map.array.forEach(state => {
            this.states.push(state.name);
        });
        count = this.states.length;
    }
    getStates() { return this.states;}
}

const dataType = ["confirmed", "newConfirmed", "deaths", "newDeaths", "recovered"];
console.log("list of hardcoded countires", myCountries);
loadCovidStats();
fetchCountries("asia");

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