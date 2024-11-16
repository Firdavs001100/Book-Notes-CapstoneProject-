import express, { response } from "express";
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

// let postsList = [];

app.get("/", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM notes");
        const postsList = response.rows;
        
        res.render("index.ejs", {
            posts: postsList,
        });
    } catch(err) {
        console.error("The request was failed. ", err.message);
        res.render("index.ejs", {
            error: err.message
        });
    }
});

app.get("/review/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);

        const response = await db.query("SELECT * FROM notes WHERE id = $1", [post_id]);

        const specificPost = response.rows[0];
        const thatPost = specificPost;

        res.render("reviewPage.ejs", {
            post: thatPost
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    } 
});

app.get("/edit/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);

        const response = await db.query("SELECT * FROM notes WHERE id = $1", [post_id]);

        const specificPost = response.rows[0];
        const thatPost = specificPost;


        res.render("editPage.ejs", {
            post: thatPost
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
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

app.post("/update/:id", (req, res) => {
    try {
        const idOfPostToUpdate = parseInt(req.params.id, 10);

        res.render("editPage.ejs", {

        });
    } catch (err) {
        console.error("The request was failed. ", err.message);
        res.render("editPage.ejs", {
            error: err.message
        });
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id, 10);

        await db.query("DELETE FROM notes WHERE id = $1", [idToDelete]);
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