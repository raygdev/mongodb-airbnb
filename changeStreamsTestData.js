const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main() {
  const uri = process.env.MONGOURI;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const operaHouseViews = await createListing(client, {
      name: "Opera House Views",
      summary:
        "Beautiful apartment with the views of the iconic Sydney Opera House",
      property_type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    const privateRoomInLondon = await createListing(client, {
      name: "Private room in London",
      property_type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
    });

    const beautifulBeachHouse = await createListing(client, {
      name: "Beautiful Beach House",
      summary: "Enjoy relaxed beach living in this house with a private beach",
      bedrooms: 4,
      bathrooms: 2.5,
      beds: 7,
      last_review: new Date(),
    });

    await updateListing(client, operaHouseViews, { beds: 2 });

    await updateListing(client, beautifulBeachHouse, {
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    const italianVilla = await createListing(client, {
      name: "Italian Villa",
      property_type: "Entire home/apt",
      bedrooms: 6,
      bathrooms: 4,
      address: {
        market: "Cinque Terre",
        country: "Italy",
      },
    });

    const sydneyHarbourHome = await createListing(client, {
      name: "Sydney Harbour Home",
      bedrooms: 4,
      bathrooms: 2.5,
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    await deleteListing(client, sydneyHarbourHome);
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

/**
 * Create a new Airbnb listing
 * @param {MongoClient} client a mongo client that is connected to a cluster
 * @param {Object} newListing the new listing to be added
 * @returns {String} the id of the new listing
 */

async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
  return result.insertedId;
}

/**
 * Update an Airbnb lisiting
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 * @param {String} listingId the id of the listing you want to update
 * @param {Object} updatedListing an object containing all the properties to be updated for the given listing
 */

async function updateListing(client, listingId, updatedListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ _id: listingId }, { $set: updatedListing });
  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

/**
 *Delete an Airbnb listing
 * @param {MongoClient} client a MongoClient that is connected to a cluster
 * @param {String} listingId the id of the listing to be deleted
 */
async function deleteListing(client, listingId) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .deleteOne({ _id: listingId });
  console.log(`${results.deletedCount} document(s) was/were deleted`);
}
main().catch(console.error);
