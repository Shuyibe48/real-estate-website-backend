import { Platforms } from "../modules/platform/platform.model.js";

const platform = {
  logo: "logo.png",
  banner: "banner.png",
  developerBanner: "developer-banner.png",
};

const seedPlatform = async () => {
  const isPlatforms = await Platforms.findOne({ platform: "platform" });
  if (!isPlatforms) {
    await Platforms.create(platform);
  }
};

export default seedPlatform;
