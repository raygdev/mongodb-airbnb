const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
    const uri = process.env.MONGOURI
    const client = new MongoClient(uri)

    try {
        await client.connect()
        await monitorListingsUsingEventEmitter(client)
    }
    catch (e) {
        console.error(e)
    }
    finally {
        client.close()
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

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db('sample_airbnb').collection('listingsAndReviews')

    const changeStream = collection.watch(pipeline)

    changeStream.on('change', (next) => {
        console.log(next)
    })
    await closeChangeStream(timeInMs, changeStream)
}

main().catch(console.error)