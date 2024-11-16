-- Database name is "BookNotes" --


-- Creating a table

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    isbn VARCHAR(15),
    author_name VARCHAR(30),
    cover_id VARCHAR(15),
    published_year VARCHAR(15),
    rate INTEGER,
    review TEXT
);


INSERT INTO notes (title, isbn, author_name, cover_id, published_year, rate, review)
VALUES ('legend of wars', 'VA713791I', 'John Adam', '883283', '2000-12-10', '5', 'I strongly recommend this book to everyone. The insight of what I got from it was very promising and definetely must read book.'), 
		('Noitengem', 'VA728332I', 'Backham', '283110', '2005-04-11', '9', 'I strongly recommend this book to everyone. The insight of what I got from it was very promising and definetely must read book.')




