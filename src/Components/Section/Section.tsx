//import React from 'react';
import "./Section.css";
import img1 from "../Assets/img1.svg";
/*import img2 from "../Assets/img2.svg";*/

interface LandingpageTextSectionProps {
  sections: LandingpageTextSection[];
}

interface LandingpageTextSection {
  strings: String[];
  htmlType: React.ElementType<any>;
}

const Section = ({ sections }: LandingpageTextSectionProps) => {
  return (
    <div className='section'>
      {sections.map((textSection, textSectionIndex) => (
        <div key={textSectionIndex} className="section-content">
          {textSection.strings.map((string, indexString) => (
            <textSection.htmlType key={`${textSectionIndex}-${indexString}`}>{string}</textSection.htmlType>
          ))}
        </div>
      ))}

      <div className='section-content'>
        <img className='img1' src={img1} alt="" />
      </div>
    </div>
  );
};

export default Section;
