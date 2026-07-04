'use client';

import { useState } from 'react';

import { toast } from 'Hooks/useToast';
import { rotuloSer } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala';

// Subfluxo Configuração do Ser em sala: edita o Ser selecionado (Nome em jogo + Posição, e Percepção inicial p/ não-controlável) na sua própria vista.
// Genérico para controláveis e não-controláveis (grupoEmFoco). Buffer local → Salvar commita no config e volta; "voltar" é a navegação (fecharProps), dono no Controlador de Fluxo.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider = () => {
    const { config, nomesPorIdSer, grupoEmFoco, serEmEdicaoKey, atualizaSerEmSala, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const ser = config[grupoEmFoco].find(serAtual => serAtual.key === serEmEdicaoKey) ?? null;

    const [nomeExibicao, setNomeExibicao] = useState<string>(ser?.nomeExibicao ?? '');
    const [posicao, setPosicao] = useState<{ x: number; y: number }>(ser?.posicaoInicial ?? { x: 0, y: 0 });
    const [percepcaoInicial, setPercepcaoInicial] = useState<'DESPERCEBIDO' | 'PERCEBIDO'>(ser?.percepcaoInicial ?? 'DESPERCEBIDO');

    if (!ser) return null;
    const ativo = ser;
    const ehNaoControlavel = grupoEmFoco === 'naoControlaveis';

    const mapaLogico = config.cenario.mapaLogico;
    // Rótulo do marcador ativo: Nome do Ser + nome em jogo (buffer ao vivo), nunca id.
    const nomeSerAtivo = nomesPorIdSer[ativo.referencia.id];
    const nomeEmJogoAtivo = nomeExibicao.trim().length > 0 ? nomeExibicao.trim() : null;
    const rotuloAtivo = nomeSerAtivo && nomeEmJogoAtivo ? `${nomeSerAtivo} (${nomeEmJogoAtivo})` : (nomeSerAtivo ?? nomeEmJogoAtivo ?? 'Ser');
    const marcadoresContexto = [...config.controlaveis, ...config.naoControlaveis]
        .filter(serAtual => serAtual.key !== ativo.key && serAtual.posicaoInicial !== undefined)
        .map(serAtual => ({ key: serAtual.key, posicao: { x: serAtual.posicaoInicial?.x ?? 0, y: serAtual.posicaoInicial?.y ?? 0 }, rotulo: rotuloSer(serAtual, nomesPorIdSer) }));

    function salvar(): void {
        atualizaSerEmSala(grupoEmFoco, ativo.key, ehNaoControlavel
            ? { nomeExibicao: nomeExibicao.trim().length > 0 ? nomeExibicao : undefined, posicaoInicial: posicao, percepcaoInicial }
            : { nomeExibicao: nomeExibicao.trim().length > 0 ? nomeExibicao : undefined, posicaoInicial: posicao });
        void toast.sucesso(ehNaoControlavel ? 'Não-controlável salvo' : 'Controlável salvo');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala
            nomeExibicao={nomeExibicao}
            aoMudarNomeExibicao={setNomeExibicao}
            posicao={posicao}
            aoMudarPosicao={setPosicao}
            percepcaoInicial={ehNaoControlavel ? percepcaoInicial : null}
            aoMudarPercepcao={setPercepcaoInicial}
            larguraMetros={mapaLogico.larguraMetros}
            alturaMetros={mapaLogico.alturaMetros}
            rotuloAtivo={rotuloAtivo}
            marcadoresContexto={marcadoresContexto}
            salvar={salvar}
        />
    );
};
