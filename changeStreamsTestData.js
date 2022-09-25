const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main(){
    const uri = process.env.MONGOURI
    const client = new MongoClient(uri)

    const operaHouse = await createListing(client,{
        name: 'Opera House Views',
        summary: "Beautiful apartment with the views of the iconic Sydney Opera House",
        property_type: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        address:{
            market: 'Sydney',
            country: "Australia"
        }
    })

    const privateRoomInLondon = await createListing(client,{
        name: 'Private room in London',
        property_type: "Apartment",
        bedrooms: 1,
        bathrooms: 1
    })

    const beautifulBeachHouse = await createListing(client, {
        name: "Beautiful Beach House",
        summary: "Enjoy relaxed beach living in this house with a private beach",
        bedrooms: 4,
        bathrooms: 2.5,
        beds: 7,
        last_review: new Date()
    })

    try {
        await client.connect()
    }
    catch (e) {
        console.error(e)
    }
    finally {
        client.close()
    }
}


async function createListing(client, newListing) {
    const result = await client.db('sample_airbnb')
            .collection('listingsAndReviews')
            .insertOne(newListing)
    console.log(`New listing created with the following id: ${result.insertedId}`)
    return result.insertedId
}

main().catch(console.error)