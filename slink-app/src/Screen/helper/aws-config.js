import AWS from 'aws-sdk';

export const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
export const REGION = process.env.REACT_APP_COGNITO_REGION;
AWS.config.update({
    region: REGION, 
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    },
});

const s3 = new AWS.S3();
export default s3;