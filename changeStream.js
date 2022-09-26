const { MongoClient } = require("mongodb");
require("dotenv").config();
const pipelines = require("./pipelines.js");

async function main() {
  const uri = process.env.MONGOURI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // await monitorListingsUsingEventEmitter(
    //   client,
    //   30000,
    //   pipelines.testPipeline
    // );
    await monitorListingsUsingHasNext(client,30000, pipelines.testPipeline)
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream");
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}

async function monitorListingsUsingEventEmitter(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = client
    .db("sample_airbnb")
    .collection("listingsAndReviews");

  const changeStream = collection.watch(pipeline);

  changeStream.on("change", (next) => {
    console.log(next);
  });
  await closeChangeStream(timeInMs, changeStream);
}

async function monitorListingsUsingHasNext(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = client
    .db("sample_airbnb")
    .collection("listingsAndReviews");
  const changestream = collection.watch(pipeline);
  closeChangeStream(timeInMs, changestream);

  try {
    while (await changestream.hasNext()) {
      console.log(await changestream.next());
    }
  } catch (e) {
    //isClosed is not a function. Should return a boolean. Why does it throw a TypeError?
    if (changestream.isClosed()) {
      console.log(
        "The change stream is closed. Will not wait on any more changes"
      );
    } else {
      throw e;
    }
  }
}

main().catch(console.error);
