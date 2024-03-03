import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">jamsheed khan </span>
            from <span className="purple"> Gilgit Baltistan.</span>
            <br />I am a React Js developer and student at SMIT Karachi.
            <br />
            <br />
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Traveling
            </li>
            <li className="about-activity">
              <ImPointRight /> Cricket 
            </li>
            <li className="about-activity">
              <ImPointRight /> Exploring world
            </li>
            <li className="about-activity">
              <ImPointRight /> Videography
            </li>
          </ul>

         
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
