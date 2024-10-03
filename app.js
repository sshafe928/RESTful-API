const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();
const PORT = 5000;
const path = require('path');
const AdminToken = 'admin404'; // Use const for constants

app.set('json spaces', 4);

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

const updateBooksList = (books) => {
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

app.get('/api/books/delete/:title/:token', (req, res) => {
    const books = getBooks(); 

    const { title, token } = req.params;
    if (token !== AdminToken) {
        return res.status(403).json({ message: 'No Permissions' });
    }

    // Find the book by title
    const bookIndex = books.findIndex(book => book.title.toLowerCase() === title.toLowerCase());

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Remove the book from the array
    const [removedBook] = books.splice(bookIndex, 1);

    // Save the updated books list back to your data store
    updateBooksList(books);

    // Send a success response
    res.status(200).json({ message: 'Book removed successfully', book: removedBook });
});

app.get('/api/v1/book/query', (req, res) => {
    console.log(req.query);
    const { search, limit } = req.query;
    let sortedBooks = getBooks(); // Assuming getBooks() returns an array of book objects

    if (search) {
        const searchLower = search.toLowerCase();

        // Filter books by title (case-insensitive)
        sortedBooks = sortedBooks.filter((book) => {
            return String(book.title).toLowerCase().includes(searchLower);
        });
    }

    if (limit) {
        sortedBooks = sortedBooks.slice(0, Number(limit));
    }

    // Return response
    if (sortedBooks.length < 1) {
        return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: sortedBooks });
});


app.get('/api/v2/author/query', (req, res) => {
    console.log(req.query);
    const { search, limit } = req.query;
    let sortedAuthors = getAuthors(); // Assuming getAuthors() returns an array of author objects
    let books = getBooks(); // Assuming getBooks() returns an array of book objects

    if (search) {
        const searchLower = search.toLowerCase();

        // Filter authors by name (case-insensitive)
        sortedAuthors = sortedAuthors.filter((author) => {
            return String(author.name).toLowerCase().includes(searchLower);
        });
    }

    // Collect author IDs
    const authorIds = sortedAuthors.map(author => author.id); // Adjust `id` as necessary

    // Find books by matching author IDs
    const matchedBooks = books.filter(book => authorIds.includes(book.author_id)); // Adjust `author_id` as necessary

    if (limit) {
        matchedBooks = matchedBooks.slice(0, Number(limit));
    }

    // Return response
    if (matchedBooks.length < 1) {
        return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: matchedBooks });
});





app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`);
});

app.all('*', (req, res) => {
    res.status(404).send('Resource not found');
});