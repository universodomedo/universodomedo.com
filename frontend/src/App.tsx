// #region Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PaginaAterrissagem from 'Paginas/Aterrissagem/pagina.tsx';
import FichaDemonstracao from 'Paginas/Demonstracao/pagina.tsx';

import LayoutDeslogado from "Layouts/Deslogado/layout";
import LayoutDemonstracao from "Layouts/Demonstracao/layout";

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