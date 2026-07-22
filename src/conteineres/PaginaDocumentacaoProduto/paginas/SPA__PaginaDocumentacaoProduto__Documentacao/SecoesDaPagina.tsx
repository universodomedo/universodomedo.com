'use client';

import styles from './aspectosPagina.module.css';

import { useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { criaSecao, moveSecao, removeSecao, removeSecaoPersona, vinculaSecaoPersona } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';
import type { Contexto__PaginaDocumentacaoProduto__Documentacao__Props } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';

type Props = {
    idPagina: number;
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Documentacao__Props['listagemTiposSecao'];
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Documentacao__Props['listagemPersonas'];
    nomePersonaPorId: (idPersona: number) => string;
};

// Bloco autossuficiente: as seções documentais desta página (só faz sentido pleno em página configurável). Público por seção via tags.
export default function SecoesDaPagina({ idPagina, listagemTiposSecao, listagemPersonas, nomePersonaPorId }: Props) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    const listagemSecoes = useNoraGraphQLListagem('Secao', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkTiposSecaoId', 'nome', 'objetivo', 'conteudoEditavel', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando seções',
        mensagemErro: 'Houve um erro recuperando as seções',
        mensagemListaVazia: 'Nenhuma seção nesta página.',
        mensagemListaVaziaComFiltro: 'Nenhuma seção encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
    // Públicos de todas as seções (filtro client por seção — secoes_personas não tem coluna de página).
    const listagemSecoesPersonas = useNoraGraphQLListagem('SecaoPersona', {
        select: ['id', 'fkSecoesId', 'fkPersonasId'],
        itensPorPagina: 1000,
        carregando: 'Buscando públicos das seções',
        mensagemErro: 'Houve um erro recuperando os públicos das seções',
        mensagemListaVazia: 'Nenhum público de seção.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    const [fkTiposSecaoId, setFkTiposSecaoId] = useState<number | null>(null);
    const [nome, setNome] = useState<string>('');
    const [objetivo, setObjetivo] = useState<string>('');
    const [conteudoEditavel, setConteudoEditavel] = useState<string>('');
    const [salvando, setSalvando] = useState<boolean>(false);

    const rotuloTipo = (id: number): string => listagemTiposSecao.registros.find(tipo => tipo.id === id)?.rotulo ?? `Tipo #${id}`;
    const opcoesTipos = useMemo<OpcaoSelecionador[]>(() => listagemTiposSecao.registros.filter(tipo => tipo.ativo).map(tipo => ({ value: String(tipo.id), label: tipo.rotulo })), [listagemTiposSecao.registros]);

    const recarregar = listagemSecoes.recarregar;
    const recarregarPublicos = listagemSecoesPersonas.recarregar;
    const podeCriar = nome.trim().length > 0 && fkTiposSecaoId !== null && !salvando;

    async function criar(): Promise<void> {
        if (fkTiposSecaoId === null) return;
        setSalvando(true);
        try {
            await criaSecao({ fkPaginasNavegacaoId: idPagina, fkTiposSecaoId, nome: nome.trim(), objetivo: objetivo.trim().length > 0 ? objetivo.trim() : null, conteudoEditavel: conteudoEditavel.trim().length > 0 ? conteudoEditavel.trim() : null });
            recarregar();
            setNome(''); setObjetivo(''); setConteudoEditavel(''); setFkTiposSecaoId(null);
        } finally {
            setSalvando(false);
        }
    };
    async function remover(id: number): Promise<void> { await removeSecao({ id }); recarregar(); };
    async function mover(id: number, direcao: 'subir' | 'descer'): Promise<void> { await moveSecao({ id, direcao }); recarregar(); };

    const publicosDaSecao = (idSecao: number) => listagemSecoesPersonas.registros.filter(vinculo => vinculo.fkSecoesId === idSecao);
    const personasDisponiveis = (idSecao: number): OpcaoSelecionador[] => {
        const jaPublico = new Set(publicosDaSecao(idSecao).map(vinculo => vinculo.fkPersonasId));
        return listagemPersonas.registros.filter(persona => persona.ativo && !jaPublico.has(persona.id)).map(persona => ({ value: String(persona.id), label: persona.nome }));
    };
    async function adicionarPublico(idSecao: number, idPersona: number): Promise<void> { await vinculaSecaoPersona({ fkSecoesId: idSecao, fkPersonasId: idPersona }); recarregarPublicos(); };
    async function removerPublico(idVinculo: number): Promise<void> { await removeSecaoPersona({ id: idVinculo }); recarregarPublicos(); };

    return (
        <section className={styles.secao}>
            <h4 className={styles.titulo_secao}>Seções desta página</h4>
            {listagemSecoes.registros.length === 0 && <p className={styles.vazio}>Nenhuma seção nesta página ainda.</p>}
            <ul className={styles.lista}>
                {listagemSecoes.registros.map((secao, indice) => (
                    <li key={secao.id} className={styles.item}>
                        <span className={styles.numero}>{indice + 1}</span>
                        <div className={styles.item_corpo}>
                            <strong className={styles.nome}>{secao.nome}</strong>
                            <span className={styles.meta}>{rotuloTipo(secao.fkTiposSecaoId)}</span>
                            {secao.objetivo !== null && <p className={styles.nota}>{secao.objetivo}</p>}
                            {secao.conteudoEditavel !== null && <p className={styles.nota}><em>Editável:</em> {secao.conteudoEditavel}</p>}
                            <div className={styles.publicos_secao}>
                                <ul className={styles.lista_publicos}>
                                    {publicosDaSecao(secao.id).map(vinculo => (
                                        <li key={vinculo.id} className={styles.publico_tag}>{nomePersonaPorId(vinculo.fkPersonasId)}<button type="button" className={styles.remover_tag} onClick={() => removerPublico(vinculo.id)}>×</button></li>
                                    ))}
                                </ul>
                                <SelecionadorOpcoes opcoes={personasDisponiveis(secao.id)} valor={null} onChange={valor => { if (valor !== null) adicionarPublico(secao.id, Number(valor)); }} placeholder={personasDisponiveis(secao.id).length > 0 ? 'Adicionar público...' : 'Todos os públicos vinculados'} />
                            </div>
                        </div>
                        <div className={styles.acoes_item}>
                            <button type="button" className={styles.botao_leve} onClick={() => mover(secao.id, 'subir')} disabled={indice === 0}>↑</button>
                            <button type="button" className={styles.botao_leve} onClick={() => mover(secao.id, 'descer')} disabled={indice === listagemSecoes.registros.length - 1}>↓</button>
                            <button type="button" className={styles.botao_leve} onClick={() => remover(secao.id)}>Remover</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.form}>
                <h5 className={styles.titulo_sub}>Nova seção</h5>
                <div className={styles.linha}>
                    <InputComRotulo rotulo="Nome *">
                        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="ex.: Hero de abertura" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tipo *">
                        <SelecionadorOpcoes opcoes={opcoesTipos} valor={fkTiposSecaoId !== null ? String(fkTiposSecaoId) : null} onChange={valor => setFkTiposSecaoId(valor !== null ? Number(valor) : null)} placeholder={opcoesTipos.length > 0 ? 'Escolha o tipo...' : 'Cadastre tipos em CTAs & Seções'} />
                    </InputComRotulo>
                </div>
                <InputComRotulo rotulo="Objetivo da seção">
                    <textarea rows={2} value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Por que esta seção existe?" />
                </InputComRotulo>
                <InputComRotulo rotulo="O que é editável nela">
                    <textarea rows={2} value={conteudoEditavel} onChange={e => setConteudoEditavel(e.target.value)} placeholder="Que campos são customizáveis (imagem, texto, CTA...)?" />
                </InputComRotulo>
                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_leve} onClick={criar} disabled={!podeCriar}>{salvando ? 'Criando...' : 'Criar seção'}</button>
                </div>
            </div>
        </section>
    );
};