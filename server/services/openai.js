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
                "messages": [{
                    "role": "user", 
                    "content": prompt
                }]
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
    let stringArr = string.split("\n");
    // Remove non-letter characters
    stringArr = stringArr.map(line => line.replace(/[^a-zA-Z\s]/g, '').trim());
    // Remove any empty strings
    return stringArr.filter(line => line.length > 0);
}

module.exports = { queryChatGPT, parseStringToArray };