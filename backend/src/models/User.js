import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: String,
    avatarUrl: String,
    friends: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
