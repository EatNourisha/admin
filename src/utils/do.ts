/**
 * DIGITAL OCEAN UPLOADER BASIC SETUP
 **/

import S3 from "react-aws-s3-typescript";

import configs from "config";

// const config = {
//   bucketName: configs.DO_BUCKET,
//   region: configs.DO_SPACES_ENDPOINT,
//   accessKeyId: configs.DO_SPACES_KEY,
//   secretAccessKey: configs.DO_SPACES_SECRET,
//   s3Url: configs.DO_SPACES_URL,
// };

const config = {
  bucketName: configs.AWS_BUCKET,
  region: configs.AWS_REGION,
  accessKeyId: configs.AWS_ACCESS_KEY,
  secretAccessKey: configs.AWS_SECRET_KEY,
  s3Url: `https://${configs.AWS_BUCKET}.s3.${configs.AWS_REGION}.amazonaws.com`,
};

const client = new S3(config);

export default async function uploadFile(
  file: File,
  filename: string | null = null
) {
  // console.log("config", config);
  return await client.uploadFile(file, filename ?? file.name);
}

// rapydcars-upload-policy
// ACCESS-KEY-ID: AKIAUDYTFEK2BOTMSG7C
// ACCESS-SECRET: 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
// USER-ARN: arn:aws:iam::282971153076:user/rapydcars-upload-user

//////////////////////////////////////////////////////////////// STEPS //////////////////////////////////////////////////////////////////
/**
 * 1. Create a new S3 Bucket and enable ACL with Object writer setting.
 * 2. Goto IAM, create a policy and set s3 PutObject, GetObject and DeleteObject read and write permissions
 * 3. Under IAM, create a user and add the policy created in step 2 to it, copy the user ARN and paste it somewhere for later use.
 * 4. Navigate to the Permissions tab in the new bucket just created. - Services -> Bucket -> your-new-bucket -> permissions tab.
 * 4. Copy the bucket policy below and replace the - Principal: {AWS: '******'} with - Principal: {AWS: 'your user arn'} and save
 * 5. Then copy the cors config and paste it in the cors section and save changes.
 */

//////////////////////////////////////////////////////////////// BUCKET POLICY //////////////////////////////////////////////////////////////////
// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Sid": "PublicRead",
//             "Effect": "Allow",
//             "Principal": "*",
//             "Action": [
//                 "s3:GetObject",
//                 "s3:GetObjectVersion"
//             ],
//             "Resource": "arn:aws:s3:::rapyd/*"
//         },
//         {
//             "Sid": "IamAllAccess",
//             "Effect": "Allow",
//             "Principal": {
//                 "AWS": "arn:aws:iam::523912022488:user/rapyd-iam" // user with the intended bucket policy arn
//             },
//             "Action": "s3:*",
//             "Resource": [
//                 "arn:aws:s3:::rapyd", // bucket arn -> access to the bucket
//                 "arn:aws:s3:::rapyd/*" // bucket objects arn -> access to all the bucket objects
//             ]
//         }
//     ]
// }

//////////////////////////////////////////////////////////////// CORS //////////////////////////////////////////////////////////////////
// [
//   {
//     AllowedHeaders: ["*"],
//     AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
//     AllowedOrigins: ["*"],
//     ExposeHeaders: [
//        "Access-Control-Allow-Origin",
//        "x-amz-server-side-encryption",
//        "x-amz-request-id",
//        "x-amz-id-2",
//     ],
//   },
// ];
