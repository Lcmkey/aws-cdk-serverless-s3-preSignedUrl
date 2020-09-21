const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({ region: "ap-southeast-1" });
const s3 = new AWS.S3();

const getUploadURL = async () => {
  const objectId = uuidv4();

  const s3Params = {
    Bucket: process.env.BucketName,
    Key: `${objectId}.jpg`, //filename
    ContentType: "image/jpeg", // Update to match whichever content type you need to upload
    //ACL: 'public-read'      // Enable this setting to make the object publicly readable - only works if the bucket can support public objects
    Expires: 100 //time to expire in seconds
  };

  console.log("getUploadURL: ", s3Params);

  return new Promise((resolve, reject) => {
    // Get signed URL
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*",
      },
      "body": JSON.stringify({
        "uploadURL": s3.getSignedUrl("putObject", s3Params),
        "photoFilename": `${objectId}.jpg`,
      }),
    });
  });
};

// Main Lambda entry point
const handler = async (event: any = {}) => {
  const result = await getUploadURL();

  console.log("Result: ", result);

  return result;
};

export { handler };
