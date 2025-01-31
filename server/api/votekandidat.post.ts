export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        // Generate a unique timestamp for idempotency
        const timestamp = Date.now();

        // Define the API endpoint (configurable for different environments)
        const API_URL = `http://localhost:8081/votes`;

        // Function to fetch with timeout
        const fetchWithTimeout = (url, options, timeout = 7200000) => { // 7200000 ms = 2 hours
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), timeout)
                )
            ]);
        };

        // Send POST request to the external API with timeout
        const response = await fetchWithTimeout(API_URL, {
            method: 'POST',
            headers: {
                'Idempotency-Key': timestamp.toString(),
                'Content-Type': 'application/json', // Ensure the content type is set
            },
            body: JSON.stringify(body),
        });

        // Log response status for debugging
        console.log(`API response status: ${response.status}`);

        // Check if the response is not successful
        if (response.status !== 201) {
            console.log("masuk sini");

            const errorMessage = await response.text();
            console.error("API error response:", errorMessage);
            return {
                status: response.status,
                response: {
                    message: errorMessage,
                },
            };
        }

        return {
            status: response.status,
            response: {
                message: 'Vote success',
            },
        };
    } catch (error) {
        console.log("masuk sini");

        // Check if the error is a timeout error
        if (error.message === 'Request timed out') {
            return {
                status: 408, // Request Timeout
                response: {
                    message: "The request timed out. Please try again later.",
                },
            };
        }

        console.error("An unexpected error occurred:", error);
        return {
            status: 500,
            response: {
                message: "An unexpected error occurred. Please try again later.",
            },
        };
    }
});