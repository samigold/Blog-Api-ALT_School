# Blogging API

This is an API for managing a blog platform.

---

## Requirements

1. Users should have attributes like first_name, last_name, email, password, and any other desired attributes.
2. Users should be able to register and log in to the blog application.
3. Implement JWT for authentication, with tokens expiring after 1 hour.
4. Blogs can be in two states: draft or published.
5. Both authenticated and unauthenticated users should be able to view a list of published blogs.
6. Both authenticated and unauthenticated users should be able to view a specific published blog.
7. Authenticated users should be able to create a blog.
8. Newly created blogs should default to the draft state.
9. Blog owners should be able to change the state of their blogs to published.
10. Blog owners should be able to edit their blogs, regardless of the state.
11. Blog owners should be able to delete their blogs, regardless of the state.
12. Blog owners should be able to view a list of their blogs.
  a. The endpoint should support pagination.
  b. It should be filterable by state.
13. Blogs should have attributes like title, description, tags, author, timestamp, state, read_count, reading_time, and body.
14. The endpoint for listing blogs accessible to both authenticated and unauthenticated users should support pagination.
  a. Default to 20 blogs per page.
  b. It should be searchable by author, title, and tags.
  c. It should be sortable by read_count, reading_time, and timestamp.
15. When a single blog is requested, the API should return the author's information and increment the blog's read_count by 1.
16. Implement an algorithm to calculate the reading_time of a blog.

---

## Setup

- Install NodeJS and MongoDB.
- Clone this repository.
- Update the .env file.
- Run `npm install`.
- Run `node app.js`.

---

## Base URL

- https://blogging-api-example.onrender.com/

## Models

---

### User

| field     | data_type | constraints      |
| --------- | --------- | ---------------- |
| username  | string    | required, unique |
| firstname | string    | required         |
| lastname  | string    | required         |
| email     | string    | required, unique |
| password  | string    | required         |

### Blog

| field        | data_type | constraints      |
| ------------ | --------- | ---------------- |
| title        | string    | required, unique |
| description  | string    | required         |
| tags         | array     | required         |
| author       | string    | required         |
| read_count   | number    | default: 0       |
| reading_time | number    |                  |
| body         | string    | required, unique |
| state        | string    | required, enum: ['draft', 'published'], default: "draft" |

## APIs

---

### Routes For Non-Logged in Users

### Get all published Blogs

- Route: /blog
- Method: GET
- Responses

Success

```json
{
  "total_blogs": 2,
  "blogs": [
  {
    "_id": "6369006fafed4b7c8b529d04",
    "title": "Alice's Blog Post",
    "description": "A blog post by Alice Johnson",
    "tags": ["Johnson", "Blog", "Alice"],
    "author": "alice johnson",
    "state": "published",
    "read_count": 0,
    "reading_time": 1,
    "body": "Alice's blog content goes here...",
    "createdAt": "2022-11-07T12:56:15.157Z",
    "updatedAt": "2022-11-07T13:13:20.316Z",
    "__v": 0
  },
  {
    "_id": "636907ceafed4b7c8b529d0c",
    "title": "Alice's Second Blog Post",
    "description": "Another blog post by Alice Johnson",
    "tags": ["Johnson", "Blog", "Alice"],
    "author": "alice johnson",
    "state": "published",
    "read_count": 0,
    "reading_time": 2,
    "body": "Alice's second blog content goes here...",
    "createdAt": "2022-11-07T13:27:42.072Z",
    "updatedAt": "2022-11-07T13:29:51.190Z",
    "__v": 0
  }
  ]
}
```

### Get a specific published Blog by id for non-logged in users

- Route: /blog/:id
- Method: GET
- Responses

Success

```json
{
  "status": true,
  "written_by": "alice johnson",
  "blogResult": {
  "_id": "636907ceafed4b7c8b529d0c",
  "title": "Alice's Second Blog Post",
  "description": "Another blog post by Alice Johnson",
  "tags": ["Johnson", "Blog", "Alice"],
  "author": "alice johnson",
  "state": "published",
  "read_count": 1,
  "reading_time": 2,
  "body": "Alice's second blog content goes here...",
  "createdAt": "2022-11-07T13:27:42.072Z",
  "updatedAt": "2022-11-07T13:29:51.190Z",
  "__v": 0
  }
}
```

### Signup User

- Route: /signup
- Method: POST
  -- use form-encode format for the body signup
- Body:

```
| field     | data_type   |
|-----------|-------------|
| username  | alicejohn   |
| firstname | alice       |
| lastname  | johnson     |
| email     | alice@mail.com |
| password  | 12345       |
```

- Responses

Success

