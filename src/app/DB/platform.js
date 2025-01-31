// import { Platforms } from "../modules/platform/platform.model.js";

// const platform = {
//   logo: "logo.png",
//   banner: "banner.png",
//   developerBanner: "developer-banner.png",
// };

// const seedPlatform = async () => {
//   const isPlatforms = await Platforms.findOne({ platform: "platform" });
//   if (!isPlatforms) {
//     await Platforms.create(platform);
//   }
// };

// export default seedPlatform;


import { Platforms } from "../modules/platform/platform.model.js";

const platform = {
  logo: process.env.PLATFORM_LOGO || "logo.png",
  banner: process.env.PLATFORM_BANNER || "banner.png",
  developerBanner: process.env.PLATFORM_DEVELOPER_BANNER || "developer-banner.png",
};

const seedPlatform = async () => {
  try {
    const existingPlatform = await Platforms.findOne({ platform: "platform" });
    if (!existingPlatform) {
      await Platforms.create(platform);
      console.log("Platform seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding platform:", error);
  }
};

export default seedPlatform;
