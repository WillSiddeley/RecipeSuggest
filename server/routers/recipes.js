// Imports
const fs = require("fs");
const openai = require("../services/openai");
const edemam = require("../services/edemam");
const webscraper = require("../services/webscraper");

// Constants
const errorNoIngredients = "No ingredients found";
const errorNoRecipes = "No recipes found";
const writeResToFile = false;

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
        const prompt = ingredientsList.join(", ");

        // Get the list of recipes from the OpenAI API
        const recipeList = openai.parseStringToArray(await openai.queryChatGPT(prompt));

        // Check that the recipes are available
        if (recipeList.join(" ").includes(errorNoRecipes)) {

            return res.status(500).json({ error: errorNoRecipes });

        }

        console.log(`Found recipes: ${recipeList.join(", ")}`);

        // List of promises from the Edemam API
        const promiseList = [];

        // Loop over the promise list, append the promise for the GET request to the Edemam API
        recipeList.forEach(recipe => { promiseList.push(edemam.queryEdemamRecipe(recipe)) });

        // Wait for the promises to resolve
        let recipesList = await Promise.all(promiseList);

        // Each result has a number of recipes
        // Need to check which ones have pages that are available
        // Also need to scrape the directions from each alive page
        for (let i = 0; i < recipesList.length; i++) {

            let result = recipesList[i];

            // List of booleans, indexes corresponding to Edemam API results with dead links filtered out
            const nonDeadPromiseList = [];

            // checkIsDead is async function, so append promises to the list
            result.forEach(obj => { nonDeadPromiseList.push(webscraper.checkLink(obj.recipe.url, 4000)); });

            // Boolean array with indexes corresponding to alive / dead recipes
            let nonDeadList = await Promise.all(nonDeadPromiseList); 

            console.log(nonDeadList)

            let resultNonDead = [];

            // Filter out the recipes that have dead links
            result.forEach((recipe, index) => {
                if (nonDeadList[index]) {
                    resultNonDead.push(recipe);
                }
            });

            recipesList[i] = resultNonDead;
            
            // List of strings, index corrending to Edemam API results with the directions to the recipe
            //const directionsPromiseList = [];

            // Add the directions to the recipe result object
            //result.forEach(obj => { directionsPromiseList.push(webscraper.addDirections(obj.recipe.url)); });

            //let directionsList = await Promise.all(directionsPromiseList);

            // Add the directions to the recipe result object
            //result.forEach((obj, index) => { obj.directions = directionsList[index]; });

        }

        // Write to file if we are debugging
        if (writeResToFile) {

            fs.writeFile('apiOutput.json', JSON.stringify(recipesList), 'utf8', (err) => {
                console.log((err) ? err : "JSON has successfully been written to file")
            });

        }

        // Return the recipes to the client
        res.json(recipesList);

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