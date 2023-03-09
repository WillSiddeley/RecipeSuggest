
const checkIsDead = async (recipeUrl) => {

    // Function to check if the HTML of the page is retrievable
    // returns true if link is alive, false if dead
    console.log(recipeUrl);

    return true;

}

const addDirections = async (recipeUrl) => {

    // Function to scrape the HTML of the page for recipe directions
    // returns string array with directions of the recipe step by step
    console.log(recipeUrl);

    return ["step1", "step2", "step3"]

}

module.exports = { checkIsDead, addDirections }