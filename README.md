<div align="center">

# EatsBuddy

**A full-stack meal planning app for recipe discovery, AI meal scanning, weekly planning, grocery lists, community recipes, reviews, and admin moderation.**

Recipe search | Meal plans | Grocery lists | Community submissions | Reviews | AI image scanner | Admin dashboard

[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app/)

</div>

---

## Overview

EatsBuddy is a Vue and Express application that helps users discover recipes, scan meal photos, plan meals, generate grocery lists, submit their own recipes, review recipes, and manage their account. The backend stores users, community recipes, reviews, reports, meal plans, grocery lists, and moderation logs in MongoDB.

The public recipe experience combines external recipe data from TheMealDB with approved local recipes from MongoDB. Signed-in users can save personal planning data and submit community recipes. Admins can approve recipes, manage users, review reports, moderate content, and audit actions through moderation logs.

---

## Features

| Area | What it supports |
|---|---|
| Recipe discovery | Search by name, category, cuisine, or ingredient; sort and paginate results |
| Recipe details | Ingredients, instructions, metadata, related suggestions, reviews, and PDF export |
| AI image scanner | Upload a meal image, detect the dish, and search recipes by detected name or ingredient |
| Meal planner | Save dated meal plan entries per authenticated user |
| Grocery lists | Create lists, add single or bulk items, check items, delete lists, and print/export list content |
| Community recipes | Users submit recipes; admins approve or reject before public discovery |
| Reviews | One review per user per recipe, average ratings, edit/delete own reviews, and report reviews |
| Profile workspace | My reviews, submitted recipe status, recipe submission form, username/password updates, logout |
| Admin dashboard | User CRUD, role changes, bans, recipe CRUD/approval, reports, review moderation, moderation logs |
| Production serving | Express serves the Vue `dist/` build and supports Vue Router refresh fallback |

---

## Tech Stack

### Frontend

- Vue 3 and Vue Router 4
- Vue CLI build tooling
- Bootstrap 5, Font Awesome, AOS, and Swiper
- Axios and Fetch-based service modules
- jsPDF and html2canvas for PDF/export workflows
- Centralized API URL helper in `src/services/apiConfig.js`

### Backend

- Node.js and Express 5
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing
- Role-based admin middleware
- CORS allow-listing for development and configured production origins
- AI image scanning with Groq Vision first, Hugging Face image inference second, and Gemini fallback
- Railway-compatible app entrypoints

---

## Project Structure

```text
food-planner-rv1/
|-- api/
|   `-- index.js                 # Exports the Express app for serverless-style hosting
|-- public/
|   |-- favicon.ico
|   `-- index.html               # Vue HTML shell
|-- server/
|   |-- app.js                   # Express app, CORS, API routes, production static serving
|   |-- server.js                # Node server entrypoint
|   |-- db.js                    # MongoDB connection helper
|   |-- authRoutes.js            # Register, login, profile updates
|   |-- recipeRoutes.js          # Public/community recipe APIs
|   |-- reviewRoutes.js          # Ratings, reviews, reports
|   |-- mealPlanRoutes.js        # User meal plans
|   |-- groceryListRoutes.js     # User grocery lists
|   |-- adminRoutes.js           # Admin dashboard APIs
|   |-- aiRoutes.js              # AI image scanner APIs
|   |-- middleware/
|   |   `-- auth.js              # JWT and role middleware
|   `-- models/                  # Mongoose models
|-- src/
|   |-- assets/                  # Global CSS, logo, food/team images
|   |-- components/              # Navbar, footer, recipe cards, reviews, grocery cards
|   |-- router/
|   |   `-- index.js             # Vue routes and guards
|   |-- services/                # Frontend API service modules
|   |-- views/                   # Page-level Vue components
|   |-- App.vue
|   `-- main.js
|-- .env.example                 # Root environment template
|-- railway.json                 # Railway build/start/health config
|-- vue.config.js                # Vue dev-server /api proxy
|-- package.json
`-- README.md
```

---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB, either local or MongoDB Atlas
- Optional API keys for AI image scanning

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` from the example file:

```bash
cp .env.example .env
```

Minimum local configuration:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/food-planner
JWT_SECRET=replace-with-a-strong-random-secret
PORT=3001
CORS_ORIGINS=http://localhost:8080
```

Optional frontend API override:

```env
VUE_APP_API_BASE_URL=/api
```

Optional AI scanner keys:

```env
GROQ_API_KEY=<your-groq-key>
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct

HF_API_TOKEN=<your-hugging-face-token>
HF_IMAGE_MODEL=nateraw/food101
HF_ENDPOINT_URL=https://api-inference.huggingface.co/models/nateraw/food101

GEMINI_API_KEY=<your-gemini-key>
GEMINI_MODEL=gemini-1.5-flash
GEMINI_FALLBACK_MODELS=gemini-1.5-flash-8b,gemini-2.0-flash
```

The scanner tries providers in this order:

1. Groq Vision, when `GROQ_API_KEY` is configured
2. Hugging Face image inference, when `HF_API_TOKEN` is configured
3. Gemini, when `GEMINI_API_KEY` is configured

Keep `.env` private because it contains database credentials, API keys, and JWT signing secrets.

---

## Development

Run the frontend and backend together:

```bash
npm run dev
```

This starts both services:

| Service | URL |
|---|---|
| Vue dev server | `http://localhost:8080` |
| Express API | `http://localhost:3001` |

During local development, frontend requests use `/api`, and `vue.config.js` proxies them to `http://localhost:3001`.

Run either side separately:

```bash
npm run serve
npm run server
```

---

## Production

Build the Vue app:

```bash
npm run build
```

Start the Express server:

```bash
npm run server
```

When `NODE_ENV=production`, Express serves the built files from `dist/` and falls back to `index.html` for non-API GET routes so Vue Router pages work after refresh.

---

## Deployment

The project includes `railway.json` for Railway.

| Setting | Value |
|---|---|
| Builder | `RAILPACK` |
| Build command | `npm run build` |
| Start command | `npm run server` |
| Health check | `/api/health` |
| Restart policy | `ON_FAILURE` |

Recommended production variables:

```env
NODE_ENV=production
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<strong-secret>
CORS_ORIGINS=<deployed-frontend-origin>
VUE_APP_API_BASE_URL=/api
PORT=<provided-by-host>
```

Add AI provider keys only if the deployed scanner should perform live image analysis.

---

## Frontend Routes

| Route | Page | Access |
|---|---|---|
| `/` | Redirects to `/home-page` | Public |
| `/home-page` | Home | Public |
| `/recipes` | Recipe search and filters | Public |
| `/recipes/:id` | Recipe detail | Public |
| `/image-scanner` | AI image scanner | Signed in |
| `/meal-planner` | Meal planner | Signed in |
| `/grocery-list` | Grocery list manager | Signed in |
| `/profile` | User profile, reviews, submitted recipes, settings | Signed in |
| `/admin` | Admin dashboard | Admin |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/faq` | FAQ | Public |
| `/terms` | Terms | Public |

Protected routes check `authToken` in local storage. Admin routes also require `userRole` to be `admin`.

---

## API Routes

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns API/database readiness |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user and return a JWT |
| `POST` | `/api/auth/login` | Log in and return a JWT |
| `GET` | `/api/auth/me` | Get the current signed-in user |
| `PUT` | `/api/auth/update-username` | Update the current username |
| `PUT` | `/api/auth/update-password` | Change the current password |

### Recipes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | List approved active local recipes; supports `search` |
| `GET` | `/api/recipes/mine` | List recipes submitted by the current user |
| `GET` | `/api/recipes/:id` | Get one approved active local recipe |
| `POST` | `/api/recipes/submit` | Submit a community recipe for admin approval |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reviews/rating/:recipeId` | Get average rating and review count |
| `POST` | `/api/reviews/ratings/batch` | Get ratings for multiple recipe IDs |
| `GET` | `/api/reviews/recipe/:recipeId` | Get approved reviews for a recipe |
| `POST` | `/api/reviews` | Create a review |
| `GET` | `/api/reviews/user` | Get the current user's reviews |
| `GET` | `/api/reviews/check/:recipeId` | Check whether the current user reviewed a recipe |
| `PUT` | `/api/reviews/:reviewId` | Update the current user's review |
| `DELETE` | `/api/reviews/:reviewId` | Delete the current user's review |
| `POST` | `/api/reviews/:reviewId/report` | Report another user's review |

### Meal Plans

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meal-plans` | Get the current user's meal plans |
| `POST` | `/api/meal-plans` | Create a meal-plan entry |
| `DELETE` | `/api/meal-plans/:id` | Delete a meal-plan entry |

### Grocery Lists

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/grocery-lists` | Get the current user's grocery lists |
| `POST` | `/api/grocery-lists` | Create a grocery list |
| `PUT` | `/api/grocery-lists/:id` | Update list name, date, or items |
| `POST` | `/api/grocery-lists/:id/items` | Add one item |
| `POST` | `/api/grocery-lists/:id/items/bulk` | Add multiple items |
| `DELETE` | `/api/grocery-lists/:id` | Delete a grocery list |

### AI Scanner

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/scan-image` | Analyze a base64 food image and return `dishName`, `ingredients`, and `description` |

### Admin

All admin endpoints require a valid JWT for a user with `role: "admin"`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List users |
| `POST` | `/api/admin/users` | Create a user |
| `PATCH` | `/api/admin/users/:id` | Update username, email, or password |
| `DELETE` | `/api/admin/users/:id` | Delete a user |
| `PATCH` | `/api/admin/users/:id/role` | Promote or demote a user |
| `PATCH` | `/api/admin/users/:id/ban` | Ban or unban a user |
| `GET` | `/api/admin/recipes` | List local recipes |
| `POST` | `/api/admin/recipes` | Create an approved local recipe |
| `PATCH` | `/api/admin/recipes/:id` | Edit, approve, reject, activate, or deactivate a recipe |
| `DELETE` | `/api/admin/recipes/:id` | Delete a recipe |
| `GET` | `/api/admin/reviews` | List reviews, optionally filtered by status |
| `PUT` | `/api/admin/reviews/:id` | Edit or moderate a review |
| `DELETE` | `/api/admin/reviews/:id` | Delete a review |
| `GET` | `/api/admin/reports` | List review reports |
| `PATCH` | `/api/admin/reports/:id` | Resolve or dismiss a report |
| `GET` | `/api/admin/logs` | List moderation logs |
| `PATCH` | `/api/admin/logs/:id/reason` | Update a moderation log reason |
| `POST` | `/api/admin/logs/:id/reverse` | Reverse supported user moderation actions |

---

## Data Models

| Model | Purpose |
|---|---|
| `User` | Account identity, hashed password, role, ban status |
| `Recipe` | Local/community recipes with approval and active flags |
| `Review` | Ratings and comments, one per user per recipe |
| `ReviewReport` | User reports against reviews and admin decisions |
| `MealPlan` | Personal dated meal-plan entries |
| `GroceryList` | Personal grocery lists and list items |
| `ModerationLog` | Admin action history and reversal context |

---

## Admin Setup

There is no public create-admin flow. To create the first admin:

1. Register a normal user through the app.
2. Open the `users` collection in MongoDB Atlas or your local MongoDB database.
3. Update that user document:

```json
{
  "role": "admin",
  "isBanned": false
}
```

4. Save the document, log out, and log back in.
5. Visit `/admin`.

Admin safeguards prevent deleting, banning, or demoting the last active admin in normal dashboard flows.

---

## Useful Commands

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Run frontend and backend together |
| `npm run serve` | Run the Vue dev server |
| `npm run server` | Run the Express API server |
| `npm run build` | Build the Vue production bundle into `dist/` |

There is currently no test script configured in `package.json`.

---

## Notes

- Recipe browsing combines approved MongoDB recipes with TheMealDB results in the frontend service layer.
- Community recipes are created with `isApproved: false` and remain hidden until an admin approves them.
- Banned users cannot log in or use protected API routes.
- Review creation currently stores reviews as approved immediately, while admins can later change review status or delete reviews.
- The image scanner compresses uploaded images in the browser before posting them to `/api/ai/scan-image`.
- Moderation actions create log records. Supported user moderation logs can be reversed from the admin dashboard.
- `dist/` is generated by `npm run build`; do not edit build output as source.

---

<div align="center">

**EatsBuddy**

Private project for practical meal planning and recipe management.

</div>
