'use client';

import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';
import { useContexto__PaginaAdminGestaoNavegacao__EdicaoMusica } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica/contexto';

export default function SPA__PaginaAdminGestaoNavegacao__EdicaoMusica() {
    const { idMusicaAtual, salvarMusica } = useContexto__PaginaAdminGestaoNavegacao__EdicaoMusica();

    return (
        <Componente_Selecionador__MusicaDeFundo idInicial={idMusicaAtual} aoConfirmar={idMusica => salvarMusica(idMusica)} />
    );
};