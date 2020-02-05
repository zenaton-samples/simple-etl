const axios = require("axios");

module.exports.handle = async function() {
  const response = await axios.get("https://swapi.co/api/films/");

  return response.data.results;
};
