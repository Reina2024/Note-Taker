const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");

// helper function for Json file
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

//  API route: retrieve tips
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

module.exports = notes;