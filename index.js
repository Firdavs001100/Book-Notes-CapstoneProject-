import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookNotes",
    password: "12345678",
    port: 5432
});

db.connect();

app.get("/", async (req, res) => {
    try {

        res.render("index.ejs", {

        });
    } catch(err) {
        console.error("The request was failed. ", err.message);
        res.render("index.ejs", {
            error: err.message
        });
    }
});

app.get("/review", (req, res) => {
    try {

        res.render("reviewPage.ejs", {

        });
    } catch (err) {
        console.error("The request was failed. ", err.message);
        res.render("reviewPage.ejs", {
            error: err.message
        });
    } 
});

app.post("/create", (req, res) => {
    try {

        res.render("postCreation.ejs", {

        });
    } catch (err) {
        console.error("The request was failed. ", err.message);
        res.render("postCreation.ejs", {
            error: err.message
        });
    }
});

app.post("/edit", (req, res) => {
    try {

        res.render("editPage.ejs", {

        });
    } catch (err) {
        console.error("The request was failed. ", err.message);
        res.render("editPage.ejs", {
            error: err.message
        });
    }
});

app.delete("/delete", (req, res) => {
    try {

        res.redirect("/");
    } catch (err) {
        console.error("The request was failed. ", err.message);
        res.render("index.ejs", {
            error: err.message
        });
    }
});


app.listen(port, () => {
    console.log(`The server is running on port number ${port}`);
});