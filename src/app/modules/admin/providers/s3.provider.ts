import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.AWS_S3_REGION,
});

export const s3 = {
  put: async (key: string, body: any): Promise<string> => {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ACL: 'public-read',
    });
    await client.send(command);
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  },
};