```json
{
  "message": "Signup successful",
  "user": {
  "firstname": "alice",
  "lastname": "johnson",
  "username": "alicejohn",
  "email": "alice@mail.com",
  "password": "$2b$10$bCv1XyAFeX2k38hZ4uTlvuv6hZi8MHyFKN4OHSXXOTs5EfKqWQipu",
  "_id": "6368f9baafed4b7c8b529cfe",
  "createdAt": "2022-11-07T12:27:38.038Z",
  "updatedAt": "2022-11-07T12:27:38.038Z",
  "fullname": "alice johnson",
  "__v": 0
  }
}
```

---

### Login User

- Route: /login
- Method: POST
  -- use form-encode format for the body signup
- Body:

```
| field    | data_type |
|----------|-----------|
| username | alicejohn |
| password | 12345     |
```

- Responses

Success

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzNjhmOWJhYWZlZDRiN2M4YjUyOWNmZSIsInVzZXJuYW1lIjoiYWxpY2Vqb2huIiwiZnVsbG5hbWUiOiJhbGljZSBqb2huc29uIn0sImlhdCI6MTY2NzgyNDgxNCwiZXhwIjoxNjY3ODI4NDE0fQ.w_kuz9gCsUlvKHaSAio4u0JJv9vt_aFakAP61kkCBY4"
}
```

---

### Create blog

- Route: /authorblog
- Method: POST
- Header
  - Authorization (Query Parameters): secret_token = {token}
- The blog author is updated based on the full name of the logged-in user.
- Body:

```json
{
  "title": "Alice's Blog Post",
  "description": "A blog post by Alice Johnson",
  "tags": ["Johnson", "Blog", "Alice"],
  "body": "Alice's blog content goes here..."
}
```

- Responses

Success

```json
{
  "status": true,
  "blog": {
  "title": "Alice's Blog Post",
  "description": "A blog post by Alice Johnson",
  "tags": ["Johnson", "Blog", "Alice"],
  "author": "alice johnson",
  "state": "draft",
  "read_count": 0,
  "reading_time": 1,
  "body": "Alice's blog content goes here...",
  "_id": "6369006fafed4b7c8b529d04",
  "createdAt": "2022-11-07T12:56:15.157Z",
  "updatedAt": "2022-11-07T12:56:15.157Z",
  "__v": 0
  }
}
```

---

### Get all author Blog

- Route: /authorblog
- Method: GET
- Header
  - Authorization (Query Parameters): secret_token = {token}
- Responses

Success

```json
{
  "total_blogs": 1,
  "blogs": [
  {
    "_id": "6369006fafed4b7c8b529d04",
    "title": "Alice's Blog Post",
    "description": "A blog post by Alice Johnson",
    "tags": ["Johnson", "Blog", "Alice"],
    "author": "alice johnson",
    "state": "draft",
    "read_count": 0,
    "reading_time": 1,
    "body": "Alice's blog content goes here...",
    "createdAt": "2022-11-07T12:56:15.157Z",
    "updatedAt": "2022-11-07T12:56:15.157Z",
    "__v": 0
  }
  ]
}
```

---

### Get specific blog by the author

- Route: /authorblog/:id
- Method: GET
- Header:
  - Authorization (Query Parameters): secret_token = {token}
- Responses

Success

```json
{
  "status": true,
  "written_by": "alice johnson",
  "blogResult": {
  "_id": "6369006fafed4b7c8b529d04",
  "title": "Alice's Blog Post",
  "description": "A blog post by Alice Johnson",
  "tags": ["Johnson", "Blog", "Alice"],
  "author": "alice johnson",
  "state": "draft",
  "read_count": 0,
  "reading_time": 1,
  "body": "Alice's blog content goes here...",
  "createdAt": "2022-11-07T12:56:15.157Z",
  "updatedAt": "2022-11-07T12:56:15.157Z",
  "__v": 0
  }
}
```

---

### Update specific blog by the author

- Route: /authorblog/:id
- Method: PATCH
- Header:
  - Authorization (Query Parameters): secret_token = {token}
- Body:
  {
  "state": "published"
  }

- Responses

Success

```json
{
  "_id": "6369006fafed4b7c8b529d04",
  "title": "Alice's Blog Post",
  "description": "A blog post by Alice Johnson",
  "tags": ["Johnson", "Blog", "Alice"],
  "author": "alice johnson",
  "state": "published",
  "read_count": 0,
  "reading_time": 1,
  "body": "Alice's blog content goes here...",
  "createdAt": "2022-11-07T12:56:15.157Z",
  "updatedAt": "2022-11-07T13:13:20.316Z",
  "__v": 0
}
```

---

## Contributor

- Samuel Madu
```
#   B l o g - A p i - A L T _ S c h o o l  
 