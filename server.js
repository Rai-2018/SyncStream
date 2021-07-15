const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan")
const app = express();
var corsOptions = { origin: "http://localhost:8080" };

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./server/models");
const Role = db.role;

db.mongoose.connect(
    'mongodb://127.0.0.1/SyncStream', 
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
).then( () => {
    console.log("connected to MongoDB");
    initial();
}).catch(err => {
    console.log("Connection error", err);
    process.exit();
});
db.mongoose.Promise=global.Promise;

app.get("/", (req, res) => {
    res.json({ message: "Sync Stream Application"});
});

require("./server/routes/authroutes")(app);
require("./server/routes/roleroutes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});

function initial() {
    Role.estimatedDocumentCount((err,count) => {
        if(!err && count === 0) {
            new Role({ name: "user" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- USER -- to roles collection");
            });

            new Role({ name: "moderator" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- MODERATOR -- to roles collection");
            });

            new Role({ name: "admin" }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added -- ADMININSTRATOR -- to roles collection");
            });
        }
    });
}