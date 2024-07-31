// create router instance
const router = require("express").Router();

// import sub routers
const notesRouter = require("./notes");
// use sub routers
router.use("/notes", notesRouter);
// export router
module.exports = router;