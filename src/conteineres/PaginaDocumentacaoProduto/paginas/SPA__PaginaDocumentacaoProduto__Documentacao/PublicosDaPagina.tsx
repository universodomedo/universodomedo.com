'use client';

import styles from './aspectosPagina.module.css';

import { useMemo, useState } from 'react';
import type { GrauPersonaPagina } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { adicionaMensagemChave, atualizaGrauPaginaPersona, moveMensagemChave, removeMensagemChave, removePaginaPersona, vinculaPaginaPersona } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';
import type { Contexto__PaginaDocumentacaoProduto__Documentacao__Props } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';

type Props = {
    idPagina: number;
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Documentacao__Props['listagemPersonas'];
    nomePersonaPorId: (idPersona: number) => string;
};

const OPCOES_GRAU: readonly OpcaoSelecionador[] = [
    { value: 'PRINCIPAL', label: 'Principal' },
    { value: 'SECUNDARIA', label: 'Secundária' },
];

// Bloco autossuficiente: públicos da página com GRAU (principal/secundária) e mensagens-chave por público (itens ordenados).
export default function PublicosDaPagina({ idPagina, listagemPersonas, nomePersonaPorId }: Props) {
    const whereFixo = useMemo(() => ({ fkPaginasNavegacaoId: { eq: idPagina } }), [idPagina]);
    const listagemPublicos = useNoraGraphQLListagem('DocumentacaoPaginaPersona', {
        select: ['id', 'fkPaginasNavegacaoId', 'fkPersonasId', 'grau'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando públicos da página',
        mensagemErro: 'Houve um erro recuperando os públicos da página',
        mensagemListaVazia: 'Nenhum público desta página.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
    // Mensagens de todos os públicos (filtro client por vínculo).
    const listagemMensagens = useNoraGraphQLListagem('MensagemChave', {
        select: ['id', 'fkDocumentacoesPaginasPersonasId', 'texto', 'ordem'],
        itensPorPagina: 1000,
        carregando: 'Buscando mensagens-chave',
        mensagemErro: 'Houve um erro recuperando as mensagens-chave',
        mensagemListaVazia: 'Nenhuma mensagem-chave.',
        mensagemListaVaziaComFiltro: 'Nenhuma mensagem encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    const [idPersonaNova, setIdPersonaNova] = useState<number | null>(null);
    const [grauNovo, setGrauNovo] = useState<GrauPersonaPagina>('PRINCIPAL');
    const [salvando, setSalvando] = useState<boolean>(false);
    const [rascunhoMensagem, setRascunhoMensagem] = useState<Record<number, string>>({});

    const recarregarPublicos = listagemPublicos.recarregar;
    const recarregarMensagens = listagemMensagens.recarregar;

    const personasDisponiveis = useMemo<OpcaoSelecionador[]>(() => {
        const jaPublico = new Set(listagemPublicos.registros.map(vinculo => vinculo.fkPersonasId));
        return listagemPersonas.registros.filter(persona => persona.ativo && !jaPublico.has(persona.id)).map(persona => ({ value: String(persona.id), label: persona.nome }));
    }, [listagemPublicos.registros, listagemPersonas.registros]);

    const mensagensDoPublico = (idVinculo: number) => listagemMensagens.registros.filter(mensagem => mensagem.fkDocumentacoesPaginasPersonasId === idVinculo).sort((a, b) => a.ordem - b.ordem);

    async function vincular(): Promise<void> {
        if (idPersonaNova === null) return;
        setSalvando(true);
        try {
            await vinculaPaginaPersona({ fkPaginasNavegacaoId: idPagina, fkPersonasId: idPersonaNova, grau: grauNovo });
            recarregarPublicos();
            setIdPersonaNova(null);
            setGrauNovo('PRINCIPAL');
        } finally {
            setSalvando(false);
        }
    };
    async function mudarGrau(id: number, grau: GrauPersonaPagina): Promise<void> { await atualizaGrauPaginaPersona({ id, grau }); recarregarPublicos(); };
    async function removerPublico(id: number): Promise<void> { await removePaginaPersona({ id }); recarregarPublicos(); };

    async function adicionarMensagem(idVinculo: number): Promise<void> {
        const texto = (rascunhoMensagem[idVinculo] ?? '').trim();
        if (texto.length < 1) return;
        await adicionaMensagemChave({ fkDocumentacoesPaginasPersonasId: idVinculo, texto });
        recarregarMensagens();
        setRascunhoMensagem(prev => ({ ...prev, [idVinculo]: '' }));
    };
    async function removerMensagem(id: number): Promise<void> { await removeMensagemChave({ id }); recarregarMensagens(); };
    async function moverMensagem(id: number, direcao: 'subir' | 'descer'): Promise<void> { await moveMensagemChave({ id, direcao }); recarregarMensagens(); };

    return (
        <section className={styles.secao}>
            <h4 className={styles.titulo_secao}>Públicos desta página</h4>
            {listagemPublicos.registros.length === 0 && <p className={styles.vazio}>Nenhum público graduado ainda.</p>}
            <ul className={styles.lista}>
                {listagemPublicos.registros.map(vinculo => {
                    const mensagens = mensagensDoPublico(vinculo.id);
                    return (
                        <li key={vinculo.id} className={styles.item}>
                            <div className={styles.item_corpo}>
                                <strong className={styles.nome}>{nomePersonaPorId(vinculo.fkPersonasId)}</strong>
                                <div className={styles.linha}>
                                    <InputComRotulo rotulo="Grau">
                                        <SelecionadorOpcoes opcoes={OPCOES_GRAU} valor={vinculo.grau} onChange={valor => mudarGrau(vinculo.id, (valor ?? 'PRINCIPAL') as GrauPersonaPagina)} />
                                    </InputComRotulo>
                                </div>
                                <div className={styles.publicos_secao}>
                                    <h5 className={styles.titulo_sub}>Mensagens-chave</h5>
                                    <ul className={styles.mensagens}>
                                        {mensagens.map((mensagem, indice) => (
                                            <li key={mensagem.id} className={styles.mensagem_item}>
                                                <span className={styles.mensagem_texto}>{mensagem.texto}</span>
                                                <button type="button" className={styles.botao_leve} onClick={() => moverMensagem(mensagem.id, 'subir')} disabled={indice === 0}>↑</button>
                                                <button type="button" className={styles.botao_leve} onClick={() => moverMensagem(mensagem.id, 'descer')} disabled={indice === mensagens.length - 1}>↓</button>
                                                <button type="button" className={styles.botao_leve} onClick={() => removerMensagem(mensagem.id)}>×</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.linha}>
                                        <InputComRotulo rotulo="Nova mensagem-chave">
                                            <input type="text" value={rascunhoMensagem[vinculo.id] ?? ''} onChange={e => setRascunhoMensagem(prev => ({ ...prev, [vinculo.id]: e.target.value }))} placeholder="ex.: não precisa coordenar disponibilidade" />
                                        </InputComRotulo>
                                    </div>
                                    <div className={styles.acoes}>
                                        <button type="button" className={styles.botao_leve} onClick={() => adicionarMensagem(vinculo.id)}>Adicionar mensagem</button>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className={styles.botao_leve} onClick={() => removerPublico(vinculo.id)}>Remover</button>
                        </li>
                    );
                })}
            </ul>
            <div className={styles.form}>
                <h5 className={styles.titulo_sub}>Vincular público</h5>
                <div className={styles.linha}>
                    <InputComRotulo rotulo="Persona">
                        <SelecionadorOpcoes opcoes={personasDisponiveis} valor={idPersonaNova !== null ? String(idPersonaNova) : null} onChange={valor => setIdPersonaNova(valor !== null ? Number(valor) : null)} placeholder={personasDisponiveis.length > 0 ? 'Escolha a persona...' : 'Todas as personas já vinculadas'} isClearable />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Grau">
                        <SelecionadorOpcoes opcoes={OPCOES_GRAU} valor={grauNovo} onChange={valor => setGrauNovo((valor ?? 'PRINCIPAL') as GrauPersonaPagina)} />
                    </InputComRotulo>
                </div>
                <div className={styles.acoes}>
                    <button type="button" className={styles.botao_leve} onClick={vincular} disabled={idPersonaNova === null || salvando}>{salvando ? 'Vinculando...' : 'Vincular público'}</button>
                </div>
            </div>
        </section>
    );
};