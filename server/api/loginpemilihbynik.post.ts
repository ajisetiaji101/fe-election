export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    //generate timestamp
    const timestamp = new Date().getTime()

    const response = await fetch(`http://localhost:8081/pemilihByNik`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': timestamp.toString()
        },
        body: JSON.stringify(body)
    })

    if (response.status !== 200) {

        console.log('Invalid NIK')

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