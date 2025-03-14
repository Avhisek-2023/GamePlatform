import mongoose from "mongoose";

const userProfileSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    profile_pic_url: {
      type: String,
    },
    bio: {
      type: String,
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
