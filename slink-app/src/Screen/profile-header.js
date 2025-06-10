import React, {useState, useEffect} from 'react';
import AWS from 'aws-sdk';
import {useAuth} from 'react-oidc-context';

import './styles/profile-header.css'

function ProfileHeader(){

    const {  user, isAuthenticated, signinRedirect } = useAuth();
    const [bio,setBio]= useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingBio, setIsEditingBio]= useState(false);

    const S3_BUCKET = 'slinkchiwuikem';
    const REGION = 'us-east-2';

      // On mount, load saved URL
    useEffect(() => {
        if (user) {
        const sub = user.profile.sub;
        const savedUrl = localStorage.getItem(`profilePic_${sub}`);
        const savedBio = localStorage.getItem(`bio_${sub}`);
        if (savedUrl) setProfilePic(savedUrl);
        if (savedBio) setBio(savedBio);
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

    if (!isAuthenticated){
        return(
            <div>
                <button onClick={() => signinRedirect()}>sign in</button>
            </div>
        );
    }
    
        const user_email= user?.profile.email;
        const username=user.profile['cognito:username'];
        console.log(user_email);
        console.log(user.profile)
            // <pre> ID Token: {auth.user?.id_token} 
            // <pre> Access Token: {auth.user?.access_token} </pre>
            // < Refresh Token: {auth.user?.refresh_token} 
    
    
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
            {/* Bio and button section*/}
            <div className="profile-info-container" >
                <h1 className='username'>@{username}</h1>
                <input 
                    type="text"
                    className="bio-input"
                    value={bio}
                    readOnly={!isEditingBio}
                    onChange={(e) => setBio(e.target.value)}
                />
                {!isEditingBio ? (
                    <button className="edit-bio-button" onClick={() => setIsEditingBio(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <button className="save-bio-button" onClick={() => {
                        const sub = user.profile.sub;
                        localStorage.setItem(`bio_${sub}`, bio);
                        setIsEditingBio(false);
                    }}>
                        Save
                    </button>
                )}
            </div>
            {/* White Line Seperator */}
            <div className='separator'/>
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