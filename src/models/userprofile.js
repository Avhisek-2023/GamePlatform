import mongoose from "mongoose";

const userProfileSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
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
    phone_no: {
      type: String,
    },
    skills: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
