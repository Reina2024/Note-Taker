const express = require("express");
const path = require("path");
const { readFromFile, writeToFile, readAndAppend } = require("./helpers/fsUtils");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({length:6});
const app = express();
const PORT = process.env.PORT || 3001;
const db = "./db/db.json";
const api = require('./routes/index');

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Use API routes
app.use('/api', api);

// GET route for the homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

// GET route for the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'pages', 'notes.html'))
);

// Wildcard Route for all other routes
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.get("/api/notes", (req, res) => {
    readFromFile(db)
    .then((data) => {
      res.json(JSON.parse(data))
    });
  });
  
  
  app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      const newNotes = {
        ...req.body,
        id: uid.rnd()
      };
      readAndAppend(newNotes, db)
        .then(() => res.status(201).json({ message: "Note added", note: newNotes }))
        .catch((err) => res.status(500).json({ error: 'Failed to add note' }));
    } else {
      res.status(400).json("400 bad request");
    }
  });
 

  app.delete("/api/notes/:id", (req, res) => {
    readFromFile(db)
      .then((data) => {
        const savedNotes = JSON.parse(data);
        const delIndex = savedNotes.findIndex((note) => note.id === req.params.id);
        if (delIndex === -1) {
          return res.status(404).json({ error: "Note not found" });
        }
        savedNotes.splice(delIndex, 1);
        return savedNotes;
      })
      .then((newNotes) => writeToFile(db, newNotes))
      .then(() => res.status(200).end())
      .catch((err) => res.status(500).json({ error: 'Failed to delete note' }));
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
