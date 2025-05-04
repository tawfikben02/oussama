// Using the .env file
require("dotenv").config();
const helmet = require("helmet");

const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const http = require("http");
const routes = require("./routes/routes");
const path = require("path");
// .env variables
const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Connect to the database
const ConnectDB = require("./db/connection");
ConnectDB(DB_URL);

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser());
// App setupapp.use(
app.use(
    cors({
        origin: "*",
        optionsSuccessStatus: 200,
    })
);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(routes);
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
    console.log("server started at http://localhost:" + port.toString());
});
