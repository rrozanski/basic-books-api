# basic-books-api

## How to install and run
```
npm i
```
```
node ./index.js
```

## Available endpoints
```
GET /books
```

```
GET /book/:id
```

```
POST /book

{
 "title": string,
 "author": string,
 "pages": number,
 "rating": number,
 "description": string
}
```

```
PUT /book/:id

{
 "title": string,
 "author": string,
  "pages": number,
  "rating": number,
  "description": string
}
```

```
DELETE /book/:id
```
