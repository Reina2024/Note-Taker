// Import express Router to define API routes
const notes = require("express").Router();
// Import uuidv4 function from the uuid package to generate unique IDs
const { v4: uuidv4 } = require("uuid");

// Import helper functions for reading from, appending to, and writing to JSON files
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");

// Define API route to retrieve all notes
notes.get('/', (req, res) => {
  // Log the HTTP method and route being accessed
  console.info(`${req.method} notes requested`);
  
  // Read notes from the JSON file and send them as a JSON response
  readFromFile('./db/notes.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => res.status(500).json({ error: 'Failed to read notes' })); // Handle potential errors
});

// Define API route to add a new note
notes.post('/', (req, res) => {
  // Log the HTTP method and route being accessed
  console.info(`${req.method} add a note requested`);

  // Extract the title and text from the request body
  const { title, text } = req.body;

  // Check if the request body contains the necessary information
  if (title && text) {
    // Create a new note object with a unique ID, title, and text
    const newNote = {
      title,
      text,
      id: uuidv4(), // Generate a unique ID for the note
    };

    // Append the new note to the existing notes in the JSON file
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
    // If title or text is missing, respond with an error message
    res.status(400).json({ error: "Error - Note was not added. Title and text are required." });
  }
});


// Delete Route
notes.delete("/:id", (req, res) => {
    const id = req.params.id;
    readFromFile("./db/notes.json")
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((notes) => notes.id !== id);
  
        writeToFile("./db/notes.json", result);
  
        res.json(`Note ${id} has been deleted`);
      });
  });

// Export the notes router to be used in other parts of the application
module.exports = notes;
