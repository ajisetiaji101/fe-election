export default defineEventHandler(async (event) => {

    const runtimeConfig = useRuntimeConfig().public;

    try {
        // Parse form data from the request
        const body = await readMultipartFormData(event);

        console.log("Received form data:", body);

        if (!body || body.length === 0) {
            console.error("No form data provided");
            return {
                status: 400,
                response: {
                    message: "No form data provided.",
                },
            };
        }

        // Convert MultiPartData[] to FormData
        const formData = new FormData();
        body.forEach((part) => {
            if (part.filename) {
                const blob = new Blob([part.data]);
                formData.append(part.name as string, blob, part.filename);
            } else {
                const blob = new Blob([part.data]);
                formData.append(part.name as string, blob);
            }
        });

        // Generate a unique timestamp for idempotency
        const timestamp = Date.now();

        // Define the API endpoint (configurable for different environments)
        const API_URL = process.env.API_URL || `${runtimeConfig.hit_server}/pemilih`;

        // Send POST request to the external API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // Note: 'Content-Type' for multipart form data is typically set automatically by the fetch API.
                'Idempotency-Key': timestamp.toString(),
            },
            body: formData,
        });

        // Log response status for debugging
        console.log(`API response status: ${response.status}`);

        // Check if the response is not successful
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("API error response:", errorMessage);
            return {
                status: response.status,
                response: {
                    message: 'Invalid NIK. Please check your input.',
                },
            };
        }

        // Parse the response data
        const data = await response.json();

        return {
            status: response.status,
            response: data,
        };
    } catch (error) {
        console.error("Error during request handling:", (error as Error).message);

        return {
            status: 500,
            response: {
                message: "Internal server error. Please try again later.",
            },
        };
    }
});