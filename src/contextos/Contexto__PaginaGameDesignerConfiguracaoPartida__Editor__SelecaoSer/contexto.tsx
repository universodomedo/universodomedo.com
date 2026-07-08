'use client';

import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer';

// Subfluxo Seleção de Ser: escolhe o Ser do novo controlável na SUA PRÓPRIA vista.
// O subtítulo e o "voltar" (fecharProps) são donos do Controlador de Fluxo (Editor), que os aplica por subVista — este subfluxo só apresenta o selecionador.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer__Provider = () => {
    const { grupoEmFoco, adicionaSer, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();

    return <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer aoConfirmar={idSer => { adicionaSer(grupoEmFoco, idSer); voltarParaFormulario(); }} />;
};
