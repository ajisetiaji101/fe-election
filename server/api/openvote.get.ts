export default defineEventHandler(async (event) => {
    //generate timestamp
    const timestamp = new Date().getTime()

    const response = await fetch(`http://localhost:8081/timeopenvote`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': timestamp.toString()
        }
    })

    console.log(response.status)

    if (response.status !== 200) {

        return {
            status: response.status,
            response: {
                message: "Open Result Vote Failed"
            }
        }
    }

    const data = await response.json()

    return {
        status: response.status,
        response: data
    }
})