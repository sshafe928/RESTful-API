const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();
const PORT = 5000;
const path = require('path');

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
const saveBooks = (books) => {
    fs.writeFileSync('./db/books.json', JSON.stringify(books, null, 2)); // Fix here
};

app.get('/', (req, res) => {
    const books = getBooks();
    const authors = getAuthors();

    // Combine books with their authors
    const booksWithAuthors = books.map(book => {
        const author = authors.find(author => author.id === book.author_id);
        return { ...book, authorName: author ? author.name : 'Unknown' };
    });

    res.render('pages/search', { books: booksWithAuthors }); 
});

app.get('/books', (req, res) => {
    const books = getBooks();
    const authors = getAuthors();

    // Combine books with their authors
    const booksWithAuthors = books.map(book => {
        const author = authors.find(author => author.id === book.author_id);
        return { ...book, authorName: author ? author.name : 'Unknown' };
    });

    res.render('pages/search', { books: booksWithAuthors }); 
});



app.get('/api/books/:sortID', (req, res) => {
    const sortBy = req.params.sortID;
    const search = req.query.search || ''; // Get the search query from query parameters
    const books = getBooks(); // Get the books

    // Filter books based on the search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase())
    );

    // Sort based on the sorting criteria
    let sortedBooks;
    if (sortBy === 'author') {
        sortedBooks = filteredBooks.sort((a, b) => a.author_id - b.author_id);
    } else if (sortBy === 'date') {
        sortedBooks = filteredBooks.sort((a, b) => a.published_year - b.published_year);
    } else if (sortBy === 'alphabetically') {
        sortedBooks = filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        sortedBooks = filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.json(sortedBooks);
});

app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
});

app.all('*', (req, res) => {
    res.status(404).send('Resource not found');
});