import "./Section.css";
import img1 from "../../Assets/img1.svg";

interface LandingpageTextSectionProps {
  sections: LandingpageTextSection[];
}

interface LandingpageTextSection {
  strings: String[];
  classType: string;
}

const Section = ({ sections }: LandingpageTextSectionProps) => {
  return (
    <div className='section'>
      {sections.map((textSection, textSectionIndex) => (
        <div key={textSectionIndex} className={textSection.classType}>
          {textSection.strings.map((string, indexString) => (
            <p key={`${textSectionIndex}-${indexString}`}>{string}</p>
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