const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    // all schema will be different for different collection

    CONNECTION: String,
    NAME: String,
    WARD: Number,
    ZONE: Number,
    ADDRESS: String,
    SR_NO: Number,
    POSITION: String,
  },
  {
    collection: "WaterWinners",
  }
);

module.exports = mongoose.model("WaterWinners", winnerSchema);
