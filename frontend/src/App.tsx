// #region Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaAterrissagem from 'Paginas/Aterrissagem/pagina.tsx';
import FichaDemonstracao from 'Paginas/Demonstracao/pagina.tsx';
// import Sessions from "Pages/Sessions/page.tsx";
// import SessaoAovivo from "Pages/SessaoAovivo/page.tsx"
// import Login from "Pages/Login/page.tsx";

import LayoutDeslogado from "Layouts/Deslogado/layout";
import LayoutDemonstracao from "Layouts/Demonstracao/layout";
// import LayoutInterno from "Layouts/LayoutInterno/layout.tsx";

// import LayoutInterno2 from "Layouts/LayoutInterno2/layout.tsx";
// import LayoutEmJogo from "Layouts/LayoutEmJogo/layout.tsx";
// import Ficha from 'Pages/Ficha/page.tsx';
// import FichaTutorial from 'Pages/FichaTutorial/page.tsx';
// import EditaFicha from 'Pages/EditaFicha/page.tsx';
// import PageTracker from "Components/PageTracker/page_tracker.tsx";

// import PaginaInternaTeste from 'Pages/PaginaInternaTeste/page.tsx';
// import Shop from 'Pages/Shop/page.tsx';

import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
// import { SalaProvider } from "Providers/SalaProvider.tsx";
// #endregion

const App = () => {
    return (
        <RadixTooltip delayDuration={200} skipDelayDuration={0}>
            <BrowserRouter>
                {/* <PageTracker /> */}
                <Routes>
                    <Route element={<LayoutDeslogado />}>
                        <Route path="/" element={<PaginaAterrissagem />} />
                        {/* <Route path="/login" element={<Login />} /> */}
                    </Route>
                    <Route element={<LayoutDemonstracao />}>
                        <Route path="/ficha-demonstracao" element={<FichaDemonstracao />} />
                    </Route>
                    {/* <Route element={<LayoutEmJogo />} >
                        <Route path="/ficha">
                            <Route index element={<Ficha />} />
                        </Route>
                    </Route> */}
                </Routes>
            </BrowserRouter>
        </RadixTooltip>
    );
};

export default App;