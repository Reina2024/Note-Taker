// packages required
const express = require("express");
const path = require("path");
// feedback router
const api = require("./routes/index.js");
const PORT = process.env.PORT || 3001;
const app = express();

// middleware; Json, Url Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', api);

// GET route for the homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

// Wildcard Route for homepage
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
  );

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
