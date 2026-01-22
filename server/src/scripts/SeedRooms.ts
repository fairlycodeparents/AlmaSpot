import { Db } from "mongodb";
import fs from "fs";
import path from "path";

export async function seedRooms(db: Db) {
  const collection = db.collection("rooms");

  const dataDir = path.join(__dirname, "data");
  console.log("Starting room seeding from directory: ", dataDir);

  try {
    if (!fs.existsSync(dataDir)) {
      console.warn("Data folder not found in: ", dataDir);
      return;
    }

    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    if (files.length === 0) {
      console.warn("No JSON rooms data found in: ", dataDir);
      return;
    }

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      try {
        const rooms = JSON.parse(fileContent);

        if (Array.isArray(rooms) && rooms.length > 0) {
          const operations = rooms
            .map((room) => {
              const uniqueId = room.id;
              if (!uniqueId) {
                console.warn(`Skipping room without ID in ${file}:`, room.name);
                return null;
              }
              const { id, ...roomData } = room;

              return {
                updateOne: {
                  filter: { id: uniqueId },
                  update: {
                    $set: {
                      ...roomData,
                      id: uniqueId,
                    },
                  },
                  upsert: true,
                },
              };
            })
            .filter((op) => op !== null);

          if (operations.length > 0) {
            const result = await collection.bulkWrite(operations);
            console.log(
              `Processed ${file}: Matched ${result.matchedCount}, Upserted ${result.upsertedCount}`,
            );
          }
        }
      } catch (parseError) {
        console.error(`Error parsing JSON ${file}:`, parseError);
      }
    }

    console.log("Room seeding completed.");
  } catch (error) {
    console.error("Critical error during seed:", error);
  }
}
