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







