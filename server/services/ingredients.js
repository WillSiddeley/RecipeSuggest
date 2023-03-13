const fs = require("fs")

const capitalize = (str) => {
    // Capitalizes the first character in a string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const titleize = (str) => {
    // Capitalize each word in a string
    let words = str.split(" ");
    let capitalWords = [];
    words.forEach(word => {
        capitalWords.push(capitalize(word));
    })
    return capitalWords.join(" ");
}

const getCommon = () => {

    return fs.readFileSync("./assets/commonIngredients.txt").toString().split("\n");

}

const getAll = () => {
    // Need response data in certain format for the dropdown menu
    let responseData = []
    // Get ingredients from file
    let ingredientArr = fs.readFileSync("./assets/allIngredients.txt").toString().split("\n");
    // Format ingredients into objects
    ingredientArr.forEach((ingredient, idx) => { responseData.push({ id: idx, title: titleize(ingredient) }) });
    return responseData;
}

module.exports = { getCommon, getAll };

    