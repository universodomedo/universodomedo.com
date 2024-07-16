import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandPage from "Pages/LandPage/page.tsx";
import Sessions from "Pages/Sessions/page.tsx";
import Ficha from "Pages/Ficha/page.tsx";

const Layout1 = () => {
  return (
    <main className="main-layout1">
      <Outlet />
    </main>
  );
};

const Layout2 = () => {
  return (
    <>
      <aside></aside>
      <main className="main-layout2">
        <Outlet />
      </main>
      <aside></aside>
    </>
  );
};

const App = () => {
  return (
    <div className='app-container'>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Layout1 />}>
            <Route index element={<LandPage />} />
          </Route>

          <Route element={<Layout2 />}>
            <Route path="/session:sessionId" element={<Sessions />} />
            <Route path="/ficha:characterId" element={<Ficha />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App;