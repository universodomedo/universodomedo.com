'use client';

import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa';

// Subfluxo Seleção de Mapa: escolhe o Projeto 3D (tipo MAPA) que É o cenário da Partida, na SUA PRÓPRIA vista.
// O subtítulo e o "voltar" (fecharProps) são donos do Controlador de Fluxo (Editor) — este subfluxo só apresenta o selecionador.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa__Provider = () => {
    const { config, selecionaMapa, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();

    return <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa idInicial={config.cenario.mapaLogico.idProjetoMapa ?? null} aoConfirmar={selecionaMapa} aoCancelar={voltarParaFormulario} />;
};
