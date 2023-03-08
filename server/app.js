// Imports
const cors = require("cors");
const express = require("express");

// Express Settings
const app = express();
const port = 3001;

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Imports
const recipes = require("./routers/recipes");
const ingredients = require("./routers/getIngredients")

// GET Methods
app.get('/api/v1/ingredients/commonIngredients', ingredients.getCommonIngredients)
app.get('/api/v1/ingredients/allIngredients', ingredients.getAllIngredients)

// PUT Methods
app.post('/api/v1/recipes/getRecipes', recipes.getRecipes);
app.post('/api/v1/recipes/getTestRecipes', recipes.getTestRecipes);

// Open Port
app.listen(port, () => console.log("App listening on port", port));