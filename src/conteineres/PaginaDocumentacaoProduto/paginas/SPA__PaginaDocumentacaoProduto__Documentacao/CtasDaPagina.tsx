'use client';

import styles from './aspectosPagina.module.css';

import { useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { removePaginaCta, vinculaPaginaCta } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';
import type { Contexto__PaginaDocumentacaoProduto__Documentacao__Props } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';

type Props = { idPagina: number; listagemCtas: Contexto__PaginaDocumentacaoProduto__Documentacao__Props['listagemCtas'] };

// Bloco autossuficiente: as CTAs que esta página expõe (do catálogo global). Vincular = dropdown das CTAs ainda não colocadas.
export default function CtasDaPagina({ idPagina, listagemCtas }: Props) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    const listagem = useNoraGraphQLListagem('PaginaCta', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkCtasId', 'prioridade', 'nota'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando CTAs da página',
        mensagemErro: 'Houve um erro recuperando as CTAs da página',
        mensagemListaVazia: 'Nenhuma CTA nesta página.',
        mensagemListaVaziaComFiltro: 'Nenhuma CTA encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { prioridade: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    const [idCta, setIdCta] = useState<number | null>(null);
    const [prioridade, setPrioridade] = useState<number>(0);
    const [nota, setNota] = useState<string>('');
    const [salvando, setSalvando] = useState<boolean>(false);

    const labelCta = (id: number): string => listagemCtas.registros.find(cta => cta.id === id)?.label ?? `CTA #${id}`;
    const ctasDisponiveis = useMemo<OpcaoSelecionador[]>(() => {
        const jaNaPagina = new Set(listagem.registros.map(vinculo => vinculo.fkCtasId));
        return listagemCtas.registros.filter(cta => !jaNaPagina.has(cta.id)).map(cta => ({ value: String(cta.id), label: cta.label }));
    }, [listagem.registros, listagemCtas.registros]);

    const recarregar = listagem.recarregar;
    async function confirmar(): Promise<void> {
        if (idCta === null) return;
        setSalvando(true);
        try {
            await vinculaPaginaCta({ fkPaginasNavegacaoId: idPagina, fkCtasId: idCta, prioridade, nota: nota.trim().length > 0 ? nota.trim() : null });
            recarregar();
            setIdCta(null);
            setPrioridade(0);
            setNota('');
        } finally {
            setSalvando(false);
        }
    };
    async function remover(id: number): Promise<void> { await removePaginaCta({ id }); recarregar(); };

    return (
        <section className={styles.secao}>
            <h4 className={styles.titulo_secao}>CTAs desta página</h4>
            {listagem.registros.length === 0 && <p className={styles.vazio}>Nenhuma CTA nesta página ainda.</p>}
            <ul className={styles.lista}>
                {listagem.registros.map(vinculo => (
                    <li key={vinculo.id} className={styles.item}>
                        <div className={styles.item_corpo}>
                            <strong className={styles.nome}>{labelCta(vinculo.fkCtasId)}</strong>
                            <span className={styles.meta}>Prioridade {vinculo.prioridade}</span>
                            {vinculo.nota !== null && <p className={styles.nota}>{vinculo.nota}</p>}
                        </div>
                        <button type="button" className={styles.botao_leve} onClick={() => remover(vinculo.id)}>Remover</button>
                    </li>
                ))}
            </ul>
            <div className={styles.form}>
                <InputComRotulo rotulo="Adicionar CTA a esta página">
                    <SelecionadorOpcoes opcoes={ctasDisponiveis} valor={idCta !== null ? String(idCta) : null} onChange={valor => setIdCta(valor !== null ? Number(valor) : null)} placeholder={ctasDisponiveis.length > 0 ? 'Escolha uma CTA do catálogo...' : 'Todas as CTAs já estão nesta página (crie mais em CTAs & Seções)'} isClearable />
                </InputComRotulo>
                {idCta !== null && (
                    <>
                        <div className={styles.linha}>
                            <InputComRotulo rotulo="Prioridade visual">
                                <InputNumerico value={prioridade} onChange={setPrioridade} />
                            </InputComRotulo>
                        </div>
                        <InputComRotulo rotulo="Nota desta aparição">
                            <textarea rows={2} value={nota} onChange={e => setNota(e.target.value)} placeholder="Algo específico de como esta CTA aparece nesta página." />
                        </InputComRotulo>
                        <div className={styles.acoes}>
                            <button type="button" className={styles.botao_leve} onClick={() => { setIdCta(null); setPrioridade(0); setNota(''); }} disabled={salvando}>Cancelar</button>
                            <button type="button" className={styles.botao_leve} onClick={confirmar} disabled={salvando}>{salvando ? 'Adicionando...' : 'Adicionar CTA'}</button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};