// Imports
const cors = require("cors");
const express = require("express");

// Express Settings
const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors());

// Functions
const getRecipes = async (req, res) => {

    let ingredientsList = req.body.ingredientsList || [];

    const prompt = `
        Suggest three different recipes that a user can make with the ingredients specified. 
        Only list the names of the recipes, do not provide ingredient lists or instructions on how to make the recipe. 
        Format your response as three lines of text on three separate lines, do not number or format the text in any way. 
        The ingredients available are as follows: ${ingredientsList.join(", ")}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer -",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{
                "role": "user", 
                "content": prompt
            }]
        })
    });

    const data = await response.json();

    let recipes = data.choices[0].message.content;

    let recipesList = recipes.split("\n");

    for (let i = 0; i < recipesList.length; i++) {
        recipesList[i] = recipesList[i].replace(/[0-9]./g, '').trim();
    }

    console.log(recipesList.join("\n"));

    let clientRecipes = [];

    recipesList.forEach(async recipe => {

        const response = await fetch("https://api.edamam.com/api/recipes/v2?" + new URLSearchParams({
            "type": "any",
            "q": recipe,
            "app_id": "-",
            "app_key": "-",
        }));
        
        const data = await response.json();

        console.log(data);

        if (data.hits && data.hits.length > 0) {
            clientRecipes.push(data.hits[0].recipe);
        }
        
    });

    res.json(clientRecipes);

}

// PUT Methods
app.post('/api/v1/recipes/getRecipes', getRecipes);

// Open Port
app.listen(port, () => console.log("App listening on port", port));