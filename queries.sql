-- Create a database if not exists
CREATE DATABASE IF NOT EXISTS BookNotes;

-- This one if you already have a table in this name or just want to rewrite the table
DROP TABLE IF EXISTS notes;



-- Creating a table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    isbn VARCHAR(15),
    cover_id VARCHAR(15),
    published_year VARCHAR(15),
    rating INTEGER,
    review TEXT
);

-- Inserting values
INSERT INTO notes (title, isbn, cover_id, published_year, rating, review)
VALUES ('legend of wars', 'VA713791I', '883283', '2000', '5', 'I strongly recommend this book to everyone. The insight of what I got from it was very promising and definetely must read book.'), 
		('Noitengem', 'VA728332I', '283110', '2005', '9', 'I strongly recommend this book to everyone. The insight of what I got from it was very promising and definetely must read book.');




