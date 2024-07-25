import "./style.css";
import Section from "Components/Sections/Section/page.tsx";
import SectionCarroussel from "Components/Sections/SectionCarroussel/page.tsx";

interface LandingpageTextSection {
    strings: String[];
    classType: string;
  }

const LPBody = () => {
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
        <Section sections={section1content} />
        <hr />
        <SectionCarroussel />
      </div>
    )
}

export default LPBody;