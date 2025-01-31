import log from '../middleware/log'

export default defineEventHandler(async (event) => {

    const runtimeConfig = useRuntimeConfig().public;
    const body = await readBody(event)

    //generate timestamp
    const timestamp = new Date().getTime()

    console.log("runtimeConfig.hit_server", runtimeConfig.hit_server);


    const response = await fetch(`${runtimeConfig.hit_server}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': timestamp.toString()
        },
        body: JSON.stringify(body)
    })

    if (response.status !== 200) {

        console.log('Invalid username or password')

        return {
            status: response.status,
            response: {
                message: 'Invalid username or password'
            }
        }
    }

    const data = await response.json()

    return {
        status: response.status,
        response: data
    }
})
