import { S3Client} from "@aws-sdk/client-s3";

const accessKeyId = "jwzkgt57nsbjclxukbgml3sx2caa";
const secretAccessKey = "jzfzsz7ig7uin4rjpvgkdof75m4pibke27hkhvhwi7ffltrazxmxm";
const endpoint = "https://gateway.us1.storjshare.io";

export const s3 = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    endpoint,
});

export const BUCKET_NAME = "ad4m-languages"
