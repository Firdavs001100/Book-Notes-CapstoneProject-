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

let currentPostId;
let sort_by = "id ASC";

async function gettingThePost() {
    const response = await db.query("SELECT * FROM notes WHERE id = $1", [currentPostId]);

    const specificPost = response.rows[0];
    return specificPost;
}

app.get("/", async (req, res) => {
    try {
        const response = await db.query(`SELECT * FROM notes ORDER BY ${sort_by}`);
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
        currentPostId = parseInt(req.params.id, 10);
        const currentPost = await gettingThePost();

        res.render("reviewPage.ejs", {
            post: currentPost
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    } 
});

app.get("/edit/:id", async (req, res) => {
    try {
        currentPostId = parseInt(req.params.id, 10);
        const currentPost = await gettingThePost();

        res.render("editPage.ejs", {
            post: currentPost
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.get("/create", (req, res) => {
    try {
        res.render("postCreation.ejs", {
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.post("/getBookTitle", async (req, res) => {
    try {
        const bookName = req.body.bookName;

        const response = await axios.get(`https://openlibrary.org/search.json?q=${bookName}&limit=1`);
        const data = response.data;

        const info = {
            title: data.docs[0].title,
            cover_id: data.docs[0].cover_i,
            isbn: data.docs[0].isbn[0],
            published_year: data.docs[0].first_publish_year
        };
        // console.log(info);

        res.render("postCreation.ejs", {
            info: info
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.post("/create", async (req, res) => {
    try {
        const title = req.body.title;
        const isbn = req.body.isbn;
        const cover_id = req.body.cover_id;
        const published_year = req.body.published_year;
        const rating = req.body.rating;
        const review = req.body.review;

        await db.query("INSERT INTO notes (title, isbn, cover_id, published_year, rating, review) VALUES ($1, $2, $3, $4, $5, $6)", [title, isbn, cover_id, published_year, rating, review]);
        
        res.redirect("/");
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.post("/update/:id", async (req, res) => {
    try {
        currentPostId = parseInt(req.params.id, 10);
        const newRating = req.body.rating;
        const newReview = req.body.review;

        await db.query("UPDATE notes SET rating = $1, review = $2 WHERE id = $3", [newRating, newReview, currentPostId]);

        const updatedPost = await gettingThePost();
        res.render("reviewPage.ejs", {
            post: updatedPost
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.post("/delete/:id", async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id, 10);

        await db.query("DELETE FROM notes WHERE id = $1", [idToDelete]);
        res.redirect("/");
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.get("/sort/:id", (req, res) => {
    try {
        const sort = req.params.id;
        if (sort == "title") {
            sort_by = sort + " ASC";
        } else {
            sort_by = sort + " DESC";
        }
        
        res.redirect("/");
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});


app.listen(port, () => {
    console.log(`The server is running on port number ${port}`);
});