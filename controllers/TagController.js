const Tag = require("../models/tag");

exports.create = (req, res) => {
    const tag = new Tag({
        tag: req.body.tag,
    });
    tag.save()
        .then(() => {
            return res.status(200).json({ success: true, data: tag });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Tag.find() });
};
exports.delete = async (req, res) => {
    await Tag.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res
                .status(400)
                .json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
