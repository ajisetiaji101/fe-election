export default defineEventHandler(async (event) => {
    try {

        const body = await readBody(event);

        // Generate a unique timestamp for idempotency
        const timestamp = Date.now();

        // Define the API endpoint (configurable for different environments)
        const API_URL = `http://localhost:8081/votes`;

        // Send POST request to the external API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // Note: 'Content-Type' for multipart form data is typically set automatically by the fetch API.
                'Idempotency-Key': timestamp.toString(),
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

        console.error("An unexpected error occurred:", error);
        return {
            status: 500,
            response: {
                message: "An unexpected error occurred. Please try again later.",
            },
        };
    }
}
);