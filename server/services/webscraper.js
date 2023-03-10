const fetch = require("node-fetch")

const checkIsDead = async (recipeUrl) => {

    // Function to check if the HTML of the page is retrievable
    // returns true if link is alive, false if dead
    try{
        fetch(recipeUrl)
        .then((rep) => {
            if (rep.status === 404){
                console.log("false")
                return false
            }
            else{
                console.log("true")
                return true
            }
            //console.log(rep)
        }

        )
    }
    catch(err){
        console.error(err)
    }
    




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

checkIsDead("https://www.seriouseats.com/recipes/2011/10/cook-the-book-carroty-mac-and-cheese.html")