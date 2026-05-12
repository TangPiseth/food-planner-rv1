<div align="center">

<img src="https://img.shields.io/badge/-EatsBuddy-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xOCAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0yem0tNSAxNEg3di0yaDZ2MnptMy00SDd2LTJoOXYyem0wLTRIN1Y2aDl2MnoiLz48L3N2Zz4=&logoColor=white" alt="EatsBuddy" height="40"/>

# 🍽️ EatsBuddy

**A full-stack meal planning workspace for real food lovers.**

*Recipe discovery · Weekly meal planning · Grocery lists · Community recipes · Admin moderation*

---

[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js_14+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: Private](https://img.shields.io/badge/License-Private-red?style=flat-square)](.)

</div>

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🔍 **Recipe Discovery** | Browse and search by name, category, cuisine, and ingredient |
| 📄 **Recipe Details** | View ingredients, instructions, metadata, and export to PDF |
| 🧑‍🍳 **Community Recipes** | Submit recipes for admin review and approval |
| 📅 **Meal Planning** | Save and manage weekly meal plans (authenticated) |
| 🛒 **Grocery Lists** | Build lists with bulk item creation and PDF export |
| 🔐 **Auth & Profiles** | Register, log in, manage sessions with JWT |
| ⭐ **Reviews** | Create, edit, delete, rate, and report recipe reviews |
| 🛡️ **Admin Dashboard** | Moderate users, reviews, reports, recipes, and logs |
| 📸 **Image Scanner** | Upload a meal photo and jump into matching recipe searches |
| 🚀 **CI/CD Ready** | Railway hosting + GitHub Actions deployment workflow |

---

## 🛠️ Tech Stack

### Frontend

[![Vue.js](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router_4-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-FF0000?style=flat-square&logo=adobeacrobatreader&logoColor=white)](https://github.com/parallax/jsPDF)

- **Vue 3** with Vue Router 4
- **Bootstrap 5**, Font Awesome, AOS, and Swiper for UI
- **Axios** and Fetch-based service modules
- **jsPDF** + html2canvas for PDF exports
- Vue CLI build tooling

### Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=flat-square&logo=letsencrypt&logoColor=white)](https://github.com/kelektiv/node.bcrypt.js)

- **Node.js** and **Express 5**
- **MongoDB** with **Mongoose**
- **JWT** authentication and **bcrypt** password hashing
- CORS configuration for local and production environments
- **Helmet**, rate limiting, and Mongo sanitization
- Railway-ready entrypoint via `server/server.js`

---

## 📁 Project Structure

```text
food-planner-rv1/
├── public/
│   └── index.html              # Vue HTML shell
├── server/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # 🚀 API server entrypoint
│   ├── db.js                   # 🗄️ MongoDB connection
│   ├── *Routes.js              # Auth, recipes, reviews, admin, plans, groceries
│   ├── middleware/
│   │   └── auth.js             # 🔐 JWT auth middleware
│   └── models/                 # User, Recipe, Review, Report, MealPlan, GroceryList
├── src/
│   ├── assets/                 # CSS, logo, and image assets
│   ├── components/             # Shared and feature components
│   ├── router/                 # Vue Router config and route guards
│   ├── services/               # API clients and app service modules
│   ├── views/                  # Pages
│   ├── App.vue
│   └── main.js
├── .env.example                # Root environment template
├── package.json
├── vue.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat-square&logo=node.js&logoColor=white)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-local_or_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)

### Install

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Then update the values for your machine:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/food-planner
JWT_SECRET=replace-with-a-strong-random-secret
PORT=3001
CORS_ORIGINS=http://localhost:8080

# Optional — use /api when frontend and backend share the same host
VUE_APP_API_BASE_URL=/api
```

> ⚠️ **Keep `.env` private.** It contains database credentials and signing secrets.

---

## 💻 Development

Run the frontend and backend together:

```bash
npm run dev
```

This starts:

| Service | URL |
|---|---|
| 🖥️ Vue dev server | `http://localhost:8080` |
| ⚙️ Express API | `http://localhost:3001` |

Local frontend requests use `/api`, and `vue.config.js` proxies them to the backend.

You can also run each side separately:

```bash
npm run serve    # Frontend only
npm run server   # Backend only
```

---

## 📦 Production Build

```bash
npm run build
```

The compiled frontend is written to `dist/`.

---

## ☁️ Deployment

The project is targeting **Railway** for hosting with **GitHub Actions** for CI/CD.

### Recommended Setup

| Layer | Service |
|---|---|
| 🖥️ Backend | [Railway](https://railway.app/) — Node/Express service |
| 🗄️ Database | [MongoDB Atlas](https://www.mongodb.com/atlas) — managed MongoDB |
| 🔄 CI/CD | [GitHub Actions](https://github.com/features/actions) — automated checks & deployment |
| 📦 Frontend Build | `npm run build` — Vue production bundle |
| ▶️ Backend Start | `npm run server` |

### Required Environment Variables

```env
MONGODB_URI          # MongoDB connection string
JWT_SECRET           # Auth token signing secret
CORS_ORIGINS         # Final frontend domain (e.g. https://yourdomain.com)
VUE_APP_API_BASE_URL # /api for same-host setups
PORT                 # Injected by Railway automatically
```

---

## 🗺️ Routes

### Frontend Pages

| Route | Description | Auth Required |
|---|---|---|
| `/home-page` | 🏠 Home | — |
| `/recipes` | 🔍 Recipe discovery | — |
| `/recipes/:id` | 📄 Recipe detail | — |
| `/image-scanner` | 📸 Image scanner | ✅ |
| `/meal-planner` | 📅 Meal planner | ✅ |
| `/grocery-list` | 🛒 Grocery list | ✅ |
| `/profile` | 👤 User profile | ✅ |
| `/admin` | 🛡️ Admin dashboard | ✅ Admin |
| `/login` | 🔑 Login | — |
| `/register` | 📝 Register | — |
| `/about`, `/contact`, `/faq`, `/terms` | ℹ️ Info pages | — |

### API Endpoints

<details>
<summary>🔐 Auth</summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Get current user |
| `PUT` | `/api/auth/update-username` | Update username |
| `PUT` | `/api/auth/update-password` | Update password |

</details>

<details>
<summary>🍽️ Recipes</summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | List all recipes |
| `GET` | `/api/recipes/:id` | Recipe detail |
| `GET` | `/api/recipes/mine` | My submitted recipes |
| `POST` | `/api/recipes/submit` | Submit community recipe |

</details>

<details>
<summary>⭐ Reviews</summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reviews/recipe/:recipeId` | Reviews for a recipe |
| `GET` | `/api/reviews/rating/:recipeId` | Rating for a recipe |
| `POST` | `/api/reviews/ratings/batch` | Batch ratings |
| `POST` | `/api/reviews` | Create review |
| `PUT` | `/api/reviews/:reviewId` | Edit review |
| `DELETE` | `/api/reviews/:reviewId` | Delete review |
| `POST` | `/api/reviews/:reviewId/report` | Report review |

</details>

<details>
<summary>📅 Meal Plans</summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meal-plans` | Get plans |
| `POST` | `/api/meal-plans` | Create plan |
| `DELETE` | `/api/meal-plans/:id` | Delete plan |

</details>

<details>
<summary>🛒 Grocery Lists</summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/grocery-lists` | Get lists |
| `POST` | `/api/grocery-lists` | Create list |
| `PUT` | `/api/grocery-lists/:id` | Update list |
| `POST` | `/api/grocery-lists/:id/items` | Add item |
| `POST` | `/api/grocery-lists/:id/items/bulk` | Bulk add items |
| `DELETE` | `/api/grocery-lists/:id` | Delete list |

</details>

<details>
<summary>🛡️ Admin</summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/admin/users` | List / create users |
| `PATCH/DELETE` | `/api/admin/users/:id` | Edit / delete user |
| `PATCH` | `/api/admin/users/:id/role` | Change role |
| `PATCH` | `/api/admin/users/:id/ban` | Ban / unban user |
| `GET/POST` | `/api/admin/recipes` | List / create recipes |
| `PATCH/DELETE` | `/api/admin/recipes/:id` | Edit / delete recipe |
| `GET` | `/api/admin/reviews` | List all reviews |
| `PUT/DELETE` | `/api/admin/reviews/:id` | Edit / delete review |
| `GET` | `/api/admin/reports` | List reports |
| `PATCH` | `/api/admin/reports/:id` | Update report |
| `GET` | `/api/admin/logs` | Moderation logs |
| `PATCH` | `/api/admin/logs/:id/reason` | Update log reason |
| `POST` | `/api/admin/logs/:id/reverse` | Reverse action |
| `GET` | `/api/health` | Health check |

</details>

---

## 🛡️ Admin Setup

The app does not expose a public "create admin" flow. To create the first admin:

1. **Register** a normal account through the app.
2. **Open** the `users` collection in MongoDB Atlas or your local database.
3. **Update** that user document:

```json
{
  "role": "admin",
  "isBanned": false
}
```

4. **Save**, log out, and log back in — the account can now access `/admin`.

---

## 📋 Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | 🔥 Frontend + backend together |
| `npm run serve` | 🖥️ Frontend only |
| `npm run server` | ⚙️ Backend only |
| `npm run build` | 📦 Production frontend build |

---

## 📝 Notes

- The recipe browser combines local MongoDB recipes with **TheMealDB** public data.
- Community-submitted recipes are **unapproved** until an admin reviews them.
- Protected pages use a **JWT token** stored by the frontend.
- The **image scanner** provides upload, preview, a simulated scan result, and recipe-search handoff.
- Deployment is documented as a Railway + GitHub Actions direction pending the final production workflow.

---

<div align="center">

**EatsBuddy** · Private & Proprietary

*Made with 🍴 and a lot of ☕*

</div>
