# 🎬 Movie Ticket Booking Backend — Complete Documentation

> This document explains **every single file and function** in your project in simple language. You don't need to look at the code — just read this.

---

## 📁 Project Structure (Big Picture)

```
movie-booking-backend/
├── config/db.js            → Connects to MongoDB database
├── models/                 → Defines what data looks like (schemas)
│   ├── user.js             → User data structure
│   ├── Movie.js            → Movie data structure
│   ├── Theater.js          → Theater data structure
│   ├── Show.js             → Show data structure
│   └── Booking.js          → Booking data structure
├── utils/                  → Helper/utility functions
│   ├── tokenGenerator.js   → Creates JWT tokens
│   └── tmdb.js             → Fetches movies from TMDB API
├── middleware/
│   └── authMiddleware.js   → Checks if user is logged in
├── controllers/            → The actual logic (brain of the app)
│   ├── authController.js   → Signup, Login, Get Profile
│   ├── movieController.js  → Get movies, Search movies
│   ├── theaterController.js→ Get theaters, Filter by town
│   ├── showController.js   → Get shows, Check seats
│   └── bookingController.js→ Book tickets, Cancel booking
├── routes/                 → URL paths (which URL calls which function)
│   ├── authRoutes.js       → /api/auth/...
│   ├── movieRoutes.js      → /api/movies/...
│   ├── theaterRoutes.js    → /api/theaters/...
│   ├── showRoutes.js       → /api/shows/...
│   └── bookingRoutes.js    → /api/bookings/...
├── seed/                   → One-time scripts to fill database
│   ├── seedData.js         → Main seed script (runs everything)
│   ├── theaters.js         → List of 12 theaters
│   └── generateShows.js    → Creates 108 show entries
├── .env                    → Secret keys and config
├── package.json            → Project info and dependencies
└── server.js               → Starting point of the app
```

---

## 🔑 How The App Works (Simple Flow)

```
User opens app
    → Frontend sends HTTP request (GET, POST, etc.)
        → Express server receives it (server.js)
            → Routes decide which controller to call (routes/)
                → Controller runs the logic (controllers/)
                    → Controller talks to Database using Models (models/)
                        → Database returns data
                            → Controller sends response back to user
```

---

## 📄 File-by-File Explanation

---

## 1. `.env` — Environment Variables

```
MONGO_URI=mongodb+srv://bala:...@cluster0...    → Your MongoDB Atlas connection string
JWT_SIGNATURE=JWTTOKENGENERATOR                 → Secret key used to create JWT tokens
PORT=5000                                       → Server runs on this port
TMDB_API_KEY=907c81ad...                        → Your TMDB API key for fetching movies
```

> [!NOTE]
> **Why .env?** We keep passwords and secret keys here instead of in the code. If someone sees your code on GitHub, they won't see your passwords because `.gitignore` hides this file.

---

## 2. `server.js` — The Starting Point

This is the **first file** that runs when you do `npm start`. Think of it as the **main gate** of your app.

**What it does step by step:**

| Line | What it does |
|------|-------------|
| `import 'dotenv/config'` | Loads all variables from `.env` file so we can use `process.env.MONGO_URI` etc. |
| `import express from 'express'` | Imports Express — the framework that handles HTTP requests |
| `import cors from 'cors'` | Imports CORS — allows your frontend (React) to talk to this backend |
| `const app = express()` | Creates the Express application |
| `const port = process.env.PORT \|\| 5000` | Uses port from .env, or 5000 if not set |
| `app.use(cors({...}))` | Tells the server: "Allow requests from these websites only" |
| `app.use(express.json())` | Tells Express: "Parse JSON data from request body" (without this, `req.body` would be undefined) |
| `app.get('/')` | When someone visits `http://localhost:5000/`, show a simple message |
| `app.use('/api/auth', authRoutes)` | Any URL starting with `/api/auth` → go to authRoutes file |
| `app.use('/api/movies', movieRoutes)` | Any URL starting with `/api/movies` → go to movieRoutes file |
| `connectDB()` | Connect to MongoDB Atlas database |
| `app.listen(port)` | Start the server and listen for requests |

