// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var path = require("path");
var fs = require("fs");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), (err, data) => {
        if (err) throw err;
        return res.json(JSON.parse(data));
    });
});

app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), (err, data) => {
        if (err) throw err;
        let notesJSON = JSON.parse(data);
        let hasTitle = "title" in req.body;
        let hasText = "text" in req.body;
        if (hasTitle && hasText) notesJSON.push(req.body);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notesJSON, null, '\t'), () => {
            console.log("wrote to file");
            res.send("wrote to file");
        });
    });
});

app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), (err, data) => {
        if (err) throw err;
        let notesJSON = JSON.parse(data);
        notesJSON.splice(+req.params.id, 1);
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notesJSON, null, '\t'), () => {
            console.log(`deleted element ${req.params.id} from array of notes`);
            console.log(notesJSON);
        });
    });
    res.send(`deleted element ${req.params.id} from array of notes`);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
