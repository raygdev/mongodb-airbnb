const {MongoClient} = require('mongodb')
require('dotenv').config()
const pipeLines = require('./pipelines.js')



async function main(){

    const uri = process.env.MONGOURI
    const client = new MongoClient(uri)
    try{
        await client.connect()
        await printCheapestSuburbs(client, 'Australia', 'Sydney', 10)
    }
    catch (e) {
        console.error(e)
    }
    finally {
        client.close()
    }
}

async function printCheapestSuburbs(client, country, market, maxNumberToPrint){
    const pipeLine = pipeLines.aggregationPipeline(country,market, maxNumberToPrint)
      const aggCursor = await client.db('sample_airbnb')
                                .collection('listingsAndReviews')
                                .aggregate(pipeLine)
    await aggCursor.forEach(airBnbListing => {
         console.log(`${airBnbListing._id}: $${airBnbListing.averagePrice}`)
      })
}

main().catch(console.error)