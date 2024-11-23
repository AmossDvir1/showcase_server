import UserSettings from "../../../models/UserSettings";

const createDefaultSettings = async (userId: string) => {
  const defaultSettings = new UserSettings({
    userId,
    profile: {
      technologies: [],
      coverPicture: "",
      profilePicture: "",
    },
  });

  await defaultSettings.save();
  return defaultSettings;
};

export { createDefaultSettings };
