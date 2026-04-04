import { app, startServer } from "./app.js";

const server = await startServer();

process.on("SIGINT", async () => {
  server.close(() => {
    process.exit(0);
  });
});

export { app };

