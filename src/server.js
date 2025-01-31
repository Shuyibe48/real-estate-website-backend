// import mongoose from "mongoose";
// import app from "./app.js";
// import seedSuperAdmin from "./app/DB/index.js";
// import seedPlatform from "./app/DB/platform.js";

// const PORT = 5000;

// let server;

// async function bootstrap() {
//   try {
//     // MongoDB কানেকশন চেষ্টা করা হচ্ছে
//     await mongoose.connect(
//       "mongodb+srv://test-database:admin123@atlascluster.gc9l4fl.mongodb.net/test-project?retryWrites=true&w=majority&appName=AtlasCluster",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log("Database connected successfully");

//     // সিডিং অপারেশন
//     await seedSuperAdmin();
//     await seedPlatform();

//     // সার্ভার শুরু করা হচ্ছে
//     server = app.listen(PORT, () => {
//       console.log(`Example app listening on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error during bootstrap process:", error);

//     // ত্রুটি ঘটলে সার্ভার বন্ধ করা হচ্ছে
//     if (server) {
//       server.close(() => {
//         console.log("Server closed due to bootstrap failure");
//       });
//     }

//     process.exit(1); // প্রক্রিয়া বন্ধ করা হচ্ছে ত্রুটির কারণে
//   }
// }

// bootstrap();

// import mongoose from "mongoose";
// import app from "./app.js";
// import seedSuperAdmin from "./app/DB/index.js";
// import seedPlatform from "./app/DB/platform.js";

// const PORT = 5000;

// let server;

// async function bootstrap() {
//   try {
//     // MongoDB কানেকশন চেষ্টা করা হচ্ছে
//     await mongoose.connect(
//       "mongodb+srv://test-database:admin123@atlascluster.gc9l4fl.mongodb.net/test-project?retryWrites=true&w=majority&appName=AtlasCluster"
//     );
//     console.log("Database connected successfully");

//     // সিডিং অপারেশন
//     await seedSuperAdmin();
//     await seedPlatform();

//     // সার্ভার শুরু করা হচ্ছে
//     server = app.listen(PORT, () => {
//       console.log(`Example app listening on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error during bootstrap process:", error);

//     // ত্রুটি ঘটলে সার্ভার বন্ধ করা হচ্ছে
//     if (server) {
//       server.close(() => {
//         console.log("Server closed due to bootstrap failure");
//       });
//     }

//     process.exit(1); // প্রক্রিয়া বন্ধ করা হচ্ছে ত্রুটির কারণে
//   }
// }

// bootstrap();

import mongoose from "mongoose";
import app from "./app.js";
import seedSuperAdmin from "./app/DB/index.js";
import seedPlatform from "./app/DB/platform.js";

const PORT = 5000;

let server;

async function bootstrap() {
  try {
    // MongoDB কানেকশন চেষ্টা করা হচ্ছে
    await mongoose.connect(
      "mongodb+srv://test-database:admin123@atlascluster.gc9l4fl.mongodb.net/test-project?retryWrites=true&w=majority&appName=AtlasCluster"
    );
    console.log("Database connected successfully");

    // সিডিং অপারেশন
    await seedSuperAdmin();
    await seedPlatform();

    // সার্ভার শুরু করা হচ্ছে
    server = app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during bootstrap process:", error);

    // ত্রুটি ঘটলে সার্ভার বন্ধ করা হচ্ছে
    if (server) {
      server.close(() => {
        console.log("Server closed due to bootstrap failure");
      });
    }

    process.exit(1); // প্রক্রিয়া বন্ধ করা হচ্ছে ত্রুটির কারণে
  }
}

// ভার্সেলের জন্য সার্ভার এক্সপোর্ট
export default async (req, res) => {
  await bootstrap();
  app(req, res);
};