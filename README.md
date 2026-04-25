# 🍽️ Food Planner

A full-stack web application for meal planning, recipe management, and grocery list organization. Built with Vue.js and Node.js/Express.

## ✨ Features

- 📖 **Recipe Management** - Browse, search, and filter recipes
- 📅 **Meal Planning** - Plan your meals for the week
- 🛒 **Grocery Lists** - Auto-generate shopping lists from meal plans
- 📝 **Blog Section** - Read and share food-related articles
- 👤 **User Authentication** - Secure login and registration with JWT
- ⭐ **Recipe Reviews** - Rate and review recipes
- 🚩 **Review Reporting** - Users can report inappropriate reviews
- 🛡️ **Admin Moderation Dashboard** - Manage users, reviews, reports, and moderation logs
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔍 **Advanced Filters** - Filter recipes by category, ingredients, and more

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **Bootstrap 5** - CSS framework for responsive design
- **Font Awesome** - Icon library
- **Swiper** - Modern touch slider
- **AOS** - Animate on scroll library
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TangPiseth/Food-Planner.git
cd Food-Planner
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies for both frontend and backend.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/food-planner
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/food-planner

# Server Configuration
PORT=3001

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your_jwt_secret_key_here
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Database Setup

If using MongoDB locally:
1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. (Optional) Seed the database with sample data:
   ```bash
   # Add your seed script here if available
   npm run seed
   ```

## 🎮 Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Frontend dev server at `http://localhost:8080`
- Backend API server at `http://localhost:3001`

### Run Separately

**Frontend only:**
```bash
npm run serve
```

**Backend only:**
```bash
npm run server
```

## 📦 Build for Production

Build the frontend for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## 📁 Project Structure

```
Food Planner/
├── public/              # Static files
│   └── index.html      # HTML entry point
├── server/             # Backend server
│   ├── models/         # MongoDB models
│   │   ├── User.js
│   │   ├── MealPlan.js
│   │   └── GroceryList.js
│   ├── authRoutes.js   # Authentication routes
│   ├── mealPlanRoutes.js
│   ├── groceryListRoutes.js
│   ├── db.js           # Database connection
│   └── server.js       # Express server setup
├── src/                # Frontend source code
│   ├── assets/         # Static assets (CSS, images)
│   ├── components/     # Vue components
│   │   ├── blogs/      # Blog-related components
│   │   └── recipes/    # Recipe-related components
│   ├── router/         # Vue Router configuration
│   ├── services/       # API service modules
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .env                # Environment variables (create this)
├── babel.config.js     # Babel configuration
├── jsconfig.json       # JavaScript configuration
├── package.json        # Project dependencies
├── vue.config.js       # Vue CLI configuration
└── README.md           # You are here!
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (requires auth)

### Reviews and Reports
- `GET /api/reviews/:recipeId` - Get approved reviews for a recipe
- `POST /api/reviews` - Submit review (auto-approved)
- `POST /api/reviews/:reviewId/report` - Report a review (requires auth)

### Admin Moderation (requires admin)
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users/:id/role` - Promote/demote role
- `PATCH /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/reviews` - List reviews for moderation
- `PUT /api/admin/reviews/:id` - Edit/update review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/reports` - List reported reviews
- `PATCH /api/admin/reports/:id` - Resolve or dismiss report
- `GET /api/admin/logs` - View moderation logs

### Meal Plans
- `GET /api/meal-plans` - Get all meal plans (requires auth)
- `POST /api/meal-plans` - Create meal plan (requires auth)
- `PUT /api/meal-plans/:id` - Update meal plan (requires auth)
- `DELETE /api/meal-plans/:id` - Delete meal plan (requires auth)

### Grocery Lists
- `GET /api/grocery-lists` - Get all grocery lists (requires auth)
- `POST /api/grocery-lists` - Create grocery list (requires auth)
- `PUT /api/grocery-lists/:id` - Update grocery list (requires auth)
- `DELETE /api/grocery-lists/:id` - Delete grocery list (requires auth)

### Health Check
- `GET /api/health` - Server health check

## 🧪 Testing

```bash
# Run tests (if test suite is configured)
npm test
```

## 🔒 Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- CORS is enabled for cross-origin requests
- Always use HTTPS in production
- Keep your `.env` file secure and never commit it

## 👑 Create First Admin in MongoDB Atlas

1. Register a normal account through the app first (recommended).
2. Open MongoDB Atlas -> Database -> Collections -> `users`.
3. Find your user document and edit fields:
   - `role`: `admin`
   - `isBanned`: `false`
4. Save changes and log in again.

The admin account will now be able to access `/admin` and moderate users/reports/reviews.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify network connectivity if using MongoDB Atlas

### Port Already in Use
If port 8080 or 3001 is already in use:
```bash
# Change the port in .env for backend
PORT=3002

# For frontend, add this to vue.config.js:
devServer: {
  port: 8081
}
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

Windows (PowerShell) alternative:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

Developed with ❤️ for better meal planning

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Happy Cooking! 🍳**
