export default defineEventHandler(async (event) => {
    //generate timestamp
    const timestamp = new Date().getTime()
    const runtimeConfig = useRuntimeConfig().public;

    const response = await fetch(`${runtimeConfig.hit_server}/showresult`, {
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