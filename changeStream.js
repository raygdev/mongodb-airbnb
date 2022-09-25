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


main().catch(console.error)