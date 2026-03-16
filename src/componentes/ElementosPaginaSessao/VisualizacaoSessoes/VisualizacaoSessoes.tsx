'use client';

import styles from './styles.module.css';

import { useContextoPaginasListagemSessoes } from 'Contextos/ContextoPaginasListagemSessoes/contexto';
import { VisualizacaoSessao } from 'Componentes/ElementosPaginaSessao/VisualizacaoSessao/VisualizacaoSessao';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export function VisualizacaoSessoes() {
    const { sessaoSelecionada } = useContextoPaginasListagemSessoes();

    return sessaoSelecionada ? <VisualizacaoSessao /> : <ListagemSessoes />;
};

function ListagemSessoes() {
    const { sessoes, selecionaSessao } = useContextoPaginasListagemSessoes();
    useConfigurarLayoutContextualizado({ titulo: 'Lista de Sessões', fecharProps: undefined }, 'patch');

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
                                    <td>{sessao.tipoPorExtenso}</td>
                                    <td>{sessao.usuarioMestre.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DivClicavel>
        </>
    );
};