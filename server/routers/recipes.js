// Imports
const fs = require("fs");
const openai = require("./services/openai");
const edemam = require("./services/edemam");

// Constants
const errorNoIngredients = "No ingredients found";
const errorNoRecipes = "No recipes found";
const writeResToFile = true;

const getRecipes = async (req, res) => {

    try {
        // Get list of ingredients from the request body
        let ingredientsList = req.body.ingredientsList || [];

        console.log(ingredientsList);

        // If there are no ingredients do not query anything
        if (ingredientsList.length === 0) {

            return res.status(500).json({ error: errorNoIngredients }); 

        }

        // Create the prompt for the OpenAI API
        const prompt = `You are a dish suggestion app. Your goal is to suggest three separate dishes that a user can cook based on a list of ingredients that the user has available in their home. If some ingredients are non-sensical, or if you cannot find any dishes, output "No recipes found". Otherwise, it is your goal to output three of the best, most relevant dishes based on the ingredients the user provides. Your output should be formatted as the names of the dishes separated by newlines, with no extra information, instructions or recipes. Only output the names of the dishes separated by newlines. The list of ingredients the user has available are as follows: ${ingredientsList.join(", ")}`

        // Get the list of recipes from the OpenAI API
        const recipeList = openai.parseStringToArray(await openai.queryChatGPT(prompt));

        // Check that the recipes are available
        if (recipeList.join(" ").includes(errorNoRecipes)) {

            return res.status(500).json({ error: errorNoRecipes });

        }

        console.log(`Found recipes: ${recipeList.join(", ")}`);

        // List of Promises for each recipe
        const promiseList = [];

        // Loop over the recipe list, get recipes from the Edemam API
        recipeList.forEach(recipe => { promiseList.push(edemam.queryEdemamRecipe(recipe)) });

        // Create a json payload from the promise array
        const jsonPayload = await Promise.all(promiseList);

        // Write to file if we are debugging
        if (writeResToFile) {

            fs.writeFile('apiOutput.json', JSON.stringify(jsonPayload), 'utf8', (err) => {
                console.log((err) ? err : "JSON has successfully been written to file")
            });

        }

        // Return the recipes to the client
        res.json(jsonPayload);

    } catch (err) {
        console.error(err);
        // Respond to the client with an error message
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

const getTestRecipes = async (req, res) => {
    
    console.log("Getting test recipes...");

    fs.readFile('apiOutput.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const jsonPayload = JSON.parse(data);
        res.json(jsonPayload);
    });

}

module.exports = { getRecipes, getTestRecipes };