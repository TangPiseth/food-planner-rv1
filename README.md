# EatsBuddy

EatsBuddy is a full-stack meal planning app built with Vue 3, Express, and MongoDB. It brings recipe discovery, weekly meal planning, grocery lists, reviews, and admin moderation into one polished food-planning workspace.

The app combines public recipe data from TheMealDB with locally submitted community recipes, then layers on authenticated planning tools for users and moderation tools for admins.

## What It Does

- Browse and search recipes by name, category, cuisine, and ingredient
- View recipe details with ingredients, instructions, nutrition-style metadata, and PDF export
- Submit community recipes for admin approval
- Save weekly meal plans behind authenticated routes
- Build and manage grocery lists, including bulk item creation and PDF export
- Register, log in, update profile details, and manage authenticated sessions with JWT
- Create, edit, delete, rate, and report recipe reviews
- Moderate users, reviews, reports, recipes, and moderation logs from the admin dashboard
- Use the image scanner page to upload a meal photo and jump into matching recipe searches
- Prepare for Railway hosting with GitHub Actions handling the deployment workflow

## Tech Stack

**Frontend**

- Vue 3 with Vue Router 4
- Bootstrap 5, Font Awesome, AOS, and Swiper
- Axios and Fetch-based service modules
- jsPDF and html2canvas for exports
- Vue CLI build tooling

**Backend**

- Node.js and Express 5
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing
- CORS configuration for local and production environments
- Helmet, rate limiting, and Mongo sanitization dependencies
- Railway-ready server entrypoint through `server/server.js`

## Project Structure

```text
food-planner-rv1/
|-- public/
|   `-- index.html            # Vue HTML shell
|-- server/
|   |-- app.js                # Express app configuration
|   |-- server.js             # API server entrypoint
|   |-- db.js                 # MongoDB connection
|   |-- *Routes.js            # Auth, recipes, reviews, admin, plans, groceries
|   |-- middleware/
|   |   `-- auth.js           # JWT auth middleware
|   `-- models/               # User, Recipe, Review, Report, MealPlan, GroceryList
|-- src/
|   |-- assets/               # CSS, logo, and image assets
|   |-- components/           # Shared and feature components
|   |-- router/               # Vue Router config and route guards
|   |-- services/             # API clients and app service modules
|   |-- views/                # Pages
|   |-- App.vue
|   `-- main.js
|-- .env.example              # Root environment template
|-- package.json
|-- vue.config.js
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 14 or newer
- npm
- MongoDB locally, or a MongoDB Atlas connection string

### Install

```bash
npm install
```

### Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then update the values for your machine:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/food-planner
JWT_SECRET=replace-with-a-strong-random-secret
PORT=3001
CORS_ORIGINS=http://localhost:8080

# Optional. Use /api when frontend and backend share the same host.
VUE_APP_API_BASE_URL=/api
```

Keep `.env` private. It contains database credentials and signing secrets.

## Development

Run the frontend and backend together:

```bash
npm run dev
```

This starts:

- Vue dev server: `http://localhost:8080`
- Express API: `http://localhost:3001`

Local frontend requests use `/api`, and `vue.config.js` proxies them to the backend server.

You can also run each side separately:

```bash
npm run serve
npm run server
```

## Production Build

```bash
npm run build
```

The compiled frontend is written to `dist/`.

## Deployment Direction

The project is moving toward Railway for hosting, with GitHub Actions planned for the build and deployment workflow.

A clean production setup should use:

- Railway for the Node/Express service
- MongoDB Atlas or another managed MongoDB instance
- GitHub Actions for automated checks and deployment steps
- `npm run build` for the Vue production bundle
- `npm run server` as the backend start command

Expected production environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `VUE_APP_API_BASE_URL`
- `PORT` when the platform does not inject one automatically

Set `CORS_ORIGINS` to the final frontend domain once hosting is decided. For local development, `http://localhost:8080` is already supported.

## Main Routes

**Frontend**

- `/home-page` - Home
- `/recipes` - Recipe discovery
- `/recipes/:id` - Recipe detail
- `/image-scanner` - Authenticated image scanner
- `/meal-planner` - Authenticated meal planner
- `/grocery-list` - Authenticated grocery list
- `/profile` - Authenticated user profile
- `/admin` - Admin dashboard
- `/login`, `/register`, `/about`, `/contact`, `/faq`, `/terms`

**API**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/update-username`
- `PUT /api/auth/update-password`
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `GET /api/recipes/mine`
- `POST /api/recipes/submit`
- `GET /api/reviews/recipe/:recipeId`
- `GET /api/reviews/rating/:recipeId`
- `POST /api/reviews/ratings/batch`
- `POST /api/reviews`
- `PUT /api/reviews/:reviewId`
- `DELETE /api/reviews/:reviewId`
- `POST /api/reviews/:reviewId/report`
- `GET /api/meal-plans`
- `POST /api/meal-plans`
- `DELETE /api/meal-plans/:id`
- `GET /api/grocery-lists`
- `POST /api/grocery-lists`
- `PUT /api/grocery-lists/:id`
- `POST /api/grocery-lists/:id/items`
- `POST /api/grocery-lists/:id/items/bulk`
- `DELETE /api/grocery-lists/:id`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/ban`
- `GET /api/admin/recipes`
- `POST /api/admin/recipes`
- `PATCH /api/admin/recipes/:id`
- `DELETE /api/admin/recipes/:id`
- `GET /api/admin/reviews`
- `PUT /api/admin/reviews/:id`
- `DELETE /api/admin/reviews/:id`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id`
- `GET /api/admin/logs`
- `PATCH /api/admin/logs/:id/reason`
- `POST /api/admin/logs/:id/reverse`
- `GET /api/health`

## Admin Setup

The app does not expose a public "create admin" flow. To create the first admin:

1. Register a normal account through the app.
2. Open the `users` collection in MongoDB Atlas or your local database.
3. Update that user document:

```json
{
  "role": "admin",
  "isBanned": false
}
```

4. Save the document, log out, and log back in.

The account can now access `/admin`.

## Useful Commands

```bash
npm run dev      # Frontend and backend together
npm run serve    # Frontend only
npm run server   # Backend only
npm run build    # Production frontend build
```

## Notes

- The recipe browser uses both local MongoDB recipes and TheMealDB.
- Submitted recipes are created as unapproved until an admin approves them.
- Protected pages use the JWT token stored by the frontend.
- The image scanner currently provides an upload, preview, simulated scan result, and recipe-search handoff.
- Deployment is intentionally documented as a Railway and GitHub Actions direction until the final production workflow is added.

## License

Private and proprietary.
