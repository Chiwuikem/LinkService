import AWS from 'aws-sdk';
import { useState, useEffect} from 'react';
import { useAuth } from "react-oidc-context"; 
import './helper-css/upload-image.css'; 

function UploadImage() {
    const auth = useAuth();
    const { user } = useAuth();
    const [userSub, setUserSub] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadedImages, setUploadedImages]= useState([]);
    const [fileMap, setFileMap] = useState({});
    const [fileToUpload, setFileToUpload] = useState(null);

    // Fetch the user's sub when the component loads
    useEffect(() => {
        if (user){
                setUserSub(user.profile.sub);
                const saved = localStorage.getItem(`userImage_${user.profile.sub}`);
                if (saved) {
                    try{
                    const parsed= JSON.parse(saved);
                    const images = Array.isArray(parsed) ? parsed : [parsed];
                    setUploadedImages(images);
                    } catch (e){
                        setUploadedImages([saved]);
                    }
                    
                }
            }
        
    }, [user]);

    //function to handle file and store it to file state
    const handleFileChange = (e, index) => {
        if(!auth.isAuthenticated){
            alert("Please log in to upload files.");
            e.target.value = ''; // Clear the file input
            return;

            
        }
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            alert("No file selected.");
            return;
        }
        setFileToUpload(selectedFile);
    };



    //function to upload file to s3

    const uploadFile = async () =>{
        if (!fileToUpload) {
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

        const s3 = new AWS.S3({region: REGION});

        const fileKey = `${userSub}/${Date.now()}_${fileToUpload.name}`;

        // File parameters
        const params = {
            Bucket: S3_BUCKET,
            Key: fileKey, // Use user's sub as a folder
            Body: fileToUpload,
            ContentType: fileToUpload.type,
        };

        // Upload the file to S3
         try {
            await s3.upload(params).promise();
            
            // Generate the public URL
            const uploadedUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;

            const updatedImages = [...uploadedImages, uploadedUrl]; // Create a new array with the new URL

            // Update the specific index with the new URL 
            setUploadedImages(updatedImages);

            // Save the URL to localStorage
            localStorage.setItem(`userImage_${userSub}`, JSON.stringify(updatedImages));
            setFileToUpload(null); // Clear the file input state
            document.getElementById('file-upload').value = ''; // Clear the file input in the UI
            alert("File uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            alert("Error uploading file");
        } finally {
            setIsUploading(false);
        }
    };

    const deleteFile = async (index) => {
        const imageUrl = uploadedImages[index]
        if (!user || !imageUrl) return;

        setIsDeleting(true);
        const S3_BUCKET = "slinkchiwuikem";
        const REGION = "us-east-2";

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({ region: REGION });

        // Extract the file key from the URL
        const fileKey = imageUrl.split(`https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`)[1];

        const params = {
            Bucket: S3_BUCKET,
            Key: fileKey,
        };

        try {
            await s3.deleteObject(params).promise();
            const updated= [...uploadedImages];

            updated.splice(index, 1);
            setUploadedImages(updated);
            // Remove from localStorage
            localStorage.setItem(`userImage_${userSub}`, JSON.stringify(updated));
            
            // Clear the UI
            setFileMap(prev => {
                const updatedMap= { ...prev };
                delete updatedMap[index]; // Remove the specific index
                return updatedMap;
            });
            alert("File deleted successfully");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting file");
        } finally {
            setIsDeleting(false);
        }
    };

    return (

        <div>
            <div className="media-upload-grid">
                {uploadedImages.map((url, index) => (
                    <div key={url} className="upload-container">
                        <img src={url} alt={`uploaded-${index}`} className="uploaded-image" />
                        <button onClick={() => deleteFile(index)} disabled={isDeleting} className="delete-button">
                            &times;
                        </button>
                    </div>
                ))}
                <div>
                    <div className="upload-container">
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*, video/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="upload-label">
                            <span className="plus-sign">+</span>
                        </label>
                    </div>

                        {fileToUpload && (
                            <div className="upload-button-under-file">
                                <button
                                    onClick={ uploadFile}
                                    disabled={isUploading}
                                    className="upload-button"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        )}
                    </div>
                
            
                
            </div>
        </div>
    );
}
export default UploadImage;