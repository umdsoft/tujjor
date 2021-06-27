const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require(".");
exports.sharpProductImage = async (filename) => {
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(500, 600)
        .jpeg({
            quality: 95,
        })
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/${filename}`
            ),
            (err) => {}
        );
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(50, 50)
        .jpeg({
            quality: 50,
        })
        .toFile(
            path.join(
                path.dirname(__dirname) +
                    `/public/uploads/products/smalls/${filename}`
            ),
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
        .resize(50, 50)
        .jpeg({
            quality: 40,
        })
        .toFile(
            path.join(
                path.dirname(__dirname) +
                    `/public/uploads/products/colors/${filename}`
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
        .resize(500, 600)
        .jpeg({
            quality: 65,
        })
        .toFile(
            path.join(
                path.dirname(__dirname) +
                    `/public/uploads/products/cards/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
};
