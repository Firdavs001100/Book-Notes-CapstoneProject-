import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
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

// NEW ENDPOINTS
app.get("/myPosts", (req, res) => {
    try {
        
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.get("/signUp", (req, res) => {
    try {
        const nickname = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const rememberTheUser = req.body.rememberTheUser;



    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.get("/login", (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const rememberTheUser = req.body.rememberTheUser;

        

    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

// PASSPORT AUTHORIZATION
passport.use(
    "local",
    new Strategy(async function verify(username, password, cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [
                username,
            ]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const storedHashedPassword = user.password;
                bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                    if (err) {
                        console.error("Error comparing passwords: ", err);
                        return cb(err);
                    } else {
                        if (valid) {
                            return cb(null, user);
                        } else {
                            return cb(null, false);
                        }
                    }
                });
            } else {
                return cb("User not found");
            }
        } catch (err) {
            console.log(err);
        }
    })
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/secrets",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                console.log(profile);
                const result = await db.query("SELECT * FROM users WHERE email = $1", [
                    profile.email,
                ]);
                if (result.rows.length === 0) {
                    const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
                        profile.email, "google"
                    ]);
                    return cb(null, newUser.rows[0]);
                } else {
                    // Already existing error
                    return cb(null, result.rows[0]);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`The server is running on port number ${port}`);
});