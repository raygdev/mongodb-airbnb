const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  const uri = process.env.MONGOURI;

  const client = new MongoClient(uri);

  try {
    await client.connect();

    // await listDatabases(client);

    // await createListing(client, newListing)

    // await createMulitpleListings(client, multipleListings)

    // await findOneListingByName(client, 'Infinite Views')

    // await findMinBedAndBath(client,4,2)

    // await updateListingByName(client, 'Infinite Views', listingFilter)

    // await upsertListingByName(client, 'Brick Mansion', mansion)

    // await updateAllListingsToHavePropertyType(client)

    // await deleteAListingByName(client, cozy.name)

    await printCheapestSuburbs(client, 'Australia', 'Sydney', 10)
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");

  databasesList.databases.forEach((db) => {
    console.log(` - ${db.name}`);
  });
}

async function createMulitpleListings(client, newListings) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertMany(newListings);
  console.log(
    `${result.insertedCount} new listing(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}

async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .findOne({ name: nameOfListing });

  if (result) {
    console.log(
      `Found a listing in the collection with the name ${nameOfListing}:`
    );
    console.log(result);
  } else {
    console.log(`No listing found with the name ${nameOfListing}`);
  }
}

async function findMinBedAndBath(client, minBed, minBath) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .find({
      bedrooms: { $gte: minBed },
      bathrooms: { $gte: minBath },
    })
    .sort({ last_review: -1 })
    .limit(3)
    .toArray();

  console.log("Found these listings:");
  console.log(result);
}

async function updateListingByName(client, listingName, updatedListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ name: listingName }, { $set: updatedListing });
  console.log(`${result.matchedCount} document(s) mathched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function upsertListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne(
      {
        name: nameOfListing,
      },
      {
        $set: updatedListing,
      },
      {
        upsert: true,
      }
    );
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  if (result.upsertedCount > 0) {
    console.log(`One document was inserted with id ${result.upsertedId}`);
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated`);
  }
}

async function updateAllListingsToHavePropertyType(client) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateMany(
      {
        property_type: { $exists: false },
      },
      {
        $set: { property_type: "Unknown" },
      }
    );
  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} was/were updated.`);
}

async function deleteAListingByName(client, nameOfListing){
    const result = await client.db('sample_airbnb')
     .collection('listingsAndReviews')
     .deleteOne({name: nameOfListing})
     console.log(`${result.deletedCount} document(s) was/were deleted`)
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

main().catch(console.error);
