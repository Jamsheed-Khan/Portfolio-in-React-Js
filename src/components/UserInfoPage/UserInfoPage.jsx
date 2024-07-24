import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Alert,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaReply,
  FaVideo,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  db,
  auth,
  storage,
} from "../../Assets/config/firebase/firebaseMethods";
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAlertMessage("Failed to sign in. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      
    } catch (error) {
      console.error("Error signing out:", error);
      setAlertMessage("Failed to sign out. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "UserInfo");
      const snapshot = await getDocs(usersCollection);
      const userData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(userData);
    };

    const fetchVideos = async () => {
      const videosCollection = collection(db, "Videos");
      const snapshot = await getDocs(videosCollection);
      const videoData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVideos(videoData);
    };

    if (isLoggedIn && currentUser.email === "jamshedkh365@gmail.com") {
      fetchUsers();
      fetchVideos();
    }
   
  }, [isLoggedIn, currentUser]);

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleReply = async () => {
    if (selectedUser && replyMessage) {
      try {
        await addDoc(collection(db, "Replies"), {
          userId: selectedUser.id,
          message: replyMessage,
        });
        setAlertMessage("Reply sent successfully!");
        setAlertVariant("success");
        setShowAlert(true);
        setReplyMessage("");
        setSelectedUser(null);
      } catch (error) {
        console.error("Error sending reply:", error);
        setAlertMessage("Failed to send reply. Please try again.");
        setAlertVariant("danger");
        setShowAlert(true);
      }
    } else {
      setAlertMessage("Please select a user and enter a reply message.");
      setAlertVariant("warning");
      setShowAlert(true);
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <span>
          <FaEnvelope />
          {text}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          <FaUser />
          {text}
        </span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text, record) => (
        <span>
          <FaComment />
          {text}
        </span>
      ),
    },
    {
      title: "Reply",
      key: "reply",
      render: (text, record) => (
        <Button variant="primary" onClick={() => setSelectedUser(record)}>
          <FaReply /> Reply
        </Button>
      ),
    },
  ];

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
    setVideoTitle("");
    setVideoDescription("");
    setVideoFile(null);
    setVideoThumbnail(null);
  };


  const handleVideoTitleChange = (e) => {
    setVideoTitle(e.target.value);
  };

  const handleVideoDescriptionChange = (e) => {
    setVideoDescription(e.target.value);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleVideoThumbnailChange = (e) => {
    setVideoThumbnail(e.target.files[0]);
  };

  const handleUploadVideo = async () => {
    if (videoFile && videoThumbnail) {
      setIsUploading(true);
      try {
        const storageRef = ref(
          storage,
          `videos/${currentUser.email}/${videoFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading video:", error);
            setAlertMessage("Failed to upload video. Please try again.");
            setAlertVariant("danger");
            setShowAlert(true);
            setIsUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Upload thumbnail to storage
            const thumbnailRef = ref(
              storage,
              `thumbnails/${currentUser.email}/${videoThumbnail.name}`
            );
            const thumbnailUploadTask = uploadBytesResumable(
              thumbnailRef,
              videoThumbnail
            );

            thumbnailUploadTask.on(
              "state_changed",
              (snapshot) => {
                // Handle thumbnail upload progress (optional)
              },
              (error) => {
                console.error("Error uploading thumbnail:", error);
                setAlertMessage(
                  "Failed to upload thumbnail. Please try again."
                );
                setAlertVariant("danger");
                setShowAlert(true);
                setIsUploading(false);
              },
              async () => {
                const thumbnailDownloadURL = await getDownloadURL(
                  thumbnailUploadTask.snapshot.ref
                );

                // Store video data in Firestore
                await addDoc(collection(db, "Videos"), {
                  title: videoTitle,
                  description: videoDescription,
                  videoURL: downloadURL,
                  thumbnailURL: thumbnailDownloadURL,
                  userEmail: currentUser.email,
                });
                setAlertMessage("Video uploaded successfully!");
                setAlertVariant("success");
                setShowAlert(true);
                handleUploadModalClose();
                setIsUploading(false);
              }
            );
          }
        );
      } catch (error) {
        console.error("Error uploading video:", error);
        setAlertMessage("Failed to upload video. Please try again.");
        setAlertVariant("danger");
        setShowAlert(true);
        setIsUploading(false);
      }
    } else {
      setAlertMessage("Please select a video and thumbnail.");
      setAlertVariant("warning");
      setShowAlert(true);
    }
  };

  const handleEditVideo = async (videoId, updatedTitle, updatedDescription) => {
    try {
      const videoDocRef = doc(db, "Videos", videoId);
      await updateDoc(videoDocRef, {
        title: updatedTitle,
        description: updatedDescription,
      });
      setAlertMessage("Video updated successfully!");
      setAlertVariant("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating video:", error);
      setAlertMessage("Failed to update video. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const videoDocRef = doc(db, "Videos", videoId);
      await deleteDoc(videoDocRef);
      setAlertMessage("Video deleted successfully!");
      setAlertVariant("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting video:", error);
      setAlertMessage("Failed to delete video. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        currentUser.email === "jamshedkh365@gmail.com" ? (
          <>
            <div className="d-flex justify-content-center  vh-70 row " style={{marginTop:100}}>
              <h1 className="text-white justify-content-center mb-4  text-center">
                User Information
              </h1>
              <Table striped bordered hover responsive className="w-100 text-white">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {columns.map((column) => (
                        <td key={column.key} className="text-white">
                          {column.render
                            ? column.render(user[column.dataIndex], user)
                            : user[column.dataIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {showAlert && (
              <Alert
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}

            {selectedUser && (
              <Row className="mt-3 text-white">
                <Col md={6} className="mx-auto">
                  <Form onSubmit={handleReply}>
                    <Form.Group className="mb-3" controlId="replyMessage">
                      <Form.Label>Reply Message</Form.Label>
                      <InputGroup>
                        <FormControl
                          as="textarea"
                          rows={4}
                          value={replyMessage}
                          onChange={handleReplyChange}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Send Reply
                    </Button>
                  </Form>
                </Col>
              </Row>
            )}

            <Button className="m-2" variant="primary" onClick={() => setShowUploadModal(true)}>
            <FaUpload /> Upload Video
            </Button>
            <Button variant="primary" onClick={signOutUser} link='/videos'>
            <FaSignOutAlt /> Sign Out
            </Button>

            <Modal show={showUploadModal} onHide={handleUploadModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Upload Video</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="videoTitle">
                    <Form.Label>Video Title</Form.Label>
                    <FormControl
                      type="text"
                      value={videoTitle}
                      onChange={handleVideoTitleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="videoDescription">
                    <Form.Label>Video Description</Form.Label>
                    <FormControl
                      as="textarea"
                      rows={3}
                      value={videoDescription}
                      onChange={handleVideoDescriptionChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="videoFile">
                    <Form.Label>Video File</Form.Label>
                    <FormControl
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="videoThumbnail">
                    <Form.Label>Video Thumbnail</Form.Label>
                    <FormControl
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbnailChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleUploadModalClose}>
                  Close
                </Button>
                {isUploading ? (
                  <Button variant="primary" disabled>
                    <Spinner animation="border" size="sm" /> Uploading...
                    {uploadProgress > 0 && (
                      <span> {uploadProgress.toFixed(0)}%</span>
                    )}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleUploadVideo}>
                    Upload
                  </Button>
                )}
              </Modal.Footer>
            </Modal>

            <h2 className="text-white">Uploaded Videos</h2>
            <div className="row">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="col-md-4 mb-3"
                  style={{ maxWidth: "300px" }}
                >
                  <div className="card project-card-view">
                    <iframe
                      width="100%"
                      height="200"
                      src={video.videoURL}
                      title={video.title}
                      frameborder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                    <div className="card-body">
                      <h5 className="card-title">{video.title}</h5>
                      <p className="card-text">{video.description}</p>

                      <div className="d-flex justify-content-between">
                        <Button
                          variant="primary"
                          onClick={() => {
                            const updatedTitle = prompt(
                              "Enter new video title:",
                              video.title
                            );
                            const updatedDescription = prompt(
                              "Enter new video description:",
                              video.description
                            );
                            if (
                              updatedTitle !== null &&
                              updatedDescription !== null
                            ) {
                              handleEditVideo(
                                video.id,
                                updatedTitle,
                                updatedDescription
                              );
                            }
                          }}
                        >
                          <FaEdit /> Edit
                        </Button>

                        <Button
                          variant="primary"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="d-flex  justify-content-center align-items-center vh-100 row">
            <Alert variant="warning">
              You are not authorized to access this page.Only Jamhsheed khan can
              access this page.
            </Alert>
            <Button className="" variant="danger" onClick={signOutUser}>
              Sign Out
            </Button>
          </div>
        )
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Button variant="primary" onClick={signInWithGoogle}>
            Sign In with Google
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
