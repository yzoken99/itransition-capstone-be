import mongoose from "mongoose";
const { Schema, model } = mongoose;

const itemSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    topic: { type: String },
    image: { type: String },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String },
      },
    ],
    tags: { type: String },
    owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

itemSchema.index({ "$**": "text" });
export default model("Item", itemSchema);
