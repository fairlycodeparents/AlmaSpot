import fs from "fs";
import path from "path";

//uncomment the city you need to process
const TARGET_CITIES = [
  //{ name: 'Cesena',  suffix: 'ce', filename: 'cesena_rooms.json' },
  { name: "Bologna", suffix: "bo", filename: "bologna_rooms.json" },
  //{ name: 'Forli',   suffix: 'fo', filename: 'forli_rooms.json' },
  //{ name: 'Rimini',  suffix: 'rn', filename: 'rimini_rooms.json' },
  //{ name: 'Ravenna',  suffix: 'ra', filename: 'ravenna_rooms.json' }
];

interface UniboEvent {
  room_code: string;
  address: string;
}

interface RoomOutput {
  _id: string;
  name: string;
  campus: string;
  site: {
    campus: string;
    address: string;
  };
  type: "CLASSROOM" | "LABORATORY";
}

const generateSlug = (text: string): string => {
  if (!text) return "unknown";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const run = () => {
  const inputFileName = "result.txt";
  const inputPath = path.resolve(inputFileName);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Non trovo il file ${inputFileName}`);
    return;
  }

  const rawData: UniboEvent[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log(`Input caricato: ${rawData.length} eventi totali.\n`);

  TARGET_CITIES.forEach((cityConfig) => {
    console.log(`Elaborazione ${cityConfig.name}...`);

    const uniqueRooms = new Map<string, RoomOutput>();
    const searchString = cityConfig.name.toLowerCase();

    rawData.forEach((event) => {
      if (!event.address) return;

      const addressLower = event.address.toLowerCase();

      let match = addressLower.includes(searchString);
      if (cityConfig.name === "Forli" && addressLower.includes("forlì"))
        match = true;

      if (!match) return;

      const nameUpper = event.room_code.trim().toUpperCase();
      const roomType = nameUpper.startsWith("LAB") ? "LABORATORY" : "CLASSROOM";

      const addressParts = event.address.split(" - ");
      let streetAddress = event.address;

      if (addressParts.length > 1) {
        addressParts.pop();
        streetAddress = addressParts.join(" - ").trim();
      } else {
        const regexCity = new RegExp(cityConfig.name, "gi");
        const regexCityAccented = new RegExp("Forlì", "gi");

        streetAddress = event.address
          .replace(regexCity, "")
          .replace(regexCityAccented, "")
          .trim()
          .replace(/ -$/, "");
      }

      const roomSlug = generateSlug(event.room_code);
      const uniqueId = `${roomSlug}-${cityConfig.suffix}`;

      if (!uniqueRooms.has(uniqueId)) {
        uniqueRooms.set(uniqueId, {
          _id: uniqueId,
          name: event.room_code,
          campus: cityConfig.name === "Forli" ? "Forlì" : cityConfig.name,
          site: {
            campus: cityConfig.name === "Forli" ? "Forlì" : cityConfig.name,
            address: streetAddress || event.address,
          },
          type: roomType,
        });
      }
    });

    const finalOutput = Array.from(uniqueRooms.values());
    const outputPath = path.resolve(cityConfig.filename);

    fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2));
    console.log(`Generato ${cityConfig.filename} (${finalOutput.length} aule)`);
  });

  console.log(`\nElaborazione completata per tutte le sedi.`);
};

run();
