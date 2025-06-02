import AWS from 'aws-sdk';
import { useState} from 'react';

function UploadImage() {
    const [file, setFile] = useState(null);
    //function to upload file to s3
    const uploadFile = async () =>{
        const S3_BUCKET= "slinkchiwuikem";
        const REGION = "us-east-2"; 

        // Configure AWS SDK with credentials
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        // File parameters
        const params = {
            Bucket: S3_BUCKET,
            Key: file.name,
            Body: file,
        };

        // Upload the file to S3
        var upload =s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {

                console.log(
                    "Uploading" + parseInt((evt.loaded * 100)/evt.total) + "%"
                );
            })
            .promise();
        
        await upload.then((err, data) => {
            console.log(err);

            alert("File uploaded successfully");
        });
    };


    //function to handle file and store it to file state
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
}
export default UploadImage;