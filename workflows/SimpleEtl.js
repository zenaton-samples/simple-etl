module.exports.handle = function*(options) {
  /*
    Extract phase: retrieve data from the source.
  */

  // get the list of Star Wars movies including the characters list as ids.
  const movies = yield this.run.task("GetMovies");

  this.log(`${movies.length} movies were retrieved from the api.`);

  // extract characters ids of all movies. some characters can appear multiple times.
  const characters = movies.flatMap(x => x.characters);

  this.log(`${characters.length} characters are referenced in these movies.`);

  /*
    Transform phase: use the extracted data to find most famous characters.
  */

  // count in how many movies does a character appear in.
  const nbMoviesByCharacter = characters.reduce(
    (acc, c) => ({ ...acc, [c]: 1 + (acc[c] || 0) }),
    {}
  );

  // filter the characters ids to keep only those that appears in at least that 4 movies.
  const famousCharactersIds = Object.keys(nbMoviesByCharacter)
    .map(uri => ({ uri, nb: nbMoviesByCharacter[uri] }))
    .filter(x => x.nb >= 4)
  ;

  this.log(`${famousCharactersIds.length} characters appear in at least 4 movies.`);

  // get details on those most famous characters.
  let famousCharacters = [];
  for (const c of famousCharactersIds) {
    // get the details about a given character from the API.
    const characterData = yield this.run.task("GetCharacterData", c.uri);
    famousCharacters.push({
      birth_year: characterData.birth_year,
      name: characterData.name,
      height: characterData.height,
      movies: nbMoviesByCharacter[c.uri]
    });
  }

  // prepare data in a convenient format for GoogleSheet + email.
  const headers = ["Birth year", "Name", "Height", "Movies"];
  const cells = famousCharacters.map(x => Object.values(x));

  this.log("Cells that are going to be written to GoogleSheet: ", cells);

  /*
    Load phase: write data to a GoogleSheet and send it
  */
  // send results to google sheets
  // yield this.run.task("SendToGoogleSheet", headers, cells);

  // send results by email using sendgrid
  yield this.run.task("SendByEmail", options.emailReportTo, headers, cells);
};
