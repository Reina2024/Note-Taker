const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");

// API route to retrieve all notes
notes.get('/', (req, res) => {
  console.info(`${req.method} notes requested`);

  // Read notes from JSON file and send as response
  readFromFile('./db/notes.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => res.status(500).json({ error: 'Failed to read notes' })); // Handle errors
});

// API route to add a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} add a note requested`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(), // Generate a unique ID for the note
    };

    readAndAppend(newNote, './db/notes.json')
      .then(() => {
        console.log("Note Added");
        res.status(201).json({ message: "Note Added", note: newNote });
      })
      .catch((err) => {
        console.error("Error adding note", err);
        res.status(500).json({ error: 'Failed to add note' });
      });
  } else {
    res.status(400).json({ error: "Error - Note was not added. Title and text are required." });
  }
});

// API route to delete a note by ID
notes.delete("/:id", (req, res) => {
  const id = req.params.id;
  readFromFile("./db/notes.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== id);
      return writeToFile("./db/notes.json", result);
    })
    .then(() => res.json(`Note ${id} has been deleted`))
    .catch((err) => res.status(500).json({ error: 'Failed to delete note' }));
});

module.exports = notes;
