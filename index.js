const express = require("express");
const body_parser = require('body-parser');
const cors = require('cors');
const joi = require('joi');
const uuid = require('uuid/v4');
const app = express();

// TODO: package.json

const bookSchema = joi.object().keys({
    title: joi.string().max(100).required(),
    author: joi.string().max(100).required()
});

let books = [
    {
        id: uuid(),
        title: 'Dune',
        author: 'Frank Herbert'
    },
    {
        id: uuid(),
        title: 'Guards! Guards!',
        author: 'Terry Pratchett'
    },
    {
        id: uuid(),
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien'
    },
];

app.use(cors());
app.use(body_parser.json());

app.listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
});

app.get("/books", (req, res) => {
    res.json(books);
});

app.get("/book/:id", (req, res) => {
    const book = books.find((item) => item.id === req.params.id);

    if (!book) {
        res.sendStatus(404);
    }

    res.json(book);
});

app.post("/book", (req, res) => {
    const book = req.body;
    const result = joi.validate(book, bookSchema);

    if (result.error) {
        res.sendStatus(500);
    }

    const newBook = { id: uuid(), ...book };

    books.push(newBook);

    res.status(200).send(newBook);
});

app.put("/book/:id", (req, res) => {
    const bookExists = books.some((item) => item.id === req.params.id);

    if (!bookExists) {
        res.sendStatus(404);
    }

    const updatedBook = req.body;
    const result = joi.validate(updatedBook, bookSchema);

    if (result.error) {
        res.sendStatus(500);
    }

    const updatedBookWithId = { id: req.params.id, ...req.body };

    books = [...books].map((item) => {
        if (item.id === updatedBookWithId.id) {
            return updatedBookWithId;
        }

        return item;
    });

    res.status(200).send(updatedBookWithId);
});

app.delete("/book/:id", (req, res) => {
    const book = books.find((item) => item.id === req.params.id);

    if (!book) {
        res.sendStatus(404);
    }

    books = [...books].filter((item) => item.id !== book.id);

    res.json(book);
});
