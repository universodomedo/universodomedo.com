// #region Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LP from "Pages/LP/page.tsx";
import Sessions from "Pages/Sessions/page.tsx";
import SessaoAovivo from "Pages/SessaoAovivo/page.tsx"
import Login from "Pages/Login/page.tsx";
import Teste from "Pages/Teste/page.tsx";
import TooltipManager from 'Components/SubComponents/Tooltip/page.tsx';

import LayoutLP from "Layouts/LayoutLP/layout.tsx";
import LayoutInterno from "Layouts/LayoutInterno/layout.tsx";

import LayoutInterno2 from "Layouts/LayoutInterno2/layout.tsx";
import Ficha from 'Pages/Ficha/page.tsx';
import FichaTutorial from 'Pages/FichaTutorial/page.tsx';
import EditaFicha from 'Pages/EditaFicha/page.tsx';
import PageTracker from "Components/PageTracker/page_tracker.tsx";
import TooltipContainer from "Components/SubComponents/Tooltip/TooltipContainer.tsx";

import PaginaInternaTeste from 'Pages/PaginaInternaTeste/page.tsx';

import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
// import { SalaProvider } from "Providers/SalaProvider.tsx";
// #endregion

const App = () => {
  return (
    <div className='app-container'>
      {/* <TooltipManager /> */}

      <TooltipContainer />

      <BrowserRouter>
        {/* <PageTracker /> */}
        <Routes>
          <Route element={<LayoutLP />}>
            <Route path="/" element={<LP />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* <Route element={<LayoutInterno />}> */}
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
          {/* </Route> */}

          {/* <Route element={<AuthOutlet fallbackPath="/login" />}>
            <Route element={<LayoutInterno />}>
              <Route path="/pagina-interna">
                <SalaProvider>
                  <Route index element={<PaginaInternaTeste />} />
                </SalaProvider>
              </Route>
            </Route>
          </Route> */}
          
          <Route element={<AuthOutlet fallbackPath="/login" />}>
            <Route element={<LayoutInterno />}>
              <Route path="/pagina-interna" element={
                // <SalaProvider>
                  <PaginaInternaTeste />
                // </SalaProvider>
              } />
            </Route>
          </Route>

          <Route element={<LayoutInterno2 />}>
            <Route path="/ficha-demo">
              <Route index element={<Ficha />} />
            </Route>
            <Route path="/edita-ficha">
              <Route index element={<EditaFicha />} />
            </Route>
            <Route path="/tutorial-ficha">
              <Route index element={<FichaTutorial />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>

      {/* <TooltipContainer /> */}
    </div>
  );
};

export default App;