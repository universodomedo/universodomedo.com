//import React from 'react';
import Header from './Components/Header/Header.tsx';
import Section from './Components/Section/Section.tsx';
import Footer from './Components/Footer/Footer.tsx';

interface LandingpageTextSection {
  strings: String[];
  htmlType: React.ElementType<any>;
}


const App = () => {
  const section1content:LandingpageTextSection[] = [
    {
      strings: ["Descubra o","Paranormal"],
      htmlType: "h1"
    },
    {
      strings: ["Faça parte da guerra entre a Humanidade e o Paranormal","Enfrente seus demônios internos e desvende os Segredos da Realidade"],
      htmlType: "h2"
    }
  ];

  return (
    <div className='app-container'>
      <Header />
      <Section sections={section1content} />
      <Footer />
    </div>
  )
}

export default App;
