import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import quizzz from "../../Assets/Projects/quizzz.jpeg";
import todoss from "../../Assets/Projects/todoss.jpeg";
import weatherr from "../../Assets/Projects/weatherr.jpeg";
import restruantapp from "../../Assets/Projects/restruantapp.jpeg";
import portfoliofor from "../../Assets/Projects/portfoliofor.PNG"
import blogweb from "../../Assets/Projects/blogweb.PNG"
import jamsfrag from "../../Assets/Projects/jamsfrag.PNG"


function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently. <p style={{ color: "red" }}>Todo app Demo links is
            not working. Sorry for that i will fixed it as soon as
            possible.Thanks.</p>
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={jamsfrag1}
              isBlog={false}
              title="Jams Fragrences"
              description="JamsFragrances is a sleek, responsive e-commerce website designed for showcasing and selling premium perfumes. Built with React.js and powered by Firebase for real-time data handling and authentication, the platform offers a smooth and secure shopping experience. Users can explore a wide range of fragrances, add products to their cart, create accounts, and complete purchases seamlessly."
              ghLink="https://github.com/Jamsheed-Khan/jamsfragrances"
              demoLink="https://jamsfragrances.vercel.app"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={blogweb}
              isBlog={false}
              title="Blogging website"
              description="
Blogging Website is a modern React-based platform for sharing and exploring creative content. It allows users to write, edit, and publish blogs with images, leveraging Firebase for real-time functionality. The site features a responsive design, vibrant UI, and seamless user experience for bloggers and readers."
              demoLink="https://blogging-website-brown.vercel.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={quizzz}
              isBlog={false}
              title="Quiz App"
              description="Quiz app is very helpful for schools and students. It helps them to develop their skills and knowledge through quizzes. This app provides a way for students to take exams, improve their abilities and skills."
              ghLink="https://jamsheed-khan.github.io/Quiz-App/"
              demoLink="https://github.com/Jamsheed-Khan/Quiz-App"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={portfoliofor}
              isBlog={false}
              title="Masjidtayyaba website"
              description="Shaha Islamic Center is a React-based web application designed to provide accurate and timely prayer schedules for Muslims. It features a user-friendly interface, dynamic prayer time updates, and a responsive design for all devices. The platform also includes themed aesthetics inspired by Islamic culture."
              ghLink="https://github.com/Jamsheed-Khan/Shaha-Iskamic-Centre"
              demoLink="https://jamiamasjidtayyaba.vercel.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={restruantapp}
              isBlog={false}
              title="Restraunt Website"
              description="This is my Restraunt website, created using HTML, CSS, JavaScript, Tailwind CSS, and Firebase."
              ghLink="https://github.com/Jamsheed-Khan/Restruant-app-in-js"
              demoLink="https://jams-restruant-app.vercel.app"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={weatherr}
              isBlog={false}
              title="Weather App"
              description="This is a weather app. It has a responsive layout which looks beautifully on all devices, from mobiles to desktops."
              ghLink="https://github.com/Jamsheed-Khan/Weather-App"
              demoLink="https://jamsheed-khan.github.io/Weather-App/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={todoss}
              isBlog={false}
              title="ToDo App "
              description="This is a TodoApp in which you can add your daily tasks and works you have to do with crud opration ."
              ghLink="https://github.com/Jamsheed-Khan/Get-your-todo"
              demoLink="get-your-todo.vercel.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
