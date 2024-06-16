import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import quizzz from "../../Assets/Projects/quizzz.jpeg";
import todoss from "../../Assets/Projects/todoss.jpeg";
import weatherr from "../../Assets/Projects/weatherr.jpeg";
import restruantapp from "../../Assets/Projects/restruantapp.jpeg";


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
              imgPath={quizzz}
              isBlog={false}
              title="Quiz App"
              description="Quiz app is very helpful for schools and students. It helps them to develop their skills and knowledge through quizzes. This app provides a way for students to take exams, improve their abilities and skills."
              ghLink="https://github.com/Jamsheed-Khan/Quiz-App"
              demoLink="https://jamsheed-khan.github.io/Quiz-App/"
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
