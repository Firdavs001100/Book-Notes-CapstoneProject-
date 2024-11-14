
//// api request to get COVER of the book
const API_COVER_URL = "https://covers.openlibrary.org/b/isbn";

// insert cover id here
const here = "";
const result = await axios.get(API_COVER_URL + `/${here}-M.jpg`);


//// api request to SEARCH for a BOOK
const API_SEARCH_URL = "https://openlibrary.org/search.json";

//get TITLE of The Book from the frontend
const titleSearch = req.body.titleSearch;
const result = await axios.get(API_SEARCH_URL + `?q=${titleSearch}`);


//// To get author details
const data = result.rows[0];
const authorName = data.docs[0].author_name;
const coverId = data.docs[0].cover_i;
const isbn = data.docs[0].isbn[0]; // need to check. The response might be error (isbn[0]). Might need to fetch the data and only get the first.
const publishedYear = data.docs[0].first_publish_year;

// get the current date 
const date = new Date().toISOString().split('.')[0] + "Z";
