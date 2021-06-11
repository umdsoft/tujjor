exports.validateFile = (req, res, next) => {
    if(!req.file) {
      return res.status(404).json({success: false, message:"File dont Upload"});
    }
    next()
}