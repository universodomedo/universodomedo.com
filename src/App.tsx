//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header.tsx';
import Body from './Components/Body/Body.tsx';
import Footer from './Components/Footer/Footer.tsx';
import Sessions from "./Components/Pages/Sessions/Sessions.tsx";

const App = () => {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/session" element={<Sessions />}>
            <Route path=":sessionId" element={<Sessions />}/>
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App;
