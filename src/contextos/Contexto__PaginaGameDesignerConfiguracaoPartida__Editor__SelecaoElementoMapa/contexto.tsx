'use client';

import { useMemo } from 'react';

import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';
import { elementosDoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import { ehObjeto } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa';

// Subfluxo Adicionar Objeto DO MAPA: lista os elementos autorados no Editor 3D (cena do Projeto MAPA selecionado) que ainda
// não viraram interagível; escolher um cria o objeto com posição/dimensões DERIVADAS do bbox e abre a config dele.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa__Provider = () => {
    const { config, adicionaObjetoDoMapa, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const { projetoMapa, carregandoMapa } = useProjetoMapa(config.cenario.mapaLogico.idProjetoMapa ?? null);

    const elementosDisponiveis = useMemo(() => {
        if (!projetoMapa) return [];
        const idsJaUsados = new Set(config.interagiveis.filter(ehObjeto).map(objeto => objeto.idElementoMapa).filter((id): id is string => id != null));
        return elementosDoMapa(projetoMapa.cenaCanonica).filter(elemento => !idsJaUsados.has(elemento.idLocal));
    }, [projetoMapa, config.interagiveis]);

    return <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa elementos={elementosDisponiveis} carregando={carregandoMapa} aoConfirmar={adicionaObjetoDoMapa} aoCancelar={voltarParaFormulario} />;
};
