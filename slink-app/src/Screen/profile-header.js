import React, {useState, useEffect} from 'react';
import AWS from 'aws-sdk';
import {useAuth} from 'react-oidc-context';

import './styles/profile-header.css'

function ProfileHeader(){
    const { user, isAuthenticated } = useAuth();
    const [profilePic, setProfilePic] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const S3_BUCKET = 'slinkchiwuikem';
    const REGION = 'us-east-2';

      // On mount, load saved URL
    useEffect(() => {
        if (user) {
        const sub = user.profile.sub;
        const savedUrl = localStorage.getItem(`profilePic_${sub}`);
        if (savedUrl) setProfilePic(savedUrl);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        if (!isAuthenticated){
             alert('log in')
             return;
        }
        const file = e.target.files[0];
        if (file){ 
            setFileToUpload(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const uploadFile = async () => {
        if (!fileToUpload){
             alert('Select file');
             return;
        }

        setIsUploading(true);
        //Configure AWS
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: REGION,
        });

        const s3= new AWS.S3();
        const fileKey = `${user.profile.sub}/profile-${Date.now()}.${fileToUpload.name.split('.').pop()}`;
        const params = {
            Bucket: S3_BUCKET,
            Key: fileKey,
            Body: fileToUpload,
            ContentType: fileToUpload.type,
        };

        try {
            await s3.upload(params).promise();

            const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;
            localStorage.setItem(`profilePic_${user.profile.sub}`, url);
            setProfilePic(url)
            setFileToUpload(null);
            setPreviewURL(null);
            document.getElementById('profile-file-input').value = '';
            } catch (err){
                console.error(err);
                alert('Upload Failed');
            } finally {
                setIsUploading(false);
            }
    };

    const closePreview = () => {
        setPreviewURL(null);
        setFileToUpload(null);
        document.getElementById('profile-file-input').value='';
    };
    
    return (
        <div className="profile-header-container">
            <div className="profile-pic-section">
                <div className="profile-pic-wrapper">
                    {profilePic ? (
                        <img
                            src={profilePic}
                            alt='Profile'
                            className="profile-image"
                        />
                    ) : (
                        <div className="placeholder-profile-pic"> No Profile Image</div>
                    )}
                </div>
                 {/*Upload Controls*/}
                <label htmlFor="profile-file-input" className="chooseFile-icon-button">
                    +
                </label>
                <input
                    id="profile-file-input"
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                />
            </div>
            {/*Preview Section*/}
            {previewURL && (
                <div className="preview-overlay">
                    <div className="preview-container">
                        <button className="close-preview" onClick={closePreview}>
                            &times;
                        </button>
                        <img src={previewURL} alt="Preview" className="preview-media" />
                        <button onClick={uploadFile} disabled={isUploading} className="preview-upload-button">
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ProfileHeader;