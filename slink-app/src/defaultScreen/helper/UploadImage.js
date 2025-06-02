import AWS from 'aws-sdk';
import { useState, useEffect} from 'react';
import { useAuth } from "react-oidc-context"; 

function UploadImage() {
    const auth = useAuth();
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [userSub, setUserSub] = useState('');
    const [imageUrl, setImageUrl] =useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch the user's sub when the component loads
    useEffect(() => {
        if (user){
                setUserSub(user.profile.sub);
                const savedImageUrl = localStorage.getItem(`userImage_${user.profile.sub}`);
                if (savedImageUrl) {
                    setImageUrl(savedImageUrl);
                }
            }
        
    }, [user]);

        //function to handle file and store it to file state
    const handleFileChange = (e) => {
        if(!auth.isAuthenticated){
            console.error("not logged in");
            alert("Please log in to upload files.");
            e.target.value = ''; // Clear the file input
            return;

            
        }
        const file = e.target.files[0];
        setFile(file);
        setImageUrl('');
    };



    //function to upload file to s3

    const uploadFile = async () =>{
        if(!user){
            console.error("not logged in");
            alert("Please log in to upload files.");
            return;
            
        }
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }


        setIsUploading(true);
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

        const fileKey = `${userSub}/${file.name}`;

        // File parameters
        const params = {
            Bucket: S3_BUCKET,
            Key: fileKey, // Use user's sub as a folder
            Body: file,
        };

        // Upload the file to S3
         try {
            await s3.upload(params).promise();
            
            // Generate the public URL
            const uploadedUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;
            // Save the URL to localStorage
            localStorage.setItem(`userImage_${userSub}`, uploadedUrl);
            setImageUrl(uploadedUrl);
            
            alert("File uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            alert("Error uploading file");
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {imageUrl && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Uploaded Image:</h3>
                    <img 
                        src={imageUrl} 
                        alt="Uploaded content" 
                        style={{ maxWidth: '100%', height: '400px' }}
                    />
                </div>
            )}
        </div>
    );
}
export default UploadImage;