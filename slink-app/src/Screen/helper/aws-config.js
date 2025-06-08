import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-2', 
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:8fecbc7e-97ab-4c85-85de-a8e740066f3b', // Replace with your Identity Pool ID
    }),
});

const s3 = new AWS.S3({ params: {Bucket: 'slinkchiwuikem'}});
export default s3;