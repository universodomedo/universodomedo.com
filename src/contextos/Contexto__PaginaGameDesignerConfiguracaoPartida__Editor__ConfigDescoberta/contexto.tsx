'use client';

import { useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { toast } from 'Hooks/useToast';
import { rotuloObjeto, rotuloSer, type RecompensaDescoberta } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta';

// Subfluxo Configuração da Descoberta Condicionada: edita a descoberta (Nome, Descrição interna, Interação/capacidade, Recompensas) na sua própria vista.
// A recompensa mira recursos da Partida — não-controláveis (Seres) e objetos (interagiveis) — lidos do config via o Controlador de Fluxo. Buffer local → Salvar commita e volta.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta__Provider = () => {
    const { config, nomesPorIdSer, descobertaEmEdicaoKey, atualizaDescoberta, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const descoberta = config.descobertasCondicionadas.find(descobertaAtual => descobertaAtual.key === descobertaEmEdicaoKey) ?? null;

    const [nome, setNome] = useState<string>(descoberta?.nome ?? '');
    const [descricaoInterna, setDescricaoInterna] = useState<string>(descoberta?.descricaoInterna ?? '');
    const [idCapacidadeInata, setIdCapacidadeInata] = useState<number>(descoberta?.idCapacidadeInata ?? 0);
    const [recompensas, setRecompensas] = useState<readonly RecompensaDescoberta[]>(descoberta?.recompensas ?? []);

    const capacidades = useCapacidadesInatas();

    if (!descoberta) return null;
    const ativo = descoberta;

    const opcoesCapacidades = capacidades.registros.map(capacidade => ({ value: String(capacidade.id), label: `${capacidade.nome} (${capacidade.nomeInteracao})` }));
    const opcoesNaoControlaveis = config.naoControlaveis.map(ser => ({ value: ser.key, label: rotuloSer(ser, nomesPorIdSer) }));
    const opcoesObjetos = config.interagiveis.map(objeto => ({ value: objeto.key, label: rotuloObjeto(objeto) }));

    function adicionaRecompensa(): void { setRecompensas(atual => [...atual, { dificuldadeMinima: 0, keysSeresPercebidos: [], keysInteragiveisPercebidos: [] }]); };
    function removeRecompensa(indice: number): void { setRecompensas(atual => atual.filter((_, indiceAtual) => indiceAtual !== indice)); };
    function atualizaRecompensa(indice: number, parcial: Partial<RecompensaDescoberta>): void { setRecompensas(atual => atual.map((recompensa, indiceAtual) => indiceAtual === indice ? { ...recompensa, ...parcial } : recompensa)); };

    function salvar(): void {
        atualizaDescoberta(ativo.key, { nome, descricaoInterna, idCapacidadeInata, recompensas });
        void toast.sucesso('Descoberta salva');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta
            nome={nome}
            aoMudarNome={setNome}
            descricaoInterna={descricaoInterna}
            aoMudarDescricaoInterna={setDescricaoInterna}
            idCapacidadeInata={idCapacidadeInata}
            aoMudarCapacidade={setIdCapacidadeInata}
            opcoesCapacidades={opcoesCapacidades}
            recompensas={recompensas}
            adicionaRecompensa={adicionaRecompensa}
            removeRecompensa={removeRecompensa}
            atualizaRecompensa={atualizaRecompensa}
            opcoesNaoControlaveis={opcoesNaoControlaveis}
            opcoesObjetos={opcoesObjetos}
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
