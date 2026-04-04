import { connectDb } from "../config/db.js";
import { seedDatabase } from "./seedRuntime.js";

await connectDb();
await seedDatabase({ force: true });
console.log("BlinkShield database seeded successfully.");
process.exit(0);

