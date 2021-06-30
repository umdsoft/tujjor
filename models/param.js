const mongoose = require("mongoose");
const ParamSchema = new mongoose.Schema({
    image: { type: String, required: true },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
});
ParamSchema.methods.delete = (id) => {
    console.log("DELETE Param .....");
    this.findByIdAndDelete({ _id: id }).then((param) => {
        if (param) {
            deleteFile(`/public${param.image}`);
        } else {
            this.delete(id);
        }
    });
};
module.exports = mongoose.model("Param", ParamSchema);
