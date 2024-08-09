import { BrowserRouter, Routes, Route } from "react-router-dom";
import LP from "Pages/LP/page.tsx";
import Sessions from "Pages/Sessions/page.tsx";
import Ficha from "Pages/Ficha/page.tsx";
import SessaoAovivo from "Pages/SessaoAovivo/page.tsx"
import Login from "Pages/Login/page.tsx";

import LayoutLP from "Layouts/LayoutLP/layout.tsx";
import LayoutInterno from "Layouts/LayoutInterno/layout.tsx";

const App = () => {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutLP />}>
            <Route path="/" element={<LP />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<LayoutInterno />}>
            <Route path="/sessions">
              <Route index element={<Sessions />} />
              <Route path=":sessionId" element={<Sessions />} />
            </Route>
            <Route path="/ficha">
              <Route index element={<Ficha />} />
              <Route path=":characterId" element={<Ficha />} />
            </Route>
            <Route path="/sessao-aovivo">
            <Route index element={<SessaoAovivo />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;