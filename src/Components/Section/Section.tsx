//import React from 'react';
import "./Section.css";
import img1 from "../Assets/img1.svg";
/*import img2 from "../Assets/img2.svg";*/

const Section = () => {
  return (
    <div className='section'>
      <div className='section-content'>
        <h1 className='section-title'>Descubra o</h1>
        <h1 className='section-title'>Paranormal</h1>
      </div>
      <div className='section-content'>
        <h2 className='section-title'>Faça parte da guerra entre a Humanidade e o Paranormal</h2>
        <h2 className='section-title'>Enfrente seus demônios internos e desvende os Segredos da Realidade</h2>
      </div>

      <div className='section-content'>
        <img className='img1' src={img1} alt="" />
        {/* <img className='img2' src={img2} alt="" /> */}
      </div>
    </div>
  )
}

export default Section;
