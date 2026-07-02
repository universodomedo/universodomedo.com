'use client';

import { createContext, useContext } from 'react';
import type { GrupoTipoDesafio } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerDesafios__Props } from '../Contexto__PaginaGameDesignerDesafios/contexto';
import SPA__PaginaGameDesignerDesafios__DesafiosDoTipo from 'Conteineres/PaginaGameDesignerDesafios/paginas/SPA__PaginaGameDesignerDesafios__DesafiosDoTipo/SPA__PaginaGameDesignerDesafios__DesafiosDoTipo';

interface Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props {
    grupo: GrupoTipoDesafio;
    salvando: boolean;
    voltaParaTipos: Contexto__PaginaGameDesignerDesafios__Props['voltaParaTipos'];
    alternarAtivoDesafio: Contexto__PaginaGameDesignerDesafios__Props['alternarAtivoDesafio'];
};

type PropsProvider = {
    grupo: GrupoTipoDesafio;
    salvando: boolean;
    voltaParaTipos: Contexto__PaginaGameDesignerDesafios__Props['voltaParaTipos'];
    alternarAtivoDesafio: Contexto__PaginaGameDesignerDesafios__Props['alternarAtivoDesafio'];
};

const Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo = createContext<Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo = (): Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Props => {
    const context = useContext(Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo);
    if (!context) throw new Error('useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo precisa estar dentro de um Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo');
    return context;
};

export const Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Provider = ({ grupo, salvando, voltaParaTipos, alternarAtivoDesafio }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: `${grupo.rotulo}`, fecharProps: { tipo: 'acao', executar: voltaParaTipos, tituloTooltip: 'Voltar para os tipos' } });

    return (
        <Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo.Provider value={{ grupo, salvando, voltaParaTipos, alternarAtivoDesafio }}>
            <SPA__PaginaGameDesignerDesafios__DesafiosDoTipo />
        </Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo.Provider>
    );
};