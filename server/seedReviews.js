const mongoose = require('mongoose');
require('dotenv').config();
const Review = require('./models/Review');
const https = require('https');

// MealDB API base URL
const MEALDB_API = 'https://www.themealdb.com/api/json/v1/1';

// Helper function to make HTTPS requests (for Node.js compatibility)
const fetchJSON = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

// Expanded review comments by rating - more variety for 50 reviews per recipe
const reviewComments = {
  5: [
    "Absolutely delicious! My family loved it. Will definitely make again!",
    "Perfect recipe! The instructions were clear and the result was amazing.",
    "This has become a household favorite. Highly recommend!",
    "Outstanding flavor! Better than restaurant quality.",
    "Made this for a dinner party and everyone asked for the recipe!",
    "Incredible! The taste was spot on and so easy to follow.",
    "Best recipe I've tried in a long time. 10/10 would recommend!",
    "My kids devoured this! Thank you for sharing such a great recipe.",
    "Restaurant quality at home! Can't believe how good this turned out.",
    "This recipe is a keeper! Added it to my favorites immediately.",
    "Wow! Just wow! The flavors are perfectly balanced.",
    "Made this three times already this month. Family can't get enough!",
    "Exceeded all expectations. Will be making this for every gathering.",
    "The best version of this dish I've ever had. Period.",
    "Simple ingredients but incredible results. Love it!",
    "My go-to recipe now. Never fails to impress guests.",
    "Absolutely phenomenal! The aromas while cooking were heavenly.",
    "This brought back memories of my grandmother's cooking. Perfect!",
    "Finally found the perfect recipe! Thank you so much!",
    "Made this for my birthday dinner. Best decision ever!",
    "Everyone at the potluck wanted this recipe. Huge hit!",
    "I'm not usually a good cook but this turned out amazing!",
    "The flavors develop beautifully. Even better the next day!",
    "My picky eater actually asked for seconds. Miracle recipe!",
    "Comfort food at its finest. Pure deliciousness!"
  ],
  4: [
    "Really good recipe! Made a few tweaks but overall excellent.",
    "Great flavors, though I added a bit more seasoning to my taste.",
    "Very tasty! The cooking time was a bit longer for me but still great.",
    "Solid recipe. I'll be making this again with minor adjustments.",
    "Enjoyed this a lot! Just needed a touch more salt for my preference.",
    "Really nice dish. Family approved with some small modifications.",
    "Good recipe! The technique worked well, flavors were on point.",
    "Turned out great! I substituted one ingredient and it still worked.",
    "Very satisfying meal. Would make again with slight changes.",
    "Delicious! Added extra garlic and it was perfect for us.",
    "Great base recipe. Easy to customize to your taste.",
    "Really enjoyed this. The prep was easy and results were tasty.",
    "Good comfort food! Made it my own with a few additions.",
    "Tasty and filling. Perfect for a weeknight dinner.",
    "Nice recipe! Followed it closely and was pleased with results.",
    "Family liked it! Will experiment with spices next time.",
    "Solid 4 stars. Good flavors, just needs a bit more punch.",
    "Made this twice now. Getting better each time I make it.",
    "Enjoyable meal! Instructions were helpful and clear.",
    "Pretty good! Added some herbs and it elevated the dish."
  ],
  3: [
    "Decent recipe. It was okay but nothing special.",
    "It turned out fine. Might try different seasonings next time.",
    "Average dish. The family ate it but wasn't their favorite.",
    "It's alright. Instructions could be clearer in some parts.",
    "Edible but I expected more flavor. Will experiment next time.",
    "Not bad, not great. Middle of the road recipe.",
    "It's okay for a quick meal. Nothing to write home about.",
    "Decent enough. Probably won't make it again though.",
    "Met expectations but didn't exceed them. Just okay.",
    "Average taste. Might work better with modifications.",
    "It filled us up but wasn't memorable. Just adequate.",
    "So-so results. The recipe needs some improvements.",
    "Passable meal. Would need significant changes to make again.",
    "Mediocre outcome. The flavors didn't pop like I hoped.",
    "Fair recipe. Gets the job done but nothing exciting."
  ],
  2: [
    "Not my favorite. The flavors didn't come together well.",
    "Disappointing. Didn't turn out like the picture at all.",
    "Struggled with this one. Maybe I did something wrong.",
    "Underwhelming results. Expected much better.",
    "The texture was off. Not sure what went wrong.",
    "Bland and boring. Needed way more seasoning.",
    "Wouldn't make this again. Too much effort for poor results.",
    "My family wasn't impressed. Back to the drawing board.",
    "Something was missing. Just didn't taste right.",
    "Took too long and results weren't worth it."
  ],
  1: [
    "Unfortunately this didn't work out for me at all.",
    "Not recommended. The recipe needs some serious adjustments.",
    "Complete disaster in my kitchen. Very disappointed.",
    "Waste of ingredients. Do not recommend.",
    "Terrible results. Something is very wrong with this recipe."
  ]
};

// Expanded list of realistic usernames
const usernames = [
  "FoodLover2024", "ChefMike", "HomeCooked", "TastyBites", "KitchenPro",
  "RecipeHunter", "CookingMom", "GourmetDad", "SpiceQueen", "BakingBoss",
  "HealthyEats", "ComfortFood", "QuickMeals", "FamilyChef", "WeekendCook",
  "NutritionNinja", "FlavorFan", "DinnerTime", "MealPrepper", "FoodieLife",
  "HomeCooking101", "ChefAtHome", "TastyTreats", "KitchenWizard", "RecipeTester",
  "FoodExplorer", "CulinaryKing", "DishDiva", "MealMaster", "CookbookLover",
  "GourmetGuru", "FlavorSeeker", "PantryPro", "DinnerDreamer", "RecipeRookie",
  "SeasonedChef", "FreshFlavors", "HomemadeHero", "KitchenKnight", "TasteTester",
  "SavorySoul", "DelishDishes", "YummyMummy", "GrillMaster", "SousChefSam",
  "BitesBlog", "ForkAndKnife", "PlatedPerfect", "SimmerSarah", "RoastRuler",
  "PastaPassion", "SaladStar", "SoupSavant", "BreadBaker", "DessertDiva",
  "VeggieVictor", "MeatMaven", "SeafoodSally", "SpiceSeekerX", "HerbHero",
  "SauceBoss", "MarinadeMax", "GrilledGreats", "OvenOwner", "StovetopStar",
  "InstantPotPro", "SlowCookerSue", "AirFryerAce", "WokWonder", "CastIronChef",
  "FarmToTable", "OrganicOlivia", "LocalFoodie", "SustainableEats", "ZeroWasteChef",
  "BudgetBites", "ThriftyTaste", "CheapEats", "StudentChef", "CollegeCook",
  "BusyBeeFood", "QuickFixMeals", "EasyRecipes", "SimpleSavory", "NoFussFood",
  "GlutenFreeGrace", "DairyFreeDelight", "VeganVibes", "KetoKing", "PaleoParty",
  "LowCarbLucy", "HighProteinPete", "CleanEating", "MacroMaster", "CalorieCounter",
  "FitFoodie", "GymGourmet", "ProteinPacked", "MusclesMeals", "LeanCuisine",
  "SundaySupper", "WeekdayDinner", "MidnightSnacker", "BrunchBuddy", "BreakfastClub",
  "LunchboxLove", "DinnerDate", "PartyPlanner", "HostWithMost", "PotluckPro"
];

// Generate a random date within the last 12 months
const randomDate = () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
  return new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
};

// Generate weighted random rating (realistic distribution: more 4s and 5s)
const randomRating = () => {
  const weights = [2, 3, 12, 33, 50]; // weights for ratings 1-5
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return i + 1;
  }
  return 5;
};

// Fetch all meals from MealDB by searching through all letters
const fetchAllMeals = async () => {
  const allMeals = [];
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  console.log('Fetching all recipes from MealDB API...');
  
  for (const letter of letters) {
    try {
      const data = await fetchJSON(`${MEALDB_API}/search.php?f=${letter}`);
      
      if (data.meals) {
        data.meals.forEach(meal => {
          allMeals.push({
            id: meal.idMeal,
            title: meal.strMeal
          });
        });
        console.log(`  Letter '${letter}': Found ${data.meals.length} recipes`);
      } else {
        console.log(`  Letter '${letter}': No recipes found`);
      }
      
      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`  Error fetching letter '${letter}':`, error.message);
    }
  }
  
  console.log(`\nTotal recipes found: ${allMeals.length}\n`);
  return allMeals;
};

// Generate reviews for a single recipe
const generateReviewsForRecipe = (recipe, numReviews = 50) => {
  const reviews = [];
  const usedUsernames = new Set();
  const usedComments = new Set();
  
  for (let i = 0; i < numReviews; i++) {
    // Get unique username
    let username;
    let attempts = 0;
    do {
      username = usernames[Math.floor(Math.random() * usernames.length)];
      attempts++;
      // If we've used all usernames, add a number suffix
      if (attempts > usernames.length) {
        username = `${usernames[Math.floor(Math.random() * usernames.length)]}${Math.floor(Math.random() * 1000)}`;
        break;
      }
    } while (usedUsernames.has(username));
    usedUsernames.add(username);

    const rating = randomRating();
    const comments = reviewComments[rating];
    
    // Try to get unique comment
    let comment;
    let commentAttempts = 0;
    do {
      comment = comments[Math.floor(Math.random() * comments.length)];
      commentAttempts++;
      if (commentAttempts > comments.length) {
        // Add slight variation to make it unique
        comment = comment + ` [${recipe.title}]`;
        break;
      }
    } while (usedComments.has(comment) && commentAttempts <= comments.length);
    usedComments.add(comment);
    
    const date = randomDate();
    const fakeUserId = new mongoose.Types.ObjectId();

    reviews.push({
      userId: fakeUserId,
      username: username,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      rating: rating,
      comment: comment,
      createdAt: date,
      updatedAt: date
    });
  }
  
  return reviews;
};

const seedReviews = async () => {
  try {
    console.log('='.repeat(60));
    console.log('MealDB Recipe Reviews Seeder');
    console.log('='.repeat(60));
    console.log('');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Fetch all recipes from MealDB
    const allRecipes = await fetchAllMeals();
    
    if (allRecipes.length === 0) {
      console.log('No recipes found from MealDB API. Exiting.');
      process.exit(1);
    }

    // Check for existing reviews and clear them (optional)
    const existingCount = await Review.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing reviews.`);
      console.log('Clearing existing seeded reviews...');
      await Review.deleteMany({ username: { $in: usernames } });
      console.log('✓ Cleared seeded reviews\n');
    }

    let totalCreated = 0;
    const REVIEWS_PER_RECIPE = 50;
    const BATCH_SIZE = 100; // Insert in batches for performance
    
    console.log(`Generating ${REVIEWS_PER_RECIPE} reviews for each of ${allRecipes.length} recipes...`);
    console.log(`Total reviews to create: ${allRecipes.length * REVIEWS_PER_RECIPE}\n`);
    
    let allReviews = [];
    
    for (let i = 0; i < allRecipes.length; i++) {
      const recipe = allRecipes[i];
      const reviews = generateReviewsForRecipe(recipe, REVIEWS_PER_RECIPE);
      allReviews.push(...reviews);
      
      // Progress indicator
      if ((i + 1) % 10 === 0 || i === allRecipes.length - 1) {
        process.stdout.write(`\rProgress: ${i + 1}/${allRecipes.length} recipes processed`);
      }
      
      // Insert in batches to avoid memory issues
      if (allReviews.length >= BATCH_SIZE * REVIEWS_PER_RECIPE) {
        await Review.insertMany(allReviews, { ordered: false });
        totalCreated += allReviews.length;
        allReviews = [];
      }
    }
    
    // Insert remaining reviews
    if (allReviews.length > 0) {
      await Review.insertMany(allReviews, { ordered: false });
      totalCreated += allReviews.length;
    }
    
    console.log('\n');
    console.log('='.repeat(60));
    console.log(`✓ Seeding complete!`);
    console.log(`  Total recipes: ${allRecipes.length}`);
    console.log(`  Reviews per recipe: ${REVIEWS_PER_RECIPE}`);
    console.log(`  Total reviews created: ${totalCreated}`);
    console.log('='.repeat(60));
    
    // Show sample average ratings
    console.log('\nSample average ratings (first 10 recipes):');
    for (let i = 0; i < Math.min(10, allRecipes.length); i++) {
      const recipe = allRecipes[i];
      const result = await Review.aggregate([
        { $match: { recipeId: recipe.id } },
        { $group: { _id: '$recipeId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      if (result.length > 0) {
        console.log(`  ${recipe.title}: ${result[0].avg.toFixed(1)} stars (${result[0].count} reviews)`);
      }
    }

    // Calculate overall stats
    const overallStats = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
    ]);
    
    if (overallStats.length > 0) {
      console.log(`\nOverall Statistics:`);
      console.log(`  Average rating across all recipes: ${overallStats[0].avgRating.toFixed(2)} stars`);
      console.log(`  Total reviews in database: ${overallStats[0].total}`);
    }

    // Estimate storage (optional - some MongoDB versions don't support this)
    try {
      const stats = await mongoose.connection.db.collection('reviews').stats();
      console.log(`\nStorage used: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`Available in 512MB: ${((512 - stats.size / (1024 * 1024))).toFixed(2)} MB remaining`);
    } catch (statsErr) {
      console.log('\n(Storage stats unavailable)');
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nSeeding error:', error);
    process.exit(1);
  }
};

seedReviews();
