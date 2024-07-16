import { BrowserRouter, Routes, Route } from "react-router-dom";
import LP from "Pages/LP/page.tsx";
import Sessions from "Pages/Sessions/page.tsx";
import Ficha from "Pages/Ficha/page.tsx";
import LayoutLP from "Layouts/LayoutLP/layout.tsx";
import LayoutInterno from "Layouts/LayoutInterno/layout.tsx";

const App = () => {
  return (
    <div className='app-container'>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<LayoutLP />}>
            <Route index element={<LP />} />
          </Route>

          <Route element={<LayoutInterno />}>
            <Route path="/session:sessionId" element={<Sessions />} />
            <Route path="/ficha:characterId" element={<Ficha />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App;