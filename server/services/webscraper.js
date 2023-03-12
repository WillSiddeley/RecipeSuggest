//const fetch = require("node-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const checkLink = async (recipeUrl) => {
    // Function to check if the HTML of the page is retrievable
    // returns true if link is alive, false if dead
    // refactor this code to use .catch after the .then
    
    return fetch(recipeUrl).then((rep) => {
        if (rep.status === 404){
            //link is dead
            console.log("false")
            return false
        }
        else{
            //link is alive
            console.log("true")
            return true
        }

        //console.log(rep)
    }).catch((error) =>{
        console.error(error)
        return false
    })
    
    
}

const addDirections = async (recipeUrl) => {
    // Function to scrape the HTML of the page for recipe directions
    // returns string array with directions of the recipe step by step
    try{
        const response = await fetch(recipeUrl);
        const html = await response.text();
    
        // Parse the HTML using a DOM parser
        const parser = new JSDOM().window;
        const doc = parser.parseFromString(html, 'text/html');
    
        // Find the recipe steps element(s) in the DOM
        const recipeStepsElement = doc.querySelector('.directions ol');
    
        // Extract the individual recipe steps from the recipe steps element
        const recipeSteps = Array.from(recipeStepsElement.children).map((stepElement) => {
            return stepElement.textContent.trim();
        })
        console.log(recipeSteps)
        return recipeSteps
    }
    catch(err){
        console.error(err)
    }

}

    //return ["step1", "step2", "step3"]
    //console.log(recipeUrl);



module.exports = { checkLink, addDirections }

checkLink("https://www.seriouseats.com/recipes/2011/10/cook-the-book-carroty-mac-and-cheese.html")

//addDirections("https://www.realsimple.com/food-recipes/browse-all-recipes/slow-roasted-lemon-and-herb-chicken")