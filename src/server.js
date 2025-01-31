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

// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, nam?

// import mongoose from "mongoose";
// import app from "./app.js";
// import seedSuperAdmin from "./app/DB/index.js";
// import seedPlatform from "./app/DB/platform.js";

// const PORT = process.env.PORT || 5000; // ভার্সেল এবং লোকাল উভয় ক্ষেত্রে PORT সেট করা

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
//       console.log(`Server is running on port ${PORT}`);
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

// // লোকাল মেশিনে রান করার জন্য
// if (process.env.NODE_ENV !== "production") {
//   bootstrap();
// }

// // ভার্সেলের জন্য এক্সপোর্ট
// let isServerStarted = false; // সার্ভার শুরু হয়েছে কিনা তা ট্র্যাক করার জন্য

// export default async (req, res) => {
//   if (!isServerStarted) {
//     await bootstrap();
//     isServerStarted = true; // সার্ভার শুরু হয়েছে বলে চিহ্নিত করা হচ্ছে
//   }

//   // Express অ্যাপকে রিকুয়েস্ট এবং রেসপন্স হ্যান্ডেল করতে দেওয়া হচ্ছে
//   return app(req, res);
// };