/**
 * DIGITAL OCEAN UPLOADER BASIC SETUP
 **/

import S3 from "react-aws-s3-typescript";

import configs from "config";

const config = {
  bucketName: configs.DO_BUCKET,
  region: configs.DO_SPACES_ENDPOINT,
  accessKeyId: configs.DO_SPACES_KEY,
  secretAccessKey: configs.DO_SPACES_SECRET,
  s3Url: configs.DO_SPACES_URL /* optional */,
};

const client = new S3(config);

export default async function uploadFile(
  file: File,
  filename: string | null = null
) {
  return await client.uploadFile(file, filename ?? file.name);
}
