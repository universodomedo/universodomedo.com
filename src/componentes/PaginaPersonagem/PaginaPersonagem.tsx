'use client';

import { ContextoPaginaPersonagemProvider } from 'Contextos/ContextoPaginaPersonagem/contexto';
import PaginaIntelingentePersonagem from './paginas/page';

export default function PaginaPersonagem() {
    return (
        <ContextoPaginaPersonagemProvider>
            <PaginaIntelingentePersonagem />
        </ContextoPaginaPersonagemProvider>
    );
};