// Write a proxy server here

const baseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.allorigins.win/raw?url';
const response = await fetch(`${proxy}=${baseEndpoint}`);
const proxy = 'https://api.codetabs.com/v1/proxy/?quest=';

// https://api.codetabs.com/v1/proxy/?quest=https://restcountries.herokuapp.com/api/v1
// const response = await fetch(`${proxy}=${baseEndpoint}`);


