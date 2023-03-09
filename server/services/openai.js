require("dotenv").config();

async function queryChatGPT (prompt) {

    try {
        // Log message to console
        console.log("Querying the OpenAI API...");
        // Query the OpenAI API for ChatGPT
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    { "role": "system", "content": "You are a helpful, pattern-following assistant that offers three suggestions for recipes a user can cook with ingredients a user provides. Your output will be separated by commas. If the user provides non-sensical ingredients, or if there are no dishes to suggest, reply 'No recipes found.' Do not ask follow up questions, only respond three dishes." },
                    { "role": "system", "name": "example_user", "content": "Chicken" },
                    { "role": "system", "name": "example_assistant", "content": "Chicken Alfredo, Lemon Garlic Chicken, Chicken Caesar Salad"},
                    { "role": "system", "name": "example_user", "content": "Rice, Potato, Onion, Beef" },
                    { "role": "system", "name": "example_assistant", "content": "Beef and Potato Curry, Beef and Rice Stuffed Peppers, Onion Fried Rice"},
                    { "role": "system", "name": "example_user", "content": "Noodles, Carrot, Butter, Cheese" },
                    { "role": "system", "name": "example_assistant", "content": "Carrot Mac and Cheese, Buttered Noodles with Carrots and Parmesan, Cheesy Garlic Noodles with Roasted Carrots"},
                    { "role": "system", "name": "example_user", "content": "Garbage, Plastic" },
                    { "role": "system", "name": "example_assistant", "content": "No recipes found."},
                    { "role": "user", "content": prompt }
                ]
            })
        });
        // Check if the response is properly recieved
        if (!response.ok) {
            throw new Error(`HTTP error fetching data from OpenAI API. Status Code: ${response.status}, Prompt: ${prompt}`);
        }
        // Return the response data from the first message
        return (await response.json()).choices[0].message.content;
    } 
    catch (err) {
        console.error(err);
        throw new Error("Error fetching data from the OpenAI API");
    }
}

function parseStringToArray(string) {
    // Split the string by newline
    let stringArr = string.split(", ");
    // Remove non-letter characters
    stringArr = stringArr.map(line => line.replace(/[^a-zA-Z\s]/g, '').trim());
    // Remove any empty strings
    return stringArr.filter(line => line.length > 0);
}

module.exports = { queryChatGPT, parseStringToArray };