//Imports
const ingredients = require("../services/ingredients")


const getCommonIngredients = async (req, res) => {
    
    try {
        let jsonPayload = ingredients.getCommon() || [] 
        res.json(jsonPayload)
    }

    catch (err) {
        console.error(err)
        // Respond to the client with an error message
        return res.status(500).json({error: "Internal Server Error"})

    }
}



const getAllIngredients = async (req, res) => {
    
    try {
        let jsonPayload = ingredients.getAll() || [] 
        res.json(jsonPayload)
    }

    catch (err) {
        console.error(err)
        // Respond to the client with an error message
        return res.status(500).json({error: "Internal Server Error"})

    }

}

module.exports = { getCommonIngredients, getAllIngredients }
