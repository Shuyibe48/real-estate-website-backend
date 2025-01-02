import mongoose from "mongoose";
import app from "./app.js";
import seedSuperAdmin from "./app/DB/index.js";

const PORT = 5000;

let server;

async function bootstrap() {
  await mongoose.connect(
    "mongodb+srv://test-database:admin123@atlascluster.gc9l4fl.mongodb.net/test-project?retryWrites=true&w=majority&appName=AtlasCluster"
  );

  seedSuperAdmin()

  server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

bootstrap();
