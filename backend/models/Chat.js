import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    name: { type: String },
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
