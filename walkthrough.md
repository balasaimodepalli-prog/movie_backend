# Movie Ticket Booking Backend — Walkthrough

## What Was Built

Complete REST API backend for Telugu movie ticket booking across 6 AP towns.

## Files Created / Modified

### Models
| File | What it does |
|------|-------------|
| [Movie.js](file:///c:/webpract/mernproject/models/Movie.js) | Movie schema — title, genre_ids, posterUrl, vote_average, tmdbId |
| [Theater.js](file:///c:/webpract/mernproject/models/Theater.js) | Theater schema — name, village, address, screens, genres |
| [Show.js](file:///c:/webpract/mernproject/models/Show.js) | Show schema — movie/theater refs, date, time, price, bookedSeats |
| [Booking.js](file:///c:/webpract/mernproject/models/Booking.js) | Booking schema — user/show refs, seats, totalAmount, status |

### Controllers
| File | What it does |
|------|-------------|
| [authController.js](file:///c:/webpract/mernproject/controllers/authController.js) | Added `getMe` to your existing signUp/login |
| [movieController.js](file:///c:/webpract/mernproject/controllers/movieController.js) | `getMovies` (genre/search filters), `getMovieById` |
| [theaterController.js](file:///c:/webpract/mernproject/controllers/theaterController.js) | `getTheaters` (village filter), `getTheaterById` |
| [showController.js](file:///c:/webpract/mernproject/controllers/showController.js) | `getShows` (movieId/theaterId/date filters), `getShowById`, `getShowSeats` |
| [bookingController.js](file:///c:/webpract/mernproject/controllers/bookingController.js) | `createBooking` (atomic), `getMyBookings`, `getBookingById`, `cancelBooking` |

### Routes
| File | Endpoints |
|------|-----------|
| [authRoutes.js](file:///c:/webpract/mernproject/routes/authRoutes.js) | POST `/register`, POST `/login`, GET `/me` |
| [movieRoutes.js](file:///c:/webpract/mernproject/routes/movieRoutes.js) | GET `/`, GET `/:id` |
| [theaterRoutes.js](file:///c:/webpract/mernproject/routes/theaterRoutes.js) | GET `/`, GET `/:id` |
| [showRoutes.js](file:///c:/webpract/mernproject/routes/showRoutes.js) | GET `/`, GET `/:id`, GET `/:id/seats` |
| [bookingRoutes.js](file:///c:/webpract/mernproject/routes/bookingRoutes.js) | POST `/`, GET `/my`, GET `/:id`, DELETE `/:id` |

### Seed Data
| File | What it does |
|------|-------------|
| [tmdb.js](file:///c:/webpract/mernproject/utils/tmdb.js) | Fetches top 50 Telugu movies from TMDB API |
| [theaters.js](file:///c:/webpract/mernproject/seed/theaters.js) | 12 theaters across 6 AP towns with genre specialties |
| [generateShows.js](file:///c:/webpract/mernproject/seed/generateShows.js) | Generates 3 days × 3 slots × 12 theaters = 108 shows |
| [seedData.js](file:///c:/webpract/mernproject/seed/seedData.js) | Main seed script — orchestrates everything |

### Config
| File | What changed |
|------|-------------|
| [server.js](file:///c:/webpract/mernproject/server.js) | Added CORS, all route imports |
| [.env](file:///c:/webpract/mernproject/.env) | Added PORT and TMDB_API_KEY |
| [package.json](file:///c:/webpract/mernproject/package.json) | Added `seed` script |

## Validation

- ✅ Server starts successfully on port 5000
- ✅ MongoDB connects via Mongoose
- ✅ All routes registered

## Next Steps

> [!IMPORTANT]
> Before running `npm run seed`, replace `your_tmdb_api_key_here` in `.env` with your actual TMDB API key.

```bash
# 1. Add your TMDB key to .env
# 2. Seed the database
npm run seed

# 3. Start the server
npm start
```
