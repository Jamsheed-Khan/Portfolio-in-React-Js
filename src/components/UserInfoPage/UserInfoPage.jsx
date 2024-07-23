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
  FaGoogle,
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
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../Assets/config/firebase/firebaseMethods";

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

  const handleReply = async (event) => {
    event.preventDefault();
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
      render: (text) => (
        <span>
          <FaEnvelope /> {text}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span>
          <FaUser /> {text}
        </span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => (
        <span>
          <FaComment /> {text}
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
              (snapshot) => {},
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
    <div className="container mt-5">
      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      {isLoggedIn ? (
        currentUser.email === "jamshedkh365@gmail.com" ? (
          <>
            <div className="d-flex justify-content-between align-items-center  mb-4" style={{marginTop:100}}>
              <h1 className="text-white">Admin Dashboard</h1>
              <Button variant="secondary" onClick={signOutUser}>
                <FaSignOutAlt /> Sign Out
              </Button>
            </div>
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Reply</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <FaEnvelope /> {user.email}
                    </td>
                    <td>
                      <FaUser /> {user.name}
                    </td>
                    <td>
                      <FaComment /> {user.message}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => setSelectedUser(user)}
                      >
                        <FaReply /> Reply
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {selectedUser && (
              <Form onSubmit={handleReply} className="mt-4">
                <Form.Group as={Row} controlId="replyMessage">
                  <Form.Label column sm={2}>
                    Reply to {selectedUser.email}:
                  </Form.Label>
                  <Col sm={10}>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        value={replyMessage}
                        onChange={handleReplyChange}
                        required
                      />
                      <InputGroup.Append>
                        <Button variant="success" type="submit">
                          <FaReply /> Send Reply
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Form>
            )}
            <div className="d-flex justify-content-between align-items-center  mb-4">
              <h2 className="text-white">Manage Videos</h2>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
              >
                <FaUpload /> Upload New Video
              </Button>
            </div>
            <Modal show={showUploadModal} onHide={handleUploadModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Upload New Video</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="videoTitle">
                    <Form.Label>Video Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={videoTitle}
                      onChange={handleVideoTitleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="videoDescription" className="mt-3">
                    <Form.Label>Video Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={videoDescription}
                      onChange={handleVideoDescriptionChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="videoFile" className="mt-3">
                    <Form.Label>Video File</Form.Label>
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="videoThumbnail" className="mt-3">
                    <Form.Label>Video Thumbnail</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbnailChange}
                      required
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                {isUploading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <>
                    <Button variant="secondary" onClick={handleUploadModalClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleUploadVideo}>
                      Upload Video
                    </Button>
                  </>
                )}
              </Modal.Footer>
            </Modal>
            <div className="row ">
              {videos.map((video) => (
                <div key={video.id} className="col-md-4 mb-4">
                  <div className="card project-card-view">
                    <iframe
                    style={{height:350}}
                      src={video.videoURL}
                      className="card-img-top"
                      alt={video.title}
                    />
                    <div className="card-body ">
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
                            if (updatedTitle && updatedDescription) {
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
          <div className="text-center mt-5 text-white">
            <Alert variant="danger">
              You do not have permission to view this page.
            </Alert>
          </div>
        )
      ) : (
        <div className="text-center mt-5">
          <h2 className="text-white mb-4">Please sign in to continue</h2>
          <Button variant="primary" onClick={signInWithGoogle}>
            <FaGoogle /> Sign in with Google
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
