const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    PARTNER: String,
    PROPERTY_OWNER_NAME: String,
    WARD: Number,
    ZONE: Number,
    ASSMENTYEAR: String,
    TAX_AMT: String,
    SR_NO: Number,
    POSITION: String,

  },
  {
    collection: "Winners",
    timestamps: true,
  }
);

module.exports = mongoose.model("Winners", winnerSchema);
