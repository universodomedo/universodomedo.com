'use client';

import { useContextoPaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';
import { PAGINA_PERSONAGEM, TIPO_PAGINA_PERSONAGEM } from '../types';

import PaginaEditavel_Inicial from './editavel/inicial';
import PaginaEditavel_Evoluir from './editavel/evoluir';
import PaginaVisualizacao_Evoluir from './visualizacao/inicial';

export default function PaginaIntelingentePersonagem() {
    const { tipoPaginaPersonagem, paginaPersonagemAtual } = useContextoPaginaPersonagem();

    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.EDITAVEL && paginaPersonagemAtual === PAGINA_PERSONAGEM.INICIAL) return <PaginaEditavel_Inicial />
    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.EDITAVEL && paginaPersonagemAtual === PAGINA_PERSONAGEM.EVOLUIR) return <PaginaEditavel_Evoluir />
    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.VISUALIZACAO && paginaPersonagemAtual === PAGINA_PERSONAGEM.INICIAL) return <PaginaVisualizacao_Evoluir />
};