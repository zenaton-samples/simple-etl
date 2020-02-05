const axios = require("axios");

module.exports.handle = async function(uri) {
  const response = await axios.get(uri);

  return response.data;
};
