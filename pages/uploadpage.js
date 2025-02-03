import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { storage } from '@/app/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import MainLayout from '../app/mainlayout';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import '../app/styles/upload.css';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [lastUploadTime, setLastUploadTime] = useState(0);
  const [files, setFiles] = useState([]);
  const [fileHash, setFileHash] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const uploadCooldown = 5000; 
  const maxFileSize = 1 * 1024 * 1024; 
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const router = useRouter();

  //Use the useEffect hook to check if the user is authenticated in firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFiles(user.uid); 
      } else {
        setErrorMessage('User not authenticated. Please log in.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const fetchFiles = async (userId) => {
    try {
        const storageRef = ref(storage, `users/${userId}/uploads`);
        const listResult = await listAll(storageRef);

        const fileHashes = listResult.items.map(itemRef => itemRef.name);

        // Fetch filenames and status from MongoDB using file hashes
        const response = await axios.get(`/api/FIles`, {
            params: { hashes: fileHashes }
        });

        if (response.data && response.data.files) {
            const filesList = await Promise.all(
                fileHashes.map(async (hash) => {
                    const fileData = response.data.files[hash];
                    if (fileData) {
                        const downloadURL = await getDownloadURL(ref(storage, `users/${userId}/uploads/${hash}`));
                        return {
                            name: fileData.name,
                            hash: hash,
                            url: downloadURL,
                            status: fileData.status, 
                        };
                    }
                    return null;
                })
            );

            setFiles(filesList.filter(file => file !== null));
        } else {
            setFiles([]);
        }
    } catch (error) {
        console.error('Error fetching files:', error);
        setErrorMessage('Error fetching files. Please try again.');
    }
};


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name); 
      setErrorMessage('');
    } else {
      setFile(null);
      setSelectedFileName(''); 
      setErrorMessage('Please upload a .doc, .docx, or .pdf file.');
    }
  };

  const generateFileHash = (file, userId) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        // Create a combined string with the file data and userid to use for the hash 
        // Chat GPT generated the following code snippet to combine the file data and user ID for the hash (line 122 and 123)
        // Prompt: how can i generate a unique file hash for the file contents of each users file but have it be different if two users upload the exact same file
        const combinedData = `${userId}::${new Uint8Array(reader.result).join('')}`;
        const hash = sha256(combinedData);
        resolve(hash);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    const currentTime = Date.now();

    if (currentTime - lastUploadTime < uploadCooldown) {
      setErrorMessage('Please wait before uploading another file.');
      return;
    }

    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }

    if (file.size > maxFileSize) {
      setErrorMessage('File size exceeds 1 MB. Please submit a smaller file.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      setErrorMessage('User email is not available.');
      return;
    }

    const fileHash = await generateFileHash(file, user.uid);
    setFileHash(fileHash);

    try {
      // Fetch the MongoDB userId associated with the Firebase Auth email
      const userResponse = await axios.get(`/api/Users/email`, {
        params: { email: user.email },
      });

      if (!userResponse.data || !userResponse.data.userId) {
        throw new Error('Failed to get user ID from MongoDB.');
      }

      const mongoUserId = userResponse.data.userId;

      const fileName = `${file.name}`;
      const storageRef = ref(storage, `users/${user.uid}/uploads/${fileHash}`);

      // Check if file already exists in Firebase Storage
      const listRef = ref(storage, `users/${user.uid}/uploads`);
      const listResult = await listAll(listRef);

      const fileExists = listResult.items.some(itemRef => itemRef.name === fileHash);

      if (fileExists) {
        setErrorMessage('This file already exists. Please choose a different file.');
        return;
      }

      // Check for duplicate file hash in MongoDB
      const response = await axios.get(`/api/FIles`, {
        params: { hash: fileHash, userId: mongoUserId }
      });

      if (response.data.exists) {
        setErrorMessage('This file has already been uploaded.');
        return;
      }

      // Proceed with Firebase upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          setErrorMessage('Upload failed. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadUrl(downloadURL);
          setErrorMessage('');
          setLastUploadTime(currentTime);

          // Save file metadata to database
          try {
            const postResponse = await axios.post(`/api/FIles`, {
              userId: mongoUserId,
              fileHash,
              fileName
            });

            console.log('File metadata response:', postResponse.data);
          } catch (error) {
            console.error('Error saving file metadata:', error);
            setErrorMessage('Error saving file metadata. Please try again.');
          }

          // Fetch updated file list
          fetchFiles(user.uid);
        }
      );
    } catch (error) {
      console.error('Error checking file hash or listing files:', error);
      setErrorMessage('Error checking file hash or listing files. Please try again.');
    }
  };

  const handleDelete = async (fileHash) => {
    if (!fileHash) {
      setErrorMessage('No file selected for deletion.');
      return;
    }

    // Optimistic UI update( Remove the file immediately in the UI before the actual delete request goes through in MongoDB)
    setFiles(files.filter(file => file.hash !== fileHash));

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setErrorMessage('User is not authenticated.');
        return;
      }

      const storageRef = ref(storage, `users/${user.uid}/uploads/${fileHash}`);
      await deleteObject(storageRef);

      await axios.delete(`/api/FIles/${encodeURIComponent(fileHash)}`);

      // Fetch updated file list
      fetchFiles(user.uid);

    } catch (error) {
      console.error('Error deleting file:', error);
      setErrorMessage('Error deleting file. Please try again.');

      // Rollback optimistic UI update 
      fetchFiles(user.uid);
    }
  };

  return (
    <MainLayout>
      <div className={`upload-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <motion.div 
          className={`max-w-3xl mx-auto p-4 md:p-8 lg:p-16 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-800 border border-gray-600' : 'bg-white border border-gray-300'} mt-16 mb-12`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-center text-4xl font-bold mb-6">Upload File</h1>
          
          <div className="flex justify-center relative items-center">
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <motion.label
              htmlFor="file-input"
              className={`flex items-center justify-center px-4 py-2 font-semibold cursor-pointer ${isDarkMode ? 'bg-slate-900 hover:bg-zinc-700 text-white' : 'bg-gray-300 hover:bg-zinc-600 text-black hover:text-white '} rounded-md z-10`}
              style={{
                height: '40px',
                lineHeight: '40px',
                minWidth: '150px',
                fontSize: '1.25rem', 
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Choose File
            </motion.label>
          </div>
  
          <div className='mt-2 mb-3 text-center'>
            {selectedFileName && (
              <motion.p
                className={`font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Selected File: {selectedFileName}
              </motion.p>
            )}
          </div>
  
          <motion.button
            onClick={handleUpload}
            className={`upload-button flex items-center justify-center mt-4 mx-auto px-8 py-4 font-semibold ${isDarkMode ? 'bg-slate-900 hover:bg-zinc-700 text-white' : 'bg-gray-300 hover:bg-zinc-600 text-black'} rounded-md hover:text-white transition-colors duration-300`}
            style={{
              height: '40px',
              lineHeight: '40px',
              minWidth: '150px', 
              fontSize: '1.25rem', 
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className='text-2xl'>Upload</span>
            <Image
              src="/upload.svg"
              alt="Upload Icon"
              width={20}
              height={20}
              className={`ml-2 upload-icon ${isDarkMode ? 'filter invert' : ''}`}
            />
          </motion.button>
  
          {uploadProgress > 0 && (
            <motion.div 
              className="text-center mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p>Uploading: {uploadProgress.toFixed(2)}%</p>
            </motion.div>
          )}
  
          {uploadUrl && (
            <motion.div 
              className="text-center mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p>File uploaded successfully!</p>
              <a
                href={uploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View File
              </a>
            </motion.div>
          )}
  
          {errorMessage && (
            <motion.div 
              className="text-center mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-red-500">{errorMessage}</p>
            </motion.div>
          )}
  
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">Uploaded Files</h2>
            {files.length > 0 ? (
              <ul>
                {files.map((file) => (
                  <motion.li 
                    key={file.hash} 
                    className="mb-2 flex items-center justify-between"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                  <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`no-underline ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                  {file.name}{' '}
                  <span 
                      className={`${file.status === 'pending evaluation' ? 'text-orange-500' : file.status === 'reviewed' ? 'text-green-500' : ''}`}
                  >
                      {file.status}
                  </span>
              </a>

                   
                    <Image
                      width={24}
                      height={24}
                      src="/trash.png"
                      alt="Delete"
                      className={`ml-4 w-8 h-8 cursor-pointer hover:opacity-75 ${isDarkMode ? 'filter invert' : ''}`}
                      onClick={() => handleDelete(file.hash)}
                    />
                  </motion.li>
                ))}
              </ul>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                No files uploaded yet.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}  