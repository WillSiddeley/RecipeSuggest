//const fetch = require("node-fetch")
const fs = require("fs")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const recipeScraper = require("recipe-scraper")
const jsonld = require("jsonld")

const regex = /(?:instructions|method|directions|steps)[:\s]*([\s\S]+?)(?:\n\n|\r\n\r\n|$)/i;

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
    await recipeScraper(recipeUrl).then((recipe) => {
        //recipe = JSON.parse(recipe)
        console.log(recipe["instructions"])

    })

}

    //return ["step1", "step2", "step3"]
    //console.log(recipeUrl);

const addDirectionRegex = async(recipeUrl) => {

    return fetch(recipeUrl).then((res) =>{
        return res.text()

    }).then((html) => {

        console.log(html)

    }).catch((error) => {
        console.error(error)
    })

    const match = ("view-source:" + recipeUrl).match(regex)

    if (match){
        const instructions = match[1].trim()
        console.log(instructions)
    }
}

const addDirectionLd = async(recipeUrl) => {

        const expanded = await jsonld.expand(recipeUrl)
        console.log(expanded)

    }

module.exports = { checkLink, addDirections, addDirectionRegex, addDirectionLd }

//checkLink("https://www.seriouseats.com/recipes/2011/10/cook-the-book-carroty-mac-and-cheese.html")

//addDirections("https://www.allrecipes.com/recipe/277953/air-fryer-beyond-meat-brats-onions-and-peppers/")

addDirectionLd("https://www.marthastewart.com/326792/beef-ragu-with-pasta")