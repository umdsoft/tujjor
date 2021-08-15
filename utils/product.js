const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require(".");
exports.sharpProductImage = async (filename) => {
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(500, 450)
        .toFile(
            path.join(path.dirname(__dirname) + `/public/uploads/products/${filename}`),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
};
exports.sharpParamImage = async (filename) => {
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(500, 450)
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/colors/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
};
exports.sharpFrontImage = async (filename) => {
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(222, 222)
        .jpeg({
            quality: 80,
        })
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/cards/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
};
exports.sharpFooterImage = async (filename) => {
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize({ with: 1200 })
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/footer/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
};