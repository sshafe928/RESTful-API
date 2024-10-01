const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();
const PORT = 5000;
const path = require('path');
const AdminToken = 'admin404'; // Use const for constants

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const getBooks = () => {
    const data = fs.readFileSync('./db/books.json', 'utf8');
    return JSON.parse(data);
    
};

const getAuthors = () => {
    const data = fs.readFileSync('./db/authors.json', 'utf8');
    return JSON.parse(data);
};

// Function to save books back to the JSON file
const saveBooks = (newBook) => {
    const books = getBooks();
    books.push(newBook); 
    fs.writeFileSync('./db/books.json', JSON.stringify(books, null, 2));
};

const saveAuthors = (authors) => {
    fs.writeFileSync('./db/authors.json', JSON.stringify(authors, null, 2));
};

app.get('/', (req, res) => {
    res.render('pages/search'); 
});

app.get('/books', (req, res) => {
    const books = getBooks();
    const authors = getAuthors();

    const newBooks = books.map(book => {
        const { id, title, author_id, published_year } = book;
        const author = authors.find(author => author.id === author_id);
        const authorName = author ? author.name : 'Unknown';
        return { id, title, authorName, published_year };
    });

    res.json(newBooks);
});

app.get('/api/books/:bookID', (req, res) => {
    const books = getBooks();
    const { bookID } = req.params;
    const singleBook = books.find((book) => book.id === Number(bookID));

    if (!singleBook) {
        return res.status(404).send('Book not found/Item does not exist');
    }

    return res.json(singleBook);
});

app.get('/api/books/add/:title/:authorName/:published_year/:token', (req, res) => {
    const books = getBooks(); // Get existing books
    let authors = getAuthors(); // Get existing authors

    const { title, authorName, published_year, token } = req.params;

    // Check for admin token
    if (token !== AdminToken) {
        return res.status(403).json({ message: 'No Permissions' });
    }

    // Check if the author already exists
    const existingAuthor = authors.find(author => author.name.toLowerCase() === authorName.toLowerCase());

    let authorId;
    if (existingAuthor) {
        authorId = existingAuthor.id;
    } else {
        // If author does not exist, add the new author
        authorId = authors.length + 1; 
        authors.push({ id: authorId, name: authorName });
        
        // Save updated authors to the JSON file
        saveAuthors(authors);
    }

    // Create a new book object
    const newBook = {id: books.length + 1, title, author_id: authorId, published_year: parseInt(published_year)};

    saveBooks(newBook); // Save the new book

    // Send a success response
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});


app.get('/api/books/delete/:title/:published_year/:token', (req, res) => {
    const books = getBooks(); // Get existing books

    const { title, published_year, token } = req.params;

    // Check for admin token
    if (token !== AdminToken) {
        return res.status(403).json({ message: 'No Permissions' });
    }

    const newBook = {id: books.length + 1, title, author_id: authorId, published_year: parseInt(published_year)};

    saveBooks(newBook); // Save the new book

    // Send a success response
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});


app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
});

app.all('*', (req, res) => {
    res.status(404).send('Resource not found');
});