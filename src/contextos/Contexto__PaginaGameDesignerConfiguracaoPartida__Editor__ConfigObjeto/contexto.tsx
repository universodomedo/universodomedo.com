'use client';

import { useState } from 'react';

import { toast } from 'Hooks/useToast';
import { rotuloObjeto, rotuloSer } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto';

// Subfluxo Configuração do Objeto: edita o objeto selecionado (Nome, Descrição, Durabilidade, Percepção, Posição) na sua própria vista.
// Buffer local → Salvar commita no config e volta; "voltar" é a navegação (fecharProps), dono no Controlador de Fluxo.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider = () => {
    const { config, nomesPorIdSer, objetoEmEdicaoKey, atualizaObjeto, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const objeto = config.interagiveis.find(objetoAtual => objetoAtual.key === objetoEmEdicaoKey) ?? null;

    const [nome, setNome] = useState<string>(objeto?.nome ?? '');
    const [descricao, setDescricao] = useState<string>(objeto?.descricao ?? '');
    const [durabilidadeMaxima, setDurabilidadeMaxima] = useState<number>(objeto?.durabilidadeMaxima ?? 1);
    const [percepcaoInicial, setPercepcaoInicial] = useState<'DESPERCEBIDO' | 'PERCEBIDO'>(objeto?.estadoPercepcaoInicial ?? 'PERCEBIDO');
    const [posicao, setPosicao] = useState<{ x: number; y: number }>(objeto?.posicao ?? { x: 0, y: 0 });

    if (!objeto) return null;
    const ativo = objeto;

    const mapaLogico = config.cenario.mapaLogico;
    const rotuloAtivo = nome.trim().length > 0 ? nome : 'Objeto';
    const marcadoresContexto = [
        ...config.controlaveis.map(ser => ({ key: ser.key, posicao: { x: ser.posicaoInicial?.x ?? 0, y: ser.posicaoInicial?.y ?? 0 }, rotulo: rotuloSer(ser, nomesPorIdSer) })),
        ...config.naoControlaveis.map(ser => ({ key: ser.key, posicao: { x: ser.posicaoInicial?.x ?? 0, y: ser.posicaoInicial?.y ?? 0 }, rotulo: rotuloSer(ser, nomesPorIdSer) })),
        ...config.interagiveis.filter(objetoAtual => objetoAtual.key !== ativo.key).map(objetoAtual => ({ key: objetoAtual.key, posicao: { x: objetoAtual.posicao?.x ?? 0, y: objetoAtual.posicao?.y ?? 0 }, rotulo: rotuloObjeto(objetoAtual) })),
    ];

    function salvar(): void {
        atualizaObjeto(ativo.key, { nome, descricao, durabilidadeMaxima, estadoPercepcaoInicial: percepcaoInicial, posicao });
        void toast.sucesso('Objeto salvo');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto
            nome={nome}
            aoMudarNome={setNome}
            descricao={descricao}
            aoMudarDescricao={setDescricao}
            durabilidadeMaxima={durabilidadeMaxima}
            aoMudarDurabilidade={setDurabilidadeMaxima}
            percepcaoInicial={percepcaoInicial}
            aoMudarPercepcao={setPercepcaoInicial}
            posicao={posicao}
            aoMudarPosicao={setPosicao}
            larguraMetros={mapaLogico.larguraMetros}
            alturaMetros={mapaLogico.alturaMetros}
            rotuloAtivo={rotuloAtivo}
            marcadoresContexto={marcadoresContexto}
            salvar={salvar}
        />
    );
};
