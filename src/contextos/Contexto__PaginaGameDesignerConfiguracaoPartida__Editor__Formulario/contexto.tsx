'use client';

import SPA__PaginaGameDesignerConfiguracaoPartida__Editor from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/SPA__PaginaGameDesignerConfiguracaoPartida__Editor';

// Subfluxo Formulário: a vista principal do Runtime (o form). O config, os helpers de edição e o mapa de nomes dos Seres vêm do Controlador
// de Fluxo (contexto do Editor) que o SPA consome; as grades disparam ações de fluxo e cada config (Ser / objeto / descoberta) roda em sua própria vista.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario__Provider = () => {
    return <SPA__PaginaGameDesignerConfiguracaoPartida__Editor />;
};
