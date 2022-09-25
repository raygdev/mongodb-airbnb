const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
    const uri = process.env.MONGOURI
    const client = new MongoClient(uri)

    try {
        await client.connect()
    }
    catch (e) {
        console.error(e)
    }
    finally {
        client.close
    }
}

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Closing the change stream')
            changeStream.close()
        }, timeInMs)
    })
}

main().catch(console.error)