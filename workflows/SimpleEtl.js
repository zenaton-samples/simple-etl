const googleSheetConnectorId = "";
const spreadsheetId = "";
const sendgridConnectorId = "";
const yourEmail = "";
const emailFrom = "zenaton-tutorial@zenaton.com";

module.exports.handle = function*() {
  const http = this.connector("http");
  const googleSheets = this.connector("google_sheets", googleSheetConnectorId);
  const sendgrid = this.connector("sendgrid", sendgridConnectorId);

  /*
    EXTRACT Phase
  */

  // Get the list of Star wars films including the characters list as ids.
  const films = (yield http.get("https://swapi.co/api/films/")).data.results;

  // Extract characters ids of all films, some can appear multiple times.
  const characters = films.flatMap(x => x.characters);

  /*
    TRANSFORM Phase
  */

  // Count the number of films per characters ids.
  const nbMoviesByCharacter = characters.reduce(
    (acc, c) => ({ ...acc, [c]: 1 + (acc[c] || 0) }),
    {}
  );

  // Filter the characters ids to keep only those that appears in at least that 4 movies.
  const famousIds = Object.keys(nbMoviesByCharacter)
    .map(uri => ({ uri, nb: nbMoviesByCharacter[uri] }))
    .filter(x => x.nb >= 4);

  // Get details on those most famous characters.
  let famousCharacters = [];
  for (const c of famousIds) {
    // Get the details about a given character from the API
    const characterData = (yield http.get(c.uri)).data;
    famousCharacters.push({
      birth_year: characterData.birth_year,
      name: characterData.name,
      height: characterData.height,
      movies: nbMoviesByCharacter[c.uri]
    });
  }

  /*
    LOAD phase
  */

  // Save da to GoogleSheet
  const headers = ["Birth year", "Name", "Height", "Movies"];
  const cells = famousCharacters.map(x => Object.values(x));

  // send results to google sheets
  yield* sendToGoogleSheet(googleSheets, headers, cells);

  // send results by email using sendgrid
  yield* sendByEmail(sendgrid, emailFrom, yourEmail, headers, cells);
};

// Send to Google Sheet Task
const sendToGoogleSheet = function*(googleSheets, headers, cells) {
  /*
  googleSheets.post(`/${spreadsheetId}/values:batchUpdate`, {
    body: {
      valueInputOption: "USER_ENTERED",
      data: [{
          range: "Sheet1!A1:D40",
          majorDimension: "ROWS",
          values: [headers].concat(cells)
      }]
    }
  });
  */
};

// Send By Email Task
const sendByEmail = function*(sendGrid, from, to, headers, cells) {
  /*
  const payload = {
    body: {
      personalizations: [{ to: [{ email: to }] }],
      content: [{
          type: "text/plain",
          value: "Here is your result: \n" + JSON.stringify([headers].concat(cells), null ,2)
      }],
      subject: "SW results",
      from: { email:  from}
    }
  };

  sendGrid.post("/mail/send", payload);
  */
};
