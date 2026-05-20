const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

async function signImageUrlAndAttackToData(dataArr) {
    let dataToReturn = await Promise.all(
        dataArr.map(async (item) => {
            if (typeof item.imageName !== 'undefined' && item.imageName) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: item.imageName
                };
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, {expiresIn: 3600});
                return {
                    imageUrl : url,
                    headline : item.headline,
                    articleText : item.articleText,
                    imageName : item.imageName,
                    imageOriginalName : item.imageOriginalName,
                    articleTags : item.articleTags,
                    _id : item._id
                };
            } else {
                // if articles has no image
                return {
                    headline : item.headline,
                    articleText : item.articleText,
                    imageName : item.imageName,
                    imageOriginalName : item.imageOriginalName,
                    articleTags : item.articleTags,
                    _id : item._id
                };
            }
        })
    );
    return dataToReturn;
}
module.exports = signImageUrlAndAttackToData;

