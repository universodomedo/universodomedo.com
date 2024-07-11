// import React from 'react'
import Section from "../Sections/Section/Section.tsx";
import SectionCarroussel from "../Sections/SectionCarroussel/SectionCarroussel.tsx";
import "./Body.css";

interface LandingpageTextSection {
    strings: String[];
    classType: string;
  }

const Body = () => {
    const section1content:LandingpageTextSection[] = [
        {
          strings: ["Descubra o","Paranormal"],
          classType: "title"
        },
        {
          strings: ["Faça parte da guerra entre a Humanidade e o Paranormal", "Enfrente seus demônios internos e desvende os Segredos da Realidade"],
          classType: "paragraph"
        }
    ];

    return (
      <div className="sections">
        <SectionCarroussel />
        <Section sections={section1content} />
      </div>
    )
}

export default Body;