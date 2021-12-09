import S3 from "aws-sdk/clients/s3";

const accessKeyId = "jwzkgt57nsbjclxukbgml3sx2caa";
const secretAccessKey = "jzfzsz7ig7uin4rjpvgkdof75m4pibke27hkhvhwi7ffltrazxmxm";
const endpoint = "https://gateway.us1.storjshare.io";

export const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  endpoint,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  connectTimeout: 0,
  httpOptions: { timeout: 0 }
});

export const BUCKET_NAME = "ad4m-languages"
