'use client';

import { useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { toast } from 'Hooks/useToast';
import { rotuloInteragivel, type Descoberta } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala';

// Subfluxo Configuração do Ser: edita o Ser (Nome em jogo, Percepção inicial, Posição) + as Descobertas que MORAM nele.
// O controlador (jogador/sistema) é definido na criação, não aqui. Buffer local → Aplicar commita no RASCUNHO do config e volta
// (persistir é o "Salvar Configuração" do formulário — por isso o vocabulário aqui nunca é "salvar").
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider = () => {
    const { config, nomesPorIdSer, chaveEmEdicao, atualizaSer, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const interagivel = config.interagiveis.find(interagivelAtual => interagivelAtual.chave === chaveEmEdicao) ?? null;
    const ser = interagivel !== null && interagivel.tipo === 'ser' ? interagivel : null;

    const [nome, setNome] = useState<string>(ser?.nome ?? '');
    const [posicao, setPosicao] = useState<{ x: number; y: number }>(ser?.posicao ?? { x: 0, y: 0 });
    const [percepcaoInicial, setPercepcaoInicial] = useState<'DESPERCEBIDO' | 'PERCEBIDO'>(ser?.estadoPercepcaoInicial ?? 'DESPERCEBIDO');
    const [descobertas, setDescobertas] = useState<readonly Descoberta[]>(ser?.descobertas ?? []);

    const capacidades = useCapacidadesInatas();

    if (!ser) return null;
    const ativo = ser;

    const mapaLogico = config.cenario.mapaLogico;
    // Rótulo do marcador ativo: Nome do Ser + nome em jogo (buffer ao vivo), nunca id.
    const nomeSerAtivo = nomesPorIdSer[ativo.idSer];
    const nomeEmJogoAtivo = nome.trim().length > 0 ? nome.trim() : null;
    const rotuloAtivo = nomeSerAtivo && nomeEmJogoAtivo ? `${nomeSerAtivo} (${nomeEmJogoAtivo})` : (nomeSerAtivo ?? nomeEmJogoAtivo ?? 'Ser');
    const marcadoresContexto = config.interagiveis
        .filter(interagivelAtual => interagivelAtual.chave !== ativo.chave)
        .map(interagivelAtual => ({ key: interagivelAtual.chave, posicao: { x: interagivelAtual.posicao?.x ?? 0, y: interagivelAtual.posicao?.y ?? 0 }, rotulo: rotuloInteragivel(interagivelAtual, nomesPorIdSer) }));
    const opcoesCapacidades = capacidades.registros.map(capacidade => ({ value: String(capacidade.id), label: `${capacidade.nome} (${capacidade.nomeInteracao})` }));
    const opcoesInteragiveis = config.interagiveis.filter(interagivelAtual => interagivelAtual.chave !== ativo.chave).map(interagivelAtual => ({ value: interagivelAtual.chave, label: rotuloInteragivel(interagivelAtual, nomesPorIdSer) }));

    function aplicar(): void {
        atualizaSer(ativo.chave, { nome, posicao, estadoPercepcaoInicial: percepcaoInicial, descobertas });
        void toast.sucesso('Ser aplicado à configuração', 'Persiste ao Salvar Configuração.');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala
            nome={nome}
            aoMudarNome={setNome}
            posicao={posicao}
            aoMudarPosicao={setPosicao}
            percepcaoInicial={percepcaoInicial}
            aoMudarPercepcao={setPercepcaoInicial}
            larguraMilimetros={mapaLogico.larguraMilimetros}
            alturaMilimetros={mapaLogico.alturaMilimetros}
            idProjetoMapa={mapaLogico.idProjetoMapa ?? null}
            rotuloAtivo={rotuloAtivo}
            marcadoresContexto={marcadoresContexto}
            descobertas={descobertas}
            aoMudarDescobertas={setDescobertas}
            opcoesCapacidades={opcoesCapacidades}
            opcoesInteragiveis={opcoesInteragiveis}
            aplicar={aplicar}
        />
    );
};

function useCapacidadesInatas() {
    return useNoraGraphQLListagem('CapacidadeInata', {
        select: ['id', 'nome', 'nomeInteracao'],
        itensPorPagina: 100,
        carregando: 'Buscando Capacidades Inatas',
        mensagemErro: 'Houve um erro recuperando as Capacidades Inatas',
        mensagemListaVazia: 'Nenhuma capacidade inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade inata encontrada com os filtros atuais.',
        carregamento: 'BARRA',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
