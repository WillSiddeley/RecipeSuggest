require("dotenv").config();

async function queryEdemamRecipe (query) {

    try {
        // Log message to console
        console.log("Querying the Edemam API...");
        // Query the Edemam API for the recipe
        const response = await fetch("https://api.edamam.com/api/recipes/v2?" + new URLSearchParams({
            "q": query,
            "type": "any",
            "app_id": process.env.EDEMAM_APP,
            "app_key": process.env.EDEMAM_KEY,
        }));
        // Check if the response is properly received
        if (!response.ok) {
            throw new Error(`HTTP error fetching data from Edemam API. Status Code: ${response.status}, Query: ${query}`);
        }
        // Return the response data from the first message
        return (await response.json()).hits || null;
    }
    catch (err) {
        console.error(err);
        throw new Error("Error fetching data from the Edemam API");
    }

}

module.exports = { queryEdemamRecipe }