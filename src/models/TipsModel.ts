import { Schema, models, model } from "mongoose";

const TipsSchema = new Schema(
  {
    tip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tips = models.tips || model("tips", TipsSchema);

export default Tips;
