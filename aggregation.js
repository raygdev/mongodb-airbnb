const {MongoClient} = require('mongodb')
require('dotenv').config()



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
    const pipeLine = [
        {
          '$match': {
            'bedrooms': 1, 
            'address.country': country, 
            'address.market': market, 
            'address.suburb': {
              '$exists': 1, 
              '$ne': ''
            }, 
            'room_type': 'Entire home/apt'
          }
        }, {
          '$group': {
            '_id': '$address.suburb', 
            'averagePrice': {
              '$avg': '$price'
            }
          }
        }, {
          '$sort': {
            'averagePrice': 1
          }
        }, {
          '$limit': maxNumberToPrint
        }
      ]
      const aggCursor = await client.db('sample_airbnb')
                                .collection('listingsAndReviews')
                                .aggregate(pipeLine)
    await aggCursor.forEach(airBnbListing => {
         console.log(`${airBnbListing._id}: $${airBnbListing.averagePrice}`)
      })
}

main().catch(console.error)