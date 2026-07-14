'use client';

import type { Projeto3DMinimoPersistido } from 'types-nora-api';

import { Componente_Selecionador__Mapa } from 'Componentes/Selecionadores/Componente_Selecionador__Mapa/Componente_Selecionador__Mapa';

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa({ idInicial, aoConfirmar, aoCancelar }: { idInicial: number | null; aoConfirmar: (projeto: Projeto3DMinimoPersistido) => void; aoCancelar: () => void; }) {
    return <Componente_Selecionador__Mapa idInicial={idInicial} aoConfirmar={aoConfirmar} aoCancelar={aoCancelar} />;
};
