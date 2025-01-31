// #region Imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PaginaJogador from 'Paginas/PaginaJogador/pagina.tsx';
import PaginaAterrissagem from 'Paginas/Aterrissagem/pagina.tsx';
import Login from 'Paginas/Login/pagina.tsx';
import FichaDemonstracao from 'Paginas/Ficha/paginaFichaDemonstracao.tsx';
import FichaPersonagem from 'Paginas/Ficha/paginaFichaPersonagem.tsx';

import LayoutDeslogado from "Layouts/Deslogado/layout.tsx";
import LayoutLogado from "Layouts/Logado/layout.tsx";
import LayoutEmJogo from "Layouts/EmJogo/layout";

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
                    <Route element={<AuthOutlet fallbackPath="/inicio" />}>
                        <Route element={<LayoutLogado />}>
                            <Route path="/" element={<PaginaJogador />} />
                        </Route>
                    </Route>

                    <Route element={<LayoutDeslogado />}>
                        <Route path="/inicio" element={<PaginaAterrissagem />} />
                        <Route path="/login" element={<Login />} />
                    </Route>

                    <Route element={<LayoutEmJogo />} >
                        <Route path="/ficha">
                            <Route index element={<FichaPersonagem />} />
                        </Route>
                        <Route path="/ficha-demonstracao">
                            <Route index element={<FichaDemonstracao />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </RadixTooltip>
    );
};

export default App;