'use client';

import { Contexto__PaginaModeradorCapacidadesFuncionais__Provider } from 'Contextos/Contexto__PaginaModeradorCapacidadesFuncionais/contexto';
import SPA__PaginaModeradorCapacidadesFuncionais from './paginas/SPA__PaginaModeradorCapacidadesFuncionais/SPA__PaginaModeradorCapacidadesFuncionais';

export default function Conteiner__PaginaModeradorCapacidadesFuncionais() {
    return (
        <Contexto__PaginaModeradorCapacidadesFuncionais__Provider>
            <SPA__PaginaModeradorCapacidadesFuncionais />
        </Contexto__PaginaModeradorCapacidadesFuncionais__Provider>
    );
};
