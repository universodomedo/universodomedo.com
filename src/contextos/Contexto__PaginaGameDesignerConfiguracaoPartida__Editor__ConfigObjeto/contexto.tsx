'use client';

import { useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { toast } from 'Hooks/useToast';
import { rotuloInteragivel, type Descoberta } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto';

// Subfluxo Configuração do Objeto: edita o objeto (Nome, Descrição, Pontos de Durabilidade, Percepção, Posição) + as Descobertas que MORAM nele.
// Buffer local → Salvar commita no config e volta; "voltar" é a navegação (fecharProps), dono no Controlador de Fluxo.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider = () => {
    const { config, nomesPorIdSer, chaveEmEdicao, atualizaObjeto, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const interagivel = config.interagiveis.find(interagivelAtual => interagivelAtual.chave === chaveEmEdicao) ?? null;
    const objeto = interagivel !== null && interagivel.tipo === 'objeto' ? interagivel : null;

    const [nome, setNome] = useState<string>(objeto?.nome ?? '');
    const [descricao, setDescricao] = useState<string>(objeto?.descricao ?? '');
    const [pontosDurabilidadeMaximo, setPontosDurabilidadeMaximo] = useState<number>(objeto?.pontosDurabilidadeMaximo ?? 1);
    const [percepcaoInicial, setPercepcaoInicial] = useState<'DESPERCEBIDO' | 'PERCEBIDO'>(objeto?.estadoPercepcaoInicial ?? 'PERCEBIDO');
    const [posicao, setPosicao] = useState<{ x: number; y: number }>(objeto?.posicao ?? { x: 0, y: 0 });
    const [descobertas, setDescobertas] = useState<readonly Descoberta[]>(objeto?.descobertas ?? []);

    const capacidades = useCapacidadesInatas();

    if (!objeto) return null;
    const ativo = objeto;

    const mapaLogico = config.cenario.mapaLogico;
    const rotuloAtivo = nome.trim().length > 0 ? nome : 'Objeto';
    const marcadoresContexto = config.interagiveis
        .filter(interagivelAtual => interagivelAtual.chave !== ativo.chave)
        .map(interagivelAtual => ({ key: interagivelAtual.chave, posicao: { x: interagivelAtual.posicao?.x ?? 0, y: interagivelAtual.posicao?.y ?? 0 }, rotulo: rotuloInteragivel(interagivelAtual, nomesPorIdSer) }));
    const opcoesCapacidades = capacidades.registros.map(capacidade => ({ value: String(capacidade.id), label: `${capacidade.nome} (${capacidade.nomeInteracao})` }));
    const opcoesInteragiveis = config.interagiveis.filter(interagivelAtual => interagivelAtual.chave !== ativo.chave).map(interagivelAtual => ({ value: interagivelAtual.chave, label: rotuloInteragivel(interagivelAtual, nomesPorIdSer) }));

    function salvar(): void {
        atualizaObjeto(ativo.chave, { nome, descricao, pontosDurabilidadeMaximo, estadoPercepcaoInicial: percepcaoInicial, posicao, descobertas });
        void toast.sucesso('Objeto salvo');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto
            nome={nome}
            aoMudarNome={setNome}
            descricao={descricao}
            aoMudarDescricao={setDescricao}
            pontosDurabilidadeMaximo={pontosDurabilidadeMaximo}
            aoMudarPontosDurabilidade={setPontosDurabilidadeMaximo}
            percepcaoInicial={percepcaoInicial}
            aoMudarPercepcao={setPercepcaoInicial}
            posicao={posicao}
            aoMudarPosicao={setPosicao}
            larguraMilimetros={mapaLogico.larguraMilimetros}
            alturaMilimetros={mapaLogico.alturaMilimetros}
            rotuloAtivo={rotuloAtivo}
            marcadoresContexto={marcadoresContexto}
            descobertas={descobertas}
            aoMudarDescobertas={setDescobertas}
            opcoesCapacidades={opcoesCapacidades}
            opcoesInteragiveis={opcoesInteragiveis}
            salvar={salvar}
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
