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
        cookie: { 
            maxAge: null 
        },
    })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

db.connect();

let sort_by = "n.id ASC";
let currentPostId;

async function gettingThePost() {
    console.log("Fetching post with ID:", currentPostId);

    const response = await db.query(
        `SELECT n.id, n.title, n.isbn, n.cover_id, n.published_year, n.rating, n.review, u.nickname, n.user_id, u.email, u.nickname 
        FROM notes n
        JOIN users u ON u.id = n.user_id
        WHERE n.id = $1
        ORDER BY ${sort_by}`, [currentPostId]);

    const specificPost = response.rows[0];

    console.log("Fetched post data:", specificPost);

    return specificPost;
}

// Getting logged user's nickname from passport
async function gettingTheCurrentUser(req) {
    const nickname = req.user.nickname;
    const result = await db.query("SELECT id FROM users WHERE nickname = $1", [nickname]);
    const userId = result.rows[0].id;

    return userId;
}

app.get("/", async (req, res) => {
    try {
        const response = await db.query(
            `SELECT n.id, n.title, n.isbn, n.cover_id, n.published_year, n.rating, n.review, u.nickname, n.user_id, u.email, u.nickname 
            FROM notes n
            JOIN users u ON u.id = n.user_id
            ORDER BY ${sort_by}`);
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

// login and sign-up endpoints

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/signUp", (req, res) => {
    res.render("signUp.ejs");
});

//

app.get("/review/:id", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            currentPostId = parseInt(req.params.id, 10);
            const currentPost = await gettingThePost();
            const currentUser = await gettingTheCurrentUser(req);

            res.render("reviewPage.ejs", {
                post: currentPost,
                user: currentUser,
            });
        } catch (err) {
            console.log("The request was failed. ", err.message);
        } 
    } else {
        res.redirect("/login");
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
    if (req.isAuthenticated()) {
        try {
            res.render("postCreation.ejs");
        } catch (err) {
            console.log("The request was failed. ", err.message);
        }
    } else {
        res.redirect("/login");
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
        
        const user_id = await gettingTheCurrentUser(req);

        await db.query("INSERT INTO notes (title, isbn, cover_id, published_year, rating, review, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
            [title, isbn, cover_id, published_year, rating, review, user_id]
        );
        
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

        await db.query("UPDATE notes SET rating = $1, review = $2 WHERE id = $3", 
            [newRating, newReview, currentPostId]
        );

        const updatedPost = await gettingThePost();
        const currentUser = await gettingTheCurrentUser(req);
        res.render("reviewPage.ejs", {
            post: updatedPost,
            user: currentUser,
        });
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.post("/delete/:id", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const idToDelete = parseInt(req.params.id, 10);

            await db.query("DELETE FROM notes WHERE id = $1", [idToDelete]);
            res.redirect("/");
        } catch (err) {
            console.log("The request was failed. ", err.message);
        }    
    } else {
        res.render("/login");
    }
    
});

app.get("/sort/:id", (req, res) => {
    try {
        const sort = req.params.id;
        if (sort == "title") {
            sort_by = sort + " ASC";
        } else if (sort == "u.nickname") {
            sort_by = sort + " ASC";
        } else {
            sort_by = sort + " DESC";
        }
        
        res.redirect("/");
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

// special sort for myPosts page
app.get("/sortPost/:id", (req, res) => {
    try {
        const sort = req.params.id;
        if (sort == "title") {
            sort_by = sort + " ASC";
        } else if (sort == "u.nickname") {
            sort_by = sort + " ASC";
        } else {
            sort_by = sort + " DESC";
        }
        
        res.redirect("/myPosts");
    } catch (err) {
        console.log("The request was failed. ", err.message);
    }
});

app.get("/myPosts", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user_id = await gettingTheCurrentUser(req);
            const result = await db.query(
            `SELECT n.id, n.title, n.isbn, n.cover_id, n.published_year, n.rating, n.review, u.nickname, n.user_id, u.email, u.nickname 
            FROM notes n
            JOIN users u ON u.id = n.user_id
            WHERE user_id = $1
            ORDER BY ${sort_by}`, [user_id]);
            const posts = result.rows;

            res.render("myPosts.ejs", {
                posts: posts,
                user: user_id,
            });
        } catch (err) {
            console.log("The request was failed. ", err.message);
        }    
    } else {
        res.redirect("/login");
    }
    
});

// NEW ENDPOINTS

app.get("/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get("/auth/google/posts",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.post("/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }), (req, res) => {
        // additional logic here to handle the rememberMe functionality
        const rememberTheUser = req.body.rememberTheUser;

        if (rememberTheUser) {
            req.session.cookie.maxAge = 1000 * 60 * 60 *24;
        } else {
            req.session.cookie.expires = false;
        }

        res.redirect("/");
    }
);

app.post("/signUp", async  (req, res) => {
    const nickname = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const rememberTheUser = req.body.rememberTheUser;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (checkResult.rows.length > 0) {
            res.redirect("/login");
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing the password: ", err);
                } else {
                    const result = await db.query("INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING *", [
                        email, hash, nickname,
                    ]);
                    const user = result.rows[0];

                    // additional logic here to handle the rememberMe functionality
                    if (rememberTheUser) {
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
                    } else {
                        req.session.cookie.expires = false;
                    }

                    req.login(user, (err) => {
                        console.log("Successfully registered!");
                        res.redirect("/");
                    });
                }
            });
        }    
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
            callbackURL: "http://localhost:3000/auth/google/posts",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                console.log(profile);
                const result = await db.query("SELECT * FROM users WHERE email = $1", [
                    profile.email,
                ]);
                if (result.rows.length === 0) {
                    const newUser = await db.query("INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3)", [
                        profile.email, "google", profile.given_name,
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