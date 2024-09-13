import { BrowserRouter, Routes, Route } from "react-router-dom";
import LP from "Pages/LP/page.tsx";
import Sessions from "Pages/Sessions/page.tsx";
import ContainerFicha from "Pages/Ficha/container_page.tsx";
import SessaoAovivo from "Pages/SessaoAovivo/page.tsx"
import Login from "Pages/Login/page.tsx";
import Teste from "Pages/Teste/page.tsx";
import TooltipManager from 'Components/SubComponents/Tooltip/page.tsx';

import LayoutLP from "Layouts/LayoutLP/layout.tsx";
import LayoutInterno from "Layouts/LayoutInterno/layout.tsx";

import LayoutInterno2 from "Layouts/LayoutInterno2/layout.tsx";
import FichaDemo from "Pages/FichaDemo/container_page.tsx";
import PageTracker from "Components/PageTracker/page_tracker.tsx";

const App = () => {
  return (
    <div className='app-container'>
      <TooltipManager />

      <BrowserRouter>
        {/* <PageTracker /> */}
        <Routes>
          <Route element={<LayoutLP />}>
            <Route path="/" element={<LP />} />
            {/* <Route path="/login" element={<Login />} /> */}
          </Route>

          <Route element={<LayoutInterno />}>
            {/* <Route path="/sessions">
              <Route index element={<Sessions />} />
              <Route path=":sessionId" element={<Sessions />} />
            </Route> */}
            {/* <Route path="/ficha">
              <Route index element={<ContainerFicha />} />
              <Route path=":characterId" element={<ContainerFicha />} />
            </Route> */}
            {/* 
            <Route path="/sessao-aovivo">
              <Route index element={<SessaoAovivo />} />
            </Route>
            <Route path="/testea">
              <Route index element={<Teste />} />
            </Route> */}
          </Route>

          <Route element={<LayoutInterno2 />}>
            <Route path="/ficha-demo">
              <Route index element={<FichaDemo />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;