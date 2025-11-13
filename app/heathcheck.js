const { log } = require('console')
const http = require('http')

const options = {
    host: 'localhost',
    port: 3000,
    path: '/',
    timeout: 2000
}

const request = http.request(options, (res) => {
    console.log(`Health status: ${res.statusCode}`);

    if(res.statusCode === 200){
        process.exit(0)
    } else{
        process.exit(1)
    }
    
})

request.on('error', (err) => {
    console.error(`Healthcheck error: ${err}`)
    process.exit(1)
})

request.end()