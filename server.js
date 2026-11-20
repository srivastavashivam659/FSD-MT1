const express = require("express");
const app = express();

app.use(express.json());


let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];


app.get("/api/books", (req, res) => {
    const author = req.query.author;

    if (author) {
        const result = books.filter(book =>
            book.author.toLowerCase().includes(author.toLowerCase())
        );
        return res.status(200).json(result);
    }

    res.status(200).json(books);
});

app.post("/api/books", (req, res) => {
    const { title, author, genre, publishedYear, available } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof genre !== "string" || !genre.trim() ||
        !Number.isInteger(publishedYear) ||
        typeof available !== "boolean"
    ) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    const newBook = {
        id: Math.max(...books.map(b => b.id), 100) + 1,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});


app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, genre, publishedYear, available } = req.body;

    if (
        (title !== undefined &&
            (typeof title !== "string" || !title.trim())) ||
        (author !== undefined &&
            (typeof author !== "string" || !author.trim())) ||
        (genre !== undefined &&
            (typeof genre !== "string" || !genre.trim())) ||
        (publishedYear !== undefined &&
            !Number.isInteger(publishedYear)) ||
        (available !== undefined &&
            typeof available !== "boolean")
    ) {
        return res.status(400).json({
            message: "Invalid update data"
        });
    }

    books[index] = {
        ...books[index],
        ...req.body,
        id: books[index].id
    };

    res.status(200).json(books[index]);
});


app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});