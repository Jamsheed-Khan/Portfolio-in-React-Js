import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Deep Learning Engineer",
          "MERN Stack Developer",
          "Mobile Application Developer",
          "Front-end Developer",
          "Video Editor",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