> [!TIP]
> **Think of `app.use()` like a receptionist.** When someone comes to `/api/movies`, the receptionist says "Go to the movies department (movieRoutes)". The movieRoutes then decides which specific person (controller function) should handle it.

---

## 3. `config/db.js` — Database Connection

**What it does:** Connects your app to MongoDB Atlas (cloud database).

```
connectDB function:
  1. Calls mongoose.connect() with the MONGO_URI from .env
  2. If connection succeeds → prints "MongoDB connected successfully"
  3. If connection fails → prints error and stops the app (process.exit(1))
```

**Special lines explained:**
- `setServers(["1.1.1.1", "8.8.8.8"])` — This changes DNS servers to Cloudflare and Google. Sometimes your default DNS can't find MongoDB Atlas servers, so this fixes that problem.

> [!NOTE]
> **What is Mongoose?** Mongoose is a library that makes talking to MongoDB easier. Instead of writing raw MongoDB queries, you can use simple JavaScript like `User.find()` or `Movie.create()`.

---

## 4. Models — Data Structures

Models define **what data looks like** in your database. Think of them as **templates** or **forms**.

---

### 4a. `models/user.js` — User Model

Defines what a user looks like in the database:

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| `name` | String | Required, trimmed | `"Bala"` |
| `email` | String | Required, unique, lowercase | `"bala@gmail.com"` |
| `password` | String | Required, min 6 characters | `"$2b$10$ikME6..."` (hashed) |
| `createdAt` | Date | Auto-set to current time | `2026-06-26T01:55:28Z` |

**Key things:**
- `unique: true` on email → No two users can have the same email
- `trim: true` → Removes extra spaces (` bala ` becomes `bala`)
- `lowercase: true` → Converts email to lowercase (`Bala@Gmail.com` becomes `bala@gmail.com`)
- `minlength: 6` → Password must be at least 6 characters

---

### 4b. `models/Movie.js` — Movie Model

| Field | Type | Default | Example |
|-------|------|---------|---------|
| `title` | String | Required | `"RRR"` |
| `genre_ids` | Array of Numbers | `[]` | `[28, 36, 18]` (Action, History, Drama) |
| `language` | String | `'te'` | `"te"` (Telugu) |
| `posterUrl` | String | `''` | `"https://image.tmdb.org/t/p/w500/..."` |
| `description` | String | `''` | `"A tale of two legendary..."` |
| `duration` | Number | `150` | `150` (minutes) |
| `vote_average` | Number | `0` | `7.7` |
| `tmdbId` | Number | unique | `579583` (TMDB's ID for this movie) |

> [!NOTE]
> **What are genre_ids?** TMDB uses numbers for genres. `28` = Action, `35` = Comedy, `18` = Drama, `10749` = Romance, `53` = Thriller, `27` = Horror, `10751` = Family, `878` = SciFi.

---

### 4c. `models/Theater.js` — Theater Model

| Field | Type | Default | Example |
|-------|------|---------|---------|
| `name` | String | Required | `"PVR Cinemas Vijayawada"` |
| `village` | String | Required | `"Vijayawada"` |
| `address` | String | `''` | `"MG Road, Vijayawada, AP"` |
| `screens` | Number | `1` | `2` |
| `genres` | Array of Numbers | `[]` | `[28, 18]` (this theater shows Action & Drama movies) |

> [!TIP]
> The `genres` field is important — it decides which movies play at this theater. A theater with `[28, 18]` will get Action and Drama movies assigned to it.

---

### 4d. `models/Show.js` — Show Model

A "show" is one specific screening — like "RRR at PVR Vijayawada on June 26 at 10 AM".

| Field | Type | Default | Example |
|-------|------|---------|---------|
| `movie` | ObjectId (ref → Movie) | Required | Links to a Movie document |
| `theater` | ObjectId (ref → Theater) | Required | Links to a Theater document |
| `date` | String | Required | `"2026-06-26"` |
| `time` | String | Required | `"10:00 AM"` |
| `price` | Number | Required | `120` |
| `totalSeats` | Number | `60` | `60` |
| `bookedSeats` | Array of Strings | `[]` | `["A1", "A2", "B5"]` |

**Key concepts:**
- `ref: 'Movie'` means this field stores a **link** to a Movie document (like a foreign key in SQL)
- `bookedSeats` starts empty `[]`. When someone books seat A1, it becomes `["A1"]`. When another person books B5, it becomes `["A1", "B5"]`
- Seats are named like `A1` to `F10` (6 rows × 10 columns = 60 seats)

**Seat Layout:**
```
Screen
--------------------------
A1  A2  A3  A4  A5  A6  A7  A8  A9  A10    ← Row A
B1  B2  B3  B4  B5  B6  B7  B8  B9  B10    ← Row B
C1  C2  C3  C4  C5  C6  C7  C8  C9  C10    ← Row C
D1  D2  D3  D4  D5  D6  D7  D8  D9  D10    ← Row D
E1  E2  E3  E4  E5  E6  E7  E8  E9  E10    ← Row E
F1  F2  F3  F4  F5  F6  F7  F8  F9  F10    ← Row F
```

---

### 4e. `models/Booking.js` — Booking Model

| Field | Type | Default | Example |
|-------|------|---------|---------|
| `user` | ObjectId (ref → User) | Required | Links to User who booked |
| `show` | ObjectId (ref → Show) | Required | Links to the Show |
| `seats` | Array of Strings | Required | `["A1", "A2", "A3"]` |
| `totalAmount` | Number | Required | `360` (3 seats × ₹120) |
| `status` | String | `'confirmed'` | `"confirmed"` or `"cancelled"` |

---

## 5. Utils — Helper Functions

---

### 5a. `utils/tokenGenerator.js` — JWT Token Creator

```javascript
function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SIGNATURE, {expiresIn:'1d'})
}
```

**What this does:**
1. Takes a user's `_id` (from MongoDB)
2. Creates a JWT token that contains this id
3. Signs it with your secret key (`JWT_SIGNATURE` from .env)
4. Token expires after 1 day (`'1d'`)

**What is a JWT token?**
Think of it like a **movie ticket with your name on it**. Every time you want to do something (book tickets, see your bookings), you show this token. The server checks if it's valid and knows who you are.

**Example token:** `eyJhbGciOiJIUzI1NiIs...` (looks like random text but it contains your user id inside)

---

### 5b. `utils/tmdb.js` — TMDB Movie Fetcher

**What is TMDB?** The Movie Database — a free API that has info about every movie in the world.

```
fetchTeluguMovies function:
  1. Loop through 3 pages of TMDB results (each page has ~20 movies)
  2. For each movie, extract: title, genres, poster, description, rating
  3. Build a poster URL like: https://image.tmdb.org/t/p/w500/poster.jpg
  4. Return first 50 movies
```

**The API URL breakdown:**
```
https://api.themoviedb.org/3/discover/movie
  ?api_key=YOUR_KEY                    → Your authentication
  &with_original_language=te           → Only Telugu movies
  &sort_by=popularity.desc             → Most popular first
  &vote_count.gte=100                  → At least 100 votes (filters out unknown movies)
  &page=1                              → Page number (1, 2, 3)
```

---

## 6. `middleware/authMiddleware.js` — Login Checker

This is like a **security guard**. Before certain routes (booking, profile), this function checks: "Is this person logged in?"

```
protect function - step by step:

1. Look at the request headers for "Authorization"
   Example header: "Bearer eyJhbGciOiJIUzI1NiIs..."

2. If header exists and starts with "Bearer":
   a. Extract the token (everything after "Bearer ")
   b. Verify the token using jwt.verify() with our secret key
   c. If valid → find the user in database using the id from token
   d. Attach user to req.user (so controllers can access it)
   e. Call next() → let the request continue to the controller

3. If no token or invalid token:
   → Send 401 error ("Not authorized")
```

> [!IMPORTANT]
> **What is `next()`?** In Express, middleware sits between the route and the controller. `next()` means "I'm done checking, pass this request to the next function (the controller)". If we don't call `next()`, the request just stops here.

**How it's used:**
```javascript
// Without protection — anyone can access
router.get('/movies', getMovies)

// With protection — only logged-in users
router.post('/bookings', protect, createBooking)
//                        ↑ this runs first
//                                ↑ this runs only if protect calls next()
```

---

## 7. Controllers — The Brain

Controllers have the **actual logic**. They receive requests, talk to the database, and send responses.

---

### 7a. `controllers/authController.js` — Authentication

#### `signUp` function
**URL:** POST `/api/auth/register`
**Body needed:** `{ name, email, password }`

```
Step by step:
1. Get name, email, password from request body (req.body)
2. Check if a user with this email already exists
   → If yes: return 400 "user already exists"
3. Hash the password using bcrypt (converts "test123" to "$2b$10$ikME6...")
   → Why? We never store plain passwords. If database gets hacked,
     hackers see "$2b$10$ikME6..." not "test123"
4. Create new user in database with hashed password
5. Generate a JWT token for this user
6. Return the user object + token
```

**What is bcrypt.hash(password, 10)?**
- `password` = the plain text password like "test123"
- `10` = salt rounds (how many times to shuffle the password). More rounds = more secure but slower. 10 is the standard.
- Returns something like `"$2b$10$ikME6RNV3IPpN1JU/tz7au4oCjXBe9B6hBU4t.bVSqLam5NPOJSGi"`

---

#### `login` function
**URL:** POST `/api/auth/login`
**Body needed:** `{ email, password }`

```
Step by step:
1. Get email and password from request body
2. Find user in database by email
   → If no user found: return 400 "user not found"
3. Compare the entered password with the stored hashed password
   using bcrypt.compare()
   → If they don't match: return 400 "Invalid credentials"
4. Generate a JWT token
5. Return user object + token
```

**What is bcrypt.compare()?**
- You can't "un-hash" a password. So bcrypt takes the entered password, hashes it the same way, and checks if the result matches the stored hash.
- `bcrypt.compare("test123", "$2b$10$ikME6...")` → returns `true` or `false`

---

#### `getMe` function
**URL:** GET `/api/auth/me` (protected — needs token)

```
Step by step:
1. req.user is already set by authMiddleware (the protect function)
2. Find the user by their id, but exclude the password field
   (.select('-password') means "give me everything EXCEPT password")
3. Return the user object
```

---

### 7b. `controllers/movieController.js` — Movies

#### `getMovies` function
**URL:** GET `/api/movies`
**Optional query params:** `?genre=28` or `?search=pushpa`

```
Step by step:
1. Start with an empty filter object: {}
2. If ?genre=28 is in the URL:
   → Add to filter: { genre_ids: 28 }
   → This finds movies where genre_ids array contains 28
3. If ?search=pushpa is in the URL:
   → Add to filter: { title: {$regex: "pushpa", $options: "i"} }
   → $regex means "search for this text inside the title"
   → $options: "i" means case-insensitive (finds "Pushpa", "PUSHPA", "pushpa")
4. Find movies matching the filter
5. Return the movies array
```

**Example requests:**
```
GET /api/movies              → Returns ALL 16 movies
GET /api/movies?genre=28     → Returns only Action movies
GET /api/movies?search=rrr   → Returns movies with "rrr" in title
```

---

#### `getMovieById` function
**URL:** GET `/api/movies/:id`

```
Step by step:
1. Get the movie id from the URL (req.params.id)
   Example: /api/movies/6a3ddbb7ecc5ec5a21d5f05b → id = "6a3ddbb7ecc5ec5a21d5f05b"
2. Find the movie by its _id in database
   → If not found: return 404 "movie not found"
3. Return the movie object
```

---

### 7c. `controllers/theaterController.js` — Theaters

#### `getTheaters` function
**URL:** GET `/api/theaters`
**Optional query:** `?village=Vijayawada`

```
Same logic as getMovies:
1. If ?village=Vijayawada is in URL:
   → Filter by village name (case-insensitive regex search)
2. Find and return matching theaters
```

**Example:**
```
GET /api/theaters                       → All 12 theaters
GET /api/theaters?village=Vijayawada    → Only 2 Vijayawada theaters
GET /api/theaters?village=gun           → Theaters in Guntur (partial match works!)
```

#### `getTheaterById` function
Same as getMovieById — finds one theater by its `_id`.

---

### 7d. `controllers/showController.js` — Shows

#### `getShows` function
**URL:** GET `/api/shows`
**Optional queries:** `?movieId=`, `?theaterId=`, `?date=`

```
Step by step:
1. Build filter from query parameters:
   - ?movieId=abc    → filter.movie = "abc"
   - ?theaterId=xyz  → filter.theater = "xyz"
   - ?date=2026-06-26 → filter.date = "2026-06-26"
   - You can combine them: ?movieId=abc&date=2026-06-26
2. Find shows matching the filter
3. .populate('movie', 'title posterUrl ...') 
   → Replace the movie ObjectId with actual movie data (title, poster, etc.)
4. .populate('theater', 'name village address')
   → Replace the theater ObjectId with actual theater data
5. Return the shows
```

> [!NOTE]
> **What is `.populate()`?** In the database, a show stores movie as just an ID like `"6a3ddbb7ecc5ec5a21d5f05b"`. That's useless to show to a user. `.populate()` replaces that ID with the actual movie object `{title: "RRR", posterUrl: "..."}`. The second argument `'title posterUrl'` means "only include these fields".

**Example responses:**

Without populate:
```json
{ "movie": "6a3ddbb7ecc5ec5a21d5f05b", "theater": "6a3ddbb7ecc5ec5a21d5f06b" }
```

With populate:
```json
{
  "movie": { "_id": "...", "title": "RRR", "posterUrl": "https://..." },
  "theater": { "_id": "...", "name": "PVR Cinemas Vijayawada", "village": "Vijayawada" }
}
```

---

#### `getShowById` function
**URL:** GET `/api/shows/:id`

Finds one show by id, with movie and theater populated.

---

#### `getShowSeats` function
**URL:** GET `/api/shows/:id/seats`

This is the **seat map** endpoint. Shows which seats are booked and which are free.

```
Step by step:
1. Find the show by id
2. Generate ALL 60 seat names: A1, A2, ... A10, B1, B2, ... F10
   - 6 rows: A, B, C, D, E, F
   - 10 seats per row: 1 to 10
   - Using two nested loops
3. For each seat, check if it's in the bookedSeats array
4. Build a seat map like:
   [
     { seat: "A1", isBooked: true },
     { seat: "A2", isBooked: true },
     { seat: "A3", isBooked: false },
     ...
   ]
5. Return seat map + counts (total, booked, available)
```

**Example response:**
```json
{
  "showId": "...",
  "totalSeats": 60,
  "bookedCount": 3,
  "availableCount": 57,
  "seats": [
    { "seat": "A1", "isBooked": true },
    { "seat": "A2", "isBooked": true },
    { "seat": "A3", "isBooked": true },
    { "seat": "A4", "isBooked": false },
    ...
  ]
}
```

---

### 7e. `controllers/bookingController.js` — Bookings

This is the **most complex controller**. It handles money and seat conflicts.

#### `createBooking` function
**URL:** POST `/api/bookings` (protected)
**Body needed:** `{ showId, seats: ["A1", "A2", "A3"] }`

```
Step by step:
1. Get showId and seats array from request body
   → If missing: return 400 "showId and seats are required"

2. Find the show in database
   → If not found: return 404

3. CONFLICT CHECK: Loop through requested seats
   → For each seat, check if it's already in show.bookedSeats
   → If any are already booked, collect them in "alreadyBooked" array
   → If conflicts found: return 400 with list of conflicting seats
   
   Example: You want ["A1", "B1"]. A1 is already booked.
   Response: { message: "some seats are already booked", conflictSeats: ["A1"] }

4. ATOMIC UPDATE: Use findOneAndUpdate with special conditions
   → $nin: seats  means "only update if NONE of these seats are in bookedSeats"
   → $push: {$each: seats}  means "add all these seats to bookedSeats array"
   → This is ATOMIC — means if two people try to book A1 at the exact same 
     millisecond, only one will succeed. The database handles the race condition.
   
   → If update returns null: return 400 "seats booking conflict"

5. Calculate total: number of seats × price per seat
   Example: 3 seats × ₹120 = ₹360

6. Create a Booking document with user id, show id, seats, amount, status "confirmed"

7. Return the booking
```

> [!WARNING]
> **Why two checks (step 3 AND step 4)?** Step 3 is a "quick check" to give a nice error message. But between step 3 and step 4, another user might book the same seat (race condition). Step 4's `$nin` check happens directly in MongoDB, which is **atomic** — impossible for two updates to happen at the same time on the same document. This is the real protection.

---

#### `getMyBookings` function
**URL:** GET `/api/bookings/my` (protected)

```
Step by step:
1. Find all bookings where user equals req.user._id (logged-in user)
2. Populate the show field, and inside show, populate movie and theater
   → This gives us: booking → show → movie title, poster + theater name, village
3. Sort by createdAt descending (newest bookings first)
4. Return bookings array
```

**Example response:**
```json
[
  {
    "seats": ["A1", "A2", "A3"],
    "totalAmount": 360,
    "status": "confirmed",
    "show": {
      "date": "2026-06-26",
      "time": "10:00 AM",
      "movie": { "title": "RRR", "posterUrl": "..." },
      "theater": { "name": "PVR Cinemas Vijayawada", "village": "Vijayawada" }
    }
  }
]
```

---

#### `getBookingById` function
**URL:** GET `/api/bookings/:id` (protected)

```
Step by step:
1. Find booking by id, populate show → movie + theater
2. If not found: return 404
3. OWNERSHIP CHECK: Compare booking.user with req.user._id
   → If they don't match: return 403 "not authorized"
   → This prevents User A from seeing User B's booking
4. Return the booking
```

---

#### `cancelBooking` function
**URL:** DELETE `/api/bookings/:id` (protected)

```
Step by step:
1. Find booking by id
   → If not found: return 404
2. Ownership check (same as above)
3. If already cancelled: return 400 "booking already cancelled"
4. RELEASE SEATS: Update the show's bookedSeats array
   → $pull: {$in: booking.seats} means "remove these seats from bookedSeats"
   → Now those seats are available for others again!
5. Change booking status to "cancelled"
6. Save the booking
7. Return success message + updated booking
```

> [!TIP]
> **$pull vs $push:** `$push` adds items to an array. `$pull` removes items from an array. When you cancel, we `$pull` your seats out of `bookedSeats`, making them available again.

---

## 8. Routes — URL Mapping

Routes are simple — they just connect URLs to controller functions.

### 8a. Auth Routes (`/api/auth/...`)

| Method | URL | Controller | Protected? | What it does |
|--------|-----|-----------|------------|-------------|
| POST | `/api/auth/register` | `signUp` | No | Create new account |
| POST | `/api/auth/login` | `login` | No | Login and get token |
| GET | `/api/auth/me` | `getMe` | Yes | Get your profile |

### 8b. Movie Routes (`/api/movies/...`)

| Method | URL | Controller | What it does |
|--------|-----|-----------|-------------|
| GET | `/api/movies` | `getMovies` | Get all movies (with optional filters) |
| GET | `/api/movies/:id` | `getMovieById` | Get one movie by id |

### 8c. Theater Routes (`/api/theaters/...`)

| Method | URL | Controller | What it does |
|--------|-----|-----------|-------------|
| GET | `/api/theaters` | `getTheaters` | Get all theaters (with optional village filter) |
| GET | `/api/theaters/:id` | `getTheaterById` | Get one theater by id |

### 8d. Show Routes (`/api/shows/...`)

| Method | URL | Controller | What it does |
|--------|-----|-----------|-------------|
| GET | `/api/shows` | `getShows` | Get shows (filter by movieId, theaterId, date) |
| GET | `/api/shows/:id` | `getShowById` | Get one show details |
| GET | `/api/shows/:id/seats` | `getShowSeats` | Get seat availability map |

### 8e. Booking Routes (`/api/bookings/...`)

| Method | URL | Controller | Protected? | What it does |
|--------|-----|-----------|------------|-------------|
| POST | `/api/bookings` | `createBooking` | Yes | Book tickets |
| GET | `/api/bookings/my` | `getMyBookings` | Yes | See your bookings |
| GET | `/api/bookings/:id` | `getBookingById` | Yes | See one booking |
| DELETE | `/api/bookings/:id` | `cancelBooking` | Yes | Cancel a booking |

---

## 9. Seed Files — Database Fillers

These files run **only once** to fill your database with initial data. They do NOT run when the server starts.

### 9a. `seed/theaters.js`

Just a plain array of 12 theater objects:

| Town | Theater 1 | Theater 2 |
|------|-----------|-----------|
| Vijayawada | PVR Cinemas (Action, Drama) | Sree Ramulu (Comedy, Romance) |
| Guntur | Sandhya 70MM (Action, Thriller) | Dasari Theater (Drama, Family) |
| Eluru | Sri Venkateswara (Action, SciFi) | Lakshmi Theater (Comedy, Horror) |
| Bhimavaram | Siri Cinemas (Drama, Romance) | Saptagiri (Action, Comedy) |
| Rajahmundry | Priya Theater (Thriller, Horror) | Kameswari (Family, SciFi) |
| Narsapur | Sri Balaji (Action, Drama) | Alankar Theater (Comedy, Romance) |

### 9b. `seed/generateShows.js`

```
generateShows function:

For EACH theater (12 theaters):
  1. Find movies that match this theater's genres
     Example: PVR Vijayawada has genres [28, 18] (Action, Drama)
     → Find movies that have 28 OR 18 in their genre_ids
     → RRR has [28, 36, 18] → MATCH (has 28 and 18)
  
  2. Pick first 2 matching movies

  3. For EACH day (3 days from today):
     For EACH time slot (3 slots):
       → Create a show with:
         - movie: alternating between the 2 picked movies
         - theater: current theater
         - date: "2026-06-26" format
         - time: one of "10:00 AM", "1:00 PM", "4:00 PM"
         - price: based on time slot
         - bookedSeats: empty []

Total shows: 12 theaters × 3 days × 3 slots = 108 shows
```

**Pricing:**
| Time Slot | Price | Label |
|-----------|-------|-------|
| 10:00 AM | ₹120 | Morning |
| 1:00 PM | ₹150 | Matinee |
| 4:00 PM | ₹180 | Evening |

### 9c. `seed/seedData.js` — Master Script

```
seedDatabase function:
1. Connect to MongoDB
2. Delete ALL old movies, theaters, and shows (clean slate)
3. Fetch 50 Telugu movies from TMDB API
4. Save movies to database
5. Save 12 theaters to database
6. Generate 108 shows
7. Print summary and exit
```

**Run with:** `npm run seed`

---

## 10. Key Concepts Explained

### What is `req` and `res`?

Every controller function gets two objects:
- **`req` (request)** — Everything the user sent to us
  - `req.body` — JSON data sent in POST requests
  - `req.params` — URL parameters (like `:id` in `/movies/:id`)
  - `req.query` — Query string (like `?genre=28`)
  - `req.user` — The logged-in user (set by authMiddleware)
  - `req.headers` — Headers (where the JWT token lives)

- **`res` (response)** — How we send data back
  - `res.json(data)` — Send JSON response with status 200
  - `res.status(400).send('error')` — Send error text with status 400
  - `res.status(201).json(data)` — Send JSON with status 201 (created)

### HTTP Status Codes Used

| Code | Meaning | When we use it |
|------|---------|---------------|
| 200 | OK | Successful GET, successful login |
| 201 | Created | New user registered, new booking created |
| 400 | Bad Request | Duplicate email, seat conflict, missing data |
| 401 | Unauthorized | No token, invalid token, expired token |
| 403 | Forbidden | Trying to view someone else's booking |
| 404 | Not Found | Movie/theater/show/booking doesn't exist |
| 500 | Server Error | Something unexpected broke |

### MongoDB Operators Used

| Operator | Meaning | Example |
|----------|---------|---------|
| `$regex` | Pattern matching | `{title: {$regex: "rrr", $options: "i"}}` → find titles containing "rrr" |
| `$nin` | Not in array | `{bookedSeats: {$nin: ["A1"]}}` → only match if A1 is NOT in bookedSeats |
| `$push` | Add to array | `{$push: {bookedSeats: {$each: ["A1","A2"]}}}` → add A1, A2 to array |
| `$pull` | Remove from array | `{$pull: {bookedSeats: {$in: ["A1","A2"]}}}` → remove A1, A2 from array |
| `$each` | Used with $push | Push multiple items at once instead of one by one |
| `$in` | In array | Used with $pull to remove multiple items |

---

## 11. Complete API Testing Guide

### Step 1: Register
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Bala", "email": "bala@test.com", "password": "test123" }
Response: { newUser: {...}, token: "eyJ..." }
→ SAVE THE TOKEN!
```

### Step 2: Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "bala@test.com", "password": "test123" }
Response: { user: {...}, token: "eyJ..." }
```

### Step 3: Browse Movies
```
GET http://localhost:5000/api/movies
GET http://localhost:5000/api/movies?search=rrr
GET http://localhost:5000/api/movies?genre=28
```

### Step 4: Find Theaters
```
GET http://localhost:5000/api/theaters
GET http://localhost:5000/api/theaters?village=Vijayawada
```

### Step 5: Find Shows
```
GET http://localhost:5000/api/shows?movieId=MOVIE_ID_HERE
GET http://localhost:5000/api/shows?theaterId=THEATER_ID_HERE&date=2026-06-26
```

### Step 6: Check Seats
```
GET http://localhost:5000/api/shows/SHOW_ID_HERE/seats
```

### Step 7: Book Tickets (need token!)
```
POST http://localhost:5000/api/bookings
Headers: { Authorization: "Bearer YOUR_TOKEN_HERE" }
Body: { "showId": "SHOW_ID", "seats": ["A1", "A2"] }
```

### Step 8: View My Bookings
```
GET http://localhost:5000/api/bookings/my
Headers: { Authorization: "Bearer YOUR_TOKEN_HERE" }
```

### Step 9: Cancel Booking
```
DELETE http://localhost:5000/api/bookings/BOOKING_ID_HERE
Headers: { Authorization: "Bearer YOUR_TOKEN_HERE" }
```

---

## 12. Packages Used

| Package | What it does | Where it's used |
|---------|-------------|----------------|
| `express` | Web framework — handles HTTP requests/routes | server.js, routes |
| `mongoose` | MongoDB helper — makes database queries easy | models, controllers |
| `dotenv` | Loads .env file variables | server.js, db.js |
| `bcryptjs` | Hashes passwords | authController.js |
| `jsonwebtoken` | Creates/verifies JWT tokens | tokenGenerator.js, authMiddleware.js |
| `cors` | Allows frontend to call this backend | server.js |
| `axios` | Makes HTTP requests (to TMDB API) | tmdb.js |

---

> [!TIP]
> **Best way to test:** Use **Postman** or **Thunder Client** (VS Code extension). They let you easily send GET, POST, DELETE requests with headers and body.
