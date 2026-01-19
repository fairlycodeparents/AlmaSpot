import { MongoClient } from "mongodb";
import cesenaRooms from "./data/cesena_rooms.json";
import bolognaRooms from "./data/bologna_rooms.json";
import forliRooms from "./data/forli_rooms.json";
import riminiRooms from "./data/rimini_rooms.json";
import ravennaRooms from "./data/ravenna_rooms.json";

const MONGO_URL = "mongodb://localhost:27017";
const MONGO_DB_NAME = process.env["MONGO_DB_NAME"] || "almaspot";

const ROOMS = [
  ...cesenaRooms,
  ...bolognaRooms,
  ...forliRooms,
  ...riminiRooms,
  ...ravennaRooms,
];

async function run() {
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    console.log("Connected to Mongo");

    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection("rooms");

    for (const room of ROOMS) {
      await collection.updateOne(
        { id: room._id },
        { $set: room },
        { upsert: true },
      );
      console.log(`Upserted: ${room._id}`);
    }

    console.log("Seeding completed.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

run();
