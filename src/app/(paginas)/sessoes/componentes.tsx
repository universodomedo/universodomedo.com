'use client';

import styles from './styles.module.css';

import { useContextoPaginasListagemSessoes } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { VisualizacaoSessao } from 'Componentes/ElementosPaginaSessao/VisualizacaoSessao/page';

export function PaginaSessoes_Slot() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <PaginaSessoes_Conteudo />
            </LayoutContextualizado.Conteudo>
        </LayoutContextualizado>
    );
};

function PaginaSessoes_Conteudo() {
    const { sessaoSelecionada } = useContextoPaginasListagemSessoes();

    if (sessaoSelecionada) return (<VisualizacaoSessao sessaoSelecionada={sessaoSelecionada} />);

    return (<ListagemSessoes />);
};

function ListagemSessoes() {
    const { sessoes, sessaoSelecionada, selecionaSessao, deselecionaSessao } = useContextoPaginasListagemSessoes();
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 100, fecharProps: sessaoSelecionada ? { tipo: 'acao', executar: () => deselecionaSessao(), tituloTooltip: 'Voltar para Listagem' } : undefined });

    const sessoesOrdenadas = [...sessoes].sort((a, b) => new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime());

    const handleClickTabela = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const tr = target.closest('tr[data-sessao-id]') as HTMLTableRowElement | null;
        if (!tr) return;

        const sessaoId = tr.dataset.sessaoId;
        if (!sessaoId) return;

        selecionaSessao(Number(sessaoId));
    };

    return (
        <>
            <h1>Sessões</h1>

            <DivClicavel onClick={handleClickTabela} className={styles.tabela_sessoes_click_wrapper}>
                <div className={styles.tabela_sessoes_container}>
                    <table className={styles.tabela_sessoes}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Mestre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessoesOrdenadas.map((sessao, index) => (
                                <tr key={sessao.id} data-sessao-id={sessao.id}>
                                    <td>{index + 1}</td>
                                    <td>{sessao.id}</td>
                                    <td>{sessao.detalheData}</td>
                                    <td>{sessao.estiloSessao}</td>
                                    <td>{sessao.dadosGerais!.mestre.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DivClicavel>
        </>
    );
};