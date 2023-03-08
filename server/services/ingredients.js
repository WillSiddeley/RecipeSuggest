const fs = require("fs")

const getCommon = () => {

    fs.readFile("../assets/commonIngredients.txt", "utf-8", (err, data) => {
        if (err) {
            throw err;
        }
        //convert each line of the .txt to a string and append to array by newline
        let ingredientsArray = data.toString().split("\n")
        return ingredientsArray

        //console.log(ingredientsArray)
    })

}

const getAll = () => {

    fs.readFile("../assets/allIngredients.txt", "utf-8", (err, data) => {
        if (err) {
            throw err;
        }
        //convert each line of the .txt to a string and append to array by newline
        let ingredientsArray = data.toString().split("\n")
        return ingredientsArray

        //console.log(ingredientsArray)
    })
}


module.exports = { getCommon, getAll };

    