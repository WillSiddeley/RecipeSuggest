// Imports
const cors = require("cors");
const express = require("express");
const openai = require("./services/openai");
const edemam = require("./services/edemam");

// Express Settings
const app = express();
const port = 3001;

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const errorNoIngredients = "No ingredients found"
const errorNoRecipes = "No recipes found"

// Functions
const getRecipes = async (req, res) => {

    try {
        // Get list of ingredients from the request body
        let ingredientsList = req.body.ingredientsList || [];

        // Double check submitted ingredients
        console.log(ingredientsList);

        // If there are no ingredients do not query anything
        if (ingredientsList.length === 0) {
            console.log(errorNoIngredients)
            res.status(500).json({ error: errorNoIngredients }); 
            return;
        }

        // Create the prompt for the OpenAI API
        const prompt = `You are a dish suggestion app. Your goal is to suggest three separate dishes that a user can cook based on a list of ingredients that the user has available in their home. If some ingredients are non-sensical, or if you cannot find any dishes, output "No recipes found". Otherwise, it is your goal to output three of the best, most relevant dishes based on the ingredients the user provides. Your output should be formatted as the names of the dishes separated by newlines, with no extra information, instructions or recipes. Only output the names of the dishes separated by newlines. The list of ingredients the user has available are as follows: ${ingredientsList.join(", ")}`

        // Get the list of recipes from the OpenAI API
        const recipeList = openai.parseStringToArray(await openai.queryChatGPT(prompt));

        // Check that the recipes are available
        if (recipeList.join(" ").includes("No recipes found")) {
            console.log(errorNoRecipes)
            res.status(500).json({ error: errorNoRecipes }); 
            return;
        }

        // Double check found recipes
        console.log(`Found recipes: ${recipeList.join(", ")}`);

        // List of Promises for each recipe
        const promiseList = [];

        // Loop over the recipe list, get recipes from the Edemam API
        recipeList.forEach(recipe => { promiseList.push(edemam.queryEdemamRecipe(recipe)) });

        // Return the recipes to the client
        res.json(await Promise.all(promiseList));

    } catch (err) {
        console.error(err);
        // Respond to the client with an error message
        res.status(500).json({ error: "Internal Server Error" });
    }

}

// PUT Methods
app.post('/api/v1/recipes/getRecipes', getRecipes);

// Open Port
app.listen(port, () => console.log("App listening on port", port));