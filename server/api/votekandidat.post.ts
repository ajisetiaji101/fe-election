export default defineEventHandler(async (event) => {
    const MAX_RETRIES = 3; // Maximum number of retries
    const RETRY_DELAY = 2000; // Delay between retries in milliseconds

    const body = await readBody(event);

    // Generate a unique timestamp for idempotency
    const timestamp = Date.now();

    // Define the API endpoint (configurable for different environments)
    const API_URL = `http://localhost:8081/votes`;

    // Function to send POST request with retries
    const sendPostRequest = async (url, options, retries) => {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(url, options);

                // Log response status for debugging
                console.log(`API response status: ${response.status}`);

                // Check if the response is successful
                if (response.status === 201) {
                    return response; // Return successful response
                } else {
                    const errorMessage = await response.text();
                    console.error("API error response:", errorMessage);
                    throw new Error(errorMessage); // Throw error to trigger retry
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error.message);
                if (attempt < retries - 1) {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                } else {
                    throw error; // Rethrow error if out of retries
                }
            }
        }
    };

    try {
        // Send POST request to the external API with retries
        const response = await sendPostRequest(API_URL, {
            method: 'POST',
            headers: {
                'Idempotency-Key': timestamp.toString(),
                'Content-Type': 'application/json', // Ensure the content type is set
            },
            body: JSON.stringify(body),
        });

        return {
            status: response.status,
            response: {
                message: 'Vote success',
            },
        };
    } catch (error) {
        console.log("masuk sini");

        console.error("An unexpected error occurred:", error);
        return {
            status: 500,
            response: {
                message: "An unexpected error occurred. Please try again later.",
            },
        };
    }
});