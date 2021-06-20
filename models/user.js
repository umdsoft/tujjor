const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
    {
        phone: { type: String, unique: true, required: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true },
        role: {
            type: String,
            required: true,
            default: "client",
            enum: ["admin", "seller", "client"],
        },
    },
    { timestamps: true }
);
UserSchema.pre("remove", async function (next) {
    await this.model("Shop").deleteOne({ user: this._id });
    next();
});
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", UserSchema);
