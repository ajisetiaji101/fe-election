export default defineEventHandler(async (event) => {
    //generate timestamp
    const timestamp = new Date().getTime()

    const response = await fetch('http://localhost:8081/kandidats', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': timestamp.toString()
        }
    })

    if (response.status !== 200) {

        return {
            status: response.status,
            response: {
                message: 'Invalid NIK'
            }
        }
    }

    const data = await response.json()

    return {
        status: response.status,
        response: data
    }
})