const express = require("express");
const body_parser = require('body-parser');
const cors = require('cors');
const joi = require('joi');
const uuid = require('uuid/v4');
const app = express();

const bookSchema = joi.object().keys({
    title: joi.string().max(100).required(),
    author: joi.string().max(100).required(),
    pages: joi.number().min(1).max(2000).required(),
    rating: joi.number().min(0).max(5).required(),
    description: joi.string().max(1000).required()
});

let books = [
    {
        id: uuid(),
        title: 'Dune',
        author: 'Frank Herbert',
        pages: 661,
        rating: 5,
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for...'
    },
    {
        id: uuid(),
        title: 'Guards! Guards!',
        author: 'Terry Pratchett',
        pages: 376,
        rating: 4,
        description: 'This is where the dragons went. They lie ... not dead, not asleep, but ... dormant. And although the space they occupy isn\'t like normal space, nevertheless they are packed in tightly. They could put you in mind of a can of sardines, if you thought sardines were huge and scaly. And presumably, somewhere, there\'s a key...'

    },
    {
        id: uuid(),
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        pages: 366,
        rating: 3,
        description: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.'
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

    const newBook = {id: uuid(), ...book};

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

    const updatedBookWithId = {id: req.params.id, ...req.body};

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
