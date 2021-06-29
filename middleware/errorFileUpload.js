exports.validateFile = (req, res, next) => {
    if (!(req.file || req.files)) {
        console.log("FILE", req.file, req.files);
        return res
            .status(404)
            .json({ success: false, message: "File dont Upload" });
    }
    next();
};
