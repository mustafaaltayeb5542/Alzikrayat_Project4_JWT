# Alzikrayat – Project 4 (JWT Authentication)

Advanced Web Technologies – Optional Bonus Project  
Selected Track: **Track A – JWT-Based Authentication**
## Prepared by the student:
 Mustafa Al-Tayeb Al-Haj Dawalbayt
 University ID: 202011236916
## Features
- Register and login with bcrypt password hashing.
- JWT access tokens returned by the API.
- Protected API routes using `Authorization: Bearer <token>`.
- Axios interceptor automatically attaches the token.
- Logout clears the locally stored token.
- Photo upload, gallery, photo details, owner-only delete, and comments.
- MongoDB + Mongoose, Express, React + Vite.

## Requirements
- Node.js 18+ (recommended LTS)
- MongoDB local installation or MongoDB Atlas connection
- npm

## 1. Configure the server
Open a terminal in `server` and run:
```bash
npm install
```
Copy `.env.example` to `.env`, then edit it:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/alzikrayat_project4
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```
Keep `.env` private. Never upload it to GitHub.

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 2. Configure the client
Open another terminal in `client`:
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

## 3. Test the application
1. Register a new user.
2. Log in. The server returns a JWT and the client stores it in localStorage.
3. Upload a photo with a title and description.
4. Open a photo to add a comment.
5. Delete a photo using the account that uploaded it.
6. Log out. The token is removed; protected operations should return 401.

## API overview
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account and return JWT |
| POST | `/api/auth/login` | Public | Verify credentials and return JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/photos` | Public | List photos |
| GET | `/api/photos/:id` | Public | Photo details and comments |
| POST | `/api/photos` | JWT | Upload a photo |
| DELETE | `/api/photos/:id` | JWT + owner | Delete own photo |
| POST | `/api/photos/:id/comments` | JWT | Add a comment |

## JWT implementation
- `server/middleware/authMiddleware.js` reads the Bearer token and verifies its signature.
- `server/controllers/authController.js` hashes passwords with bcrypt and signs JWTs.
- `client/src/api.js` adds the token to requests through an Axios request interceptor.
- `client/src/context/AuthContext.jsx` stores the token and handles login/logout.
- All write operations are protected on the server, and photo deletion checks ownership.

## Notes
- Uploaded files are stored in `server/uploads`.
- This project uses a hand-written Express API and React/Vite client; it does not use Next.js, NestJS, or another meta-framework.
- This is a runnable Project 4 implementation. If your instructor requires the exact Project 3 repository history, copy/integrate these JWT files into that repository rather than submitting a separate unrelated repository.
