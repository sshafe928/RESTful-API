# RESTful-API

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Viewing All Books](#viewing-all-books)
  - [Finding a Book by ID](#finding-a-book-by-id)
  - [Creating New Books](#creating-new-books)
  - [Deleting Books](#deleting-books)
  - [Finding Books by Title](#finding-books-by-title)
  - [Finding Books by Author](#finding-books-by-author)
  - [Updating a Book](#updating-a-book)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Project Overview

The Booklist API is a simple Node.js application built with Express and EJS. It allows users to manage a collection of books, including functionalities to view, add, edit, and delete books through a RESTful API.

## Features

- View a list of all books
- Retrieve book details by ID
- Create new books
- Delete existing books
- Search for books by title or author
- Update book information

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/booklist-api.git
   ```

2. Navigate to the project directory:
    ```bash
    cd booklist-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm start
    ```
    The server will start running on http://localhost:5000.

    ## Usage

### Viewing All Books
Navigate to `http://localhost:5000/books` to view the list of all books.

### Finding a Book by ID
To find a specific book, send a GET request to `/api/books/:bookID` where `:bookID` is the ID of the book.

### Creating New Books
To create a new book, send a POST request to `/api/books/add/:title/:authorName/:published_year/:token` with the following data:

```json
{
  "title": "New Book Title",
  "author": "Author Name",
  "published_year": 2024
}
```

### Deleting Books
To delete a book, send a POST request to `/api/books/delete/:title/:token` where `:title` is the title of the book to be deleted.

### Finding Books by Title
To search for books containing a specific title or keyword, send a GET request to `/api/v1/book/query?title=keyword`.

### Finding Books by Author
To find all books by a specific author, send a GET request to `/api/v2/author/query?name=AuthorName`.

### Updating a Book
To update book details, send a POST request to `/api/books/update/:title/:newTitle/:newAuthorName/:newPublishedYear/:token` with the following data:

```json
{
  "newTitle": "Updated Title",
  "newAuthorName": "Updated Author",
  "newPublishedYear": 2025
}
```

## Versions

- **v1.0.1**: 20240926T023800 - Initial commit, adding the gitignore and licence
- **v1.0.2**: 20240926T031000 - Creating file structure, setting up the app.js
- **v1.0.3**: 20240926T090900 - Creating the data json files
- **v1.0.4**: 20240927T025100 - Adding images
- **v1.0.5**: 20240927T025400 - Merging branches
- **v1.0.6**: 20240929T031100 - Added more images and css
- **v1.0.7**: 20240929T093600 - Attempting h1 css
- **v1.0.8**: 20240930T092000 - Adding css and button functionality
- **v1.0.9**: 20241001T031600 - Restarting Project
- **v1.1.0**: 20241002T125100 - Bulk functionality
- **v1.1.1**: 20241002T015700 - Update app.js
- **v1.1.2**: 20241003T122200 - Adding Query searches
- **v1.1.3**: 20241003T025000 - Adding css
- **v1.1.4**: 20241003T031600 - Finished all functionality except update, minimal Css
- **v1.1.5**: 20241003T084600 - Css Finished, Update function done

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Contact
If you have any questions, feel free to reach out to us at [sabrinashafer321@gmail.com].