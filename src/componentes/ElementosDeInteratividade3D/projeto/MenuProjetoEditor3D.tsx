'use client';

import styles from './styles.module.css';

import { useState, type FormEvent } from 'react';
import { EventosApiRest } from 'types-nora-api/api/rest';

import { NoraApi } from 'Api/NoraApi';
import { ModalAreaInterativa3D } from '../modal/ModalAreaInterativa3D';
import { obtemMensagemConfirmacaoDescarteCenaEditor3D } from './editor3D.projeto.carregamento';
import { criaPayloadSalvarNovoProjetoEditor3D, criaPayloadSalvarProjetoAtualEditor3D, obtemBloqueioSalvamentoProjetoEditor3D } from './editor3D.projeto.salvamento';
import { obtemBloqueioCarregamentoCenaCanonicaEditor3D } from '../editor/editor3D.cenaCanonica.carregamento';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { Projeto3DResumoPersistido } from 'types-nora-api/shared';

type ModalProjetoEditor3D = 'SALVAR_NOVO' | 'CARREGAR';

interface StatusProjetoEditor3D {
    readonly texto: string;
    readonly bloqueado: boolean;
};

function formataDataAtualizacaoProjetoEditor3D(dataAtualizacao: string): string {
    const data = new Date(dataAtualizacao);

    if (Number.isNaN(data.getTime())) return dataAtualizacao;

    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

export function MenuProjetoEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const [menuAberto, setMenuAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState<ModalProjetoEditor3D | null>(null);
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [statusSalvar, setStatusSalvar] = useState<StatusProjetoEditor3D | null>(null);
    const [statusCarregar, setStatusCarregar] = useState<StatusProjetoEditor3D | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [carregandoListagem, setCarregandoListagem] = useState(false);
    const [idProjetoCarregando, setIdProjetoCarregando] = useState<number | null>(null);
    const [projetos, setProjetos] = useState<Projeto3DResumoPersistido[]>([]);

    function fechaModal(): void {
        setModalAberto(null);
        setStatusSalvar(null);
        setStatusCarregar(null);
        setIdProjetoCarregando(null);
    };

    function abreSalvarNovoProjeto(): void {
        setMenuAberto(false);
        setNomeProjeto('');
        setStatusSalvar(null);
        setModalAberto('SALVAR_NOVO');
    };

    async function carregaListagemProjetos(): Promise<void> {
        setCarregandoListagem(true);
        setStatusCarregar({ texto: 'Carregando projetos...', bloqueado: false });

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.Projeto3D.listagem, {}, { mensagemErro: 'Falha ao listar projetos 3D' });

            setProjetos([...resposta]);
            setStatusCarregar(resposta.length === 0 ? { texto: 'Nenhum projeto salvo encontrado.', bloqueado: true } : null);
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao listar projetos 3D';

            setStatusCarregar({ texto: mensagemErro, bloqueado: true });
        } finally {
            setCarregandoListagem(false);
        }
    };

    function abreCarregarProjeto(): void {
        setMenuAberto(false);
        setStatusCarregar(null);
        setProjetos([]);
        setModalAberto('CARREGAR');
        void carregaListagemProjetos();
    };

    async function salvaProjetoAtual(): Promise<void> {
        if (estado.projetoAberto === null) {
            setStatusSalvar({ texto: 'Carregue ou salve um projeto novo antes de atualizar o projeto atual.', bloqueado: true });

            return;
        }

        const motivoBloqueio = obtemBloqueioSalvamentoProjetoEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatusSalvar({ texto: motivoBloqueio, bloqueado: true });

            return;
        }

        const payload = criaPayloadSalvarProjetoAtualEditor3D(estado);

        if (payload === null) {
            setStatusSalvar({ texto: 'Nenhum projeto aberto para atualizar.', bloqueado: true });

            return;
        }

        setSalvando(true);
        setStatusSalvar({ texto: `Salvando projeto atual: ${estado.projetoAberto.nome}...`, bloqueado: false });

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, payload, { mensagemErro: 'Falha ao salvar projeto atual 3D' });

            acoes.defineProjetoAberto({ id: projeto.id, nome: projeto.nome });
            setStatusSalvar({ texto: `Projeto atual salvo: ${projeto.nome}.`, bloqueado: false });
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao salvar projeto atual 3D';

            setStatusSalvar({ texto: mensagemErro, bloqueado: true });
        } finally {
            setSalvando(false);
        }
    };

    async function salvaNovoProjeto(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const nome = nomeProjeto.trim();

        if (nome.length === 0) {
            setStatusSalvar({ texto: 'Informe um nome para salvar o projeto.', bloqueado: true });

            return;
        }

        const motivoBloqueio = obtemBloqueioSalvamentoProjetoEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatusSalvar({ texto: motivoBloqueio, bloqueado: true });

            return;
        }

        const payload = criaPayloadSalvarNovoProjetoEditor3D(estado, nome);

        setSalvando(true);
        setStatusSalvar({ texto: 'Salvando novo projeto...', bloqueado: false });

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, payload, { mensagemErro: 'Falha ao salvar projeto 3D' });

            acoes.defineProjetoAberto({ id: projeto.id, nome: projeto.nome });
            setNomeProjeto(projeto.nome);
            setStatusSalvar({ texto: `Novo projeto salvo: ${projeto.nome}.`, bloqueado: false });
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao salvar projeto 3D';

            setStatusSalvar({ texto: mensagemErro, bloqueado: true });
        } finally {
            setSalvando(false);
        }
    };

    async function carregaProjeto(projetoResumo: Projeto3DResumoPersistido): Promise<void> {
        const motivoBloqueio = obtemBloqueioCarregamentoCenaCanonicaEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatusCarregar({ texto: motivoBloqueio, bloqueado: true });

            return;
        }

        const mensagemConfirmacaoDescarte = obtemMensagemConfirmacaoDescarteCenaEditor3D(estado, projetoResumo);

        if (mensagemConfirmacaoDescarte !== null && !window.confirm(mensagemConfirmacaoDescarte)) {
            setStatusCarregar({ texto: 'Carregamento cancelado. A cena atual foi preservada.', bloqueado: true });

            return;
        }

        setIdProjetoCarregando(projetoResumo.id);
        setStatusCarregar({ texto: `Carregando ${projetoResumo.nome}...`, bloqueado: false });

        try {
            const projeto = await NoraApi.RestGET(EventosApiRest.GET.Projeto3D.consulta, { idProjeto: projetoResumo.id }, { mensagemErro: 'Falha ao carregar projeto 3D' });

            if (projeto === null) {
                setStatusCarregar({ texto: 'Projeto nao encontrado.', bloqueado: true });

                return;
            }

            acoes.carregaProjetoCanonico(projeto);
            fechaModal();
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao carregar projeto 3D';

            setStatusCarregar({ texto: mensagemErro, bloqueado: true });
        } finally {
            setIdProjetoCarregando(null);
        }
    };

    return (
        <>
            <div className={styles.menuProjetoEditor3D} data-editor3d-menu-projeto="true">
                <button className={styles.botaoMenuProjetoEditor3D} type="button" onClick={() => setMenuAberto(aberto => !aberto)} aria-expanded={menuAberto} aria-label="Menu de projeto do Editor 3D">
                    <span>Projeto</span>
                    <strong>{estado.projetoAberto?.nome ?? 'Sem projeto'}</strong>
                </button>

                {menuAberto && (
                    <div className={styles.listaAcoesProjetoEditor3D}>
                        {estado.projetoAberto !== null && <button type="button" onClick={() => void salvaProjetoAtual()} disabled={salvando}><span>A</span><strong>Salvar Projeto Atual</strong></button>}
                        <button type="button" onClick={abreSalvarNovoProjeto} disabled={salvando}><span>N</span><strong>{estado.projetoAberto === null ? 'Salvar Novo Projeto' : 'Salvar Como'}</strong></button>
                        <button type="button" onClick={abreCarregarProjeto}><span>C</span><strong>Carregar Projeto</strong></button>
                        {statusSalvar !== null && modalAberto === null && <div className={`${styles.statusProjetoEditor3D} ${styles.statusMenuProjetoEditor3D} ${statusSalvar.bloqueado ? styles.statusProjetoEditor3DBloqueado : ''}`}>{statusSalvar.texto}</div>}
                    </div>
                )}
            </div>

            {modalAberto === 'SALVAR_NOVO' && (
                <ModalAreaInterativa3D titulo={estado.projetoAberto === null ? 'Salvar Novo Projeto' : 'Salvar Como'} subtitulo="Criando novo projeto" ariaLabel="Salvar novo projeto 3D" fecha={fechaModal}>
                    <form className={styles.formularioProjetoEditor3D} onSubmit={salvaNovoProjeto}>
                        <label htmlFor="nome-projeto-editor-3d">Nome do novo projeto</label>
                        <input id="nome-projeto-editor-3d" type="text" value={nomeProjeto} onChange={evento => setNomeProjeto(evento.currentTarget.value)} maxLength={120} autoFocus />

                        {statusSalvar !== null && <div className={`${styles.statusProjetoEditor3D} ${statusSalvar.bloqueado ? styles.statusProjetoEditor3DBloqueado : ''}`}>{statusSalvar.texto}</div>}

                        <div className={styles.acoesFormularioProjetoEditor3D}>
                            <button type="submit" disabled={salvando}>{salvando ? 'Salvando' : 'Criar Novo Projeto'}</button>
                        </div>
                    </form>
                </ModalAreaInterativa3D>
            )}

            {modalAberto === 'CARREGAR' && (
                <ModalAreaInterativa3D titulo="Carregar Projeto" subtitulo="Projetos salvos" ariaLabel="Carregar projeto 3D" fecha={fechaModal}>
                    <div className={styles.listagemProjetosEditor3D}>
                        <div className={styles.acoesListagemProjetosEditor3D}>
                            <button type="button" onClick={carregaListagemProjetos} disabled={carregandoListagem}>{carregandoListagem ? 'Atualizando' : 'Atualizar Lista'}</button>
                        </div>

                        {statusCarregar !== null && <div className={`${styles.statusProjetoEditor3D} ${statusCarregar.bloqueado ? styles.statusProjetoEditor3DBloqueado : ''}`}>{statusCarregar.texto}</div>}

                        <div className={styles.itensListagemProjetosEditor3D}>
                            {projetos.map(projeto => (
                                <button key={projeto.id} type="button" onClick={() => void carregaProjeto(projeto)} disabled={idProjetoCarregando !== null}>
                                    <span>{projeto.nome}</span>
                                    <strong>{formataDataAtualizacaoProjetoEditor3D(projeto.dataAtualizacao)}</strong>
                                </button>
                            ))}
                        </div>
                    </div>
                </ModalAreaInterativa3D>
            )}
        </>
    );
};