'use client';

import { Componente_Selecionador__Ser } from 'Componentes/Selecionadores/Componente_Selecionador__Ser/Componente_Selecionador__Ser';

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer({ aoConfirmar }: { aoConfirmar: (idSer: number) => void; }) {
    return <Componente_Selecionador__Ser aoConfirmar={idSer => aoConfirmar(idSer)} />;
};
