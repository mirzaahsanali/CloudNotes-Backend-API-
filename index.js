const connectToMongo = require('./db');
const express = require("express");
var cors = require('cors')
connectToMongo();

var app = express()

const port = 5000;

app.use(cors())
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/",(req, res)=>{
    res.send("cloud notes zindabad")
})

app.listen(port, () => {
	console.log(`CloudNote Backend listening on port ${port}`);
});
