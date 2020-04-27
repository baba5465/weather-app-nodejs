const axios = require ('axios');

const yargs = require ('yargs');

const argv = yargs
  .options ({
    address: {
      demand: true,
      alias: 'a',
      describe: 'Address for weather',
      string: true,
    },
  })
  .help ()
  .alias ('help', 'h').argv;

const googleApiKey = '';
const forecastApiKey = '';

var encodedAddress = encodeURIComponent (argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;

axios
  .get (geocodeUrl)
  .then (response => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error ('Unable to find that result');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.forecast.io/forecast/${forecastApiKey}/${lat},${lng}`;
    console.log (response.data.results[0].formatted_address);
    return axios.get (weatherUrl);
  })
  .then (response => {
    var temperature = response.data.currently.temperature;
    var appreantTemperature = response.data.currently.appreantTemperature;
    console.log (
      `It's currently ${temperature}. It feels like ${appreantTemperature}`
    );
  })
  .catch (e => {
    if (e.code === 'ENOTFOUND') {
      console.log ('Unable to connect to server');
    } else {
      console.log (e.message);
    }
  });
