import React, { useState, useEffect } from 'react';
import { Card, CardDeck, Container, Row, Col, Button } from 'react-bootstrap';
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
import { db, auth, storage } from "../../Assets/config/firebase/firebaseMethods";
import { useNavigate } from 'react-router-dom';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const videosRef = collection(db, 'Videos');
      const snapshot = await getDocs(videosRef);
      const videosData = snapshot.docs.map((doc) => doc.data());
      setVideos(videosData);
    };
    fetchVideos();
  }, [db]);

  const handleAdminClick = () => {
    navigate('/userinfopage', { replace: true });
  };

  return (
    <Container fluid style={{ marginTop: 100 }}>
      <Row className="justify-content-end mb-3 ">
        <Button variant="primary" onClick={handleAdminClick}>
          Admin
        </Button>
      </Row>
      <Row className=''>
        {videos.map((video, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={4}>
            <Card className="mb-3 project-card-view">
              <Card.Body className=''>
                <Card.Title>{video.title}</Card.Title>
                <Card.Text>{video.description}</Card.Text>
                <iframe
                  width="100%"
                  height="300"
                  src={video.videoURL}
                  frameborder="0"
                  allowfullscreen
                  allow="autoplay; encrypted-media"
                />
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{video.uploadedAt}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Videos;