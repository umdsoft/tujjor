const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema(
    {
        name: {
            uz: { type: String, required: true },
            ru: { type: String, reuqired: true },
        },
    },
    { timestamps: true }
);
RegionSchema.pre("remove", async function (next) {
    await this.model("District").deleteMany({ region: this._id });
    next();
});

module.exports = mongoose.model("Region", RegionSchema);
