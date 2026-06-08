'use client';

import styles from './styles.module.css';

import { useState, type FormEvent } from 'react';
import { EventosApiRest } from 'types-nora-api/api/rest';

import { NoraApi } from 'Api/NoraApi';
import { ModalAreaInterativa3D } from '../modal/ModalAreaInterativa3D';
import { obtemMensagemConfirmacaoDescarteCenaEditor3D } from './editor3D.projeto.carregamento';
import { obtemBloqueioCarregamentoCenaCanonicaEditor3D } from '../editor/editor3D.cenaCanonica.carregamento';
import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { Projeto3DResumoPersistido } from 'types-nora-api/shared';

type ModalProjetoEditor3D = 'SALVAR' | 'CARREGAR';

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

    function abreSalvarProjeto(): void {
        setMenuAberto(false);
        setNomeProjeto(estado.projetoAberto?.nome ?? '');
        setStatusSalvar(null);
        setModalAberto('SALVAR');
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

    async function salvaProjeto(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const nome = nomeProjeto.trim();

        if (nome.length === 0) {
            setStatusSalvar({ texto: 'Informe um nome para salvar o projeto.', bloqueado: true });

            return;
        }

        if (estado.objetos.length === 0) {
            setStatusSalvar({ texto: 'Crie ao menos um objeto confirmado antes de salvar o projeto.', bloqueado: true });

            return;
        }

        const motivoBloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatusSalvar({ texto: motivoBloqueio, bloqueado: true });

            return;
        }

        const cenaCanonica = serializaEditor3DParaCenaCanonica(estado);
        const payload = estado.projetoAberto === null ? { nome, cenaCanonica } : { idProjeto: estado.projetoAberto.id, nome, cenaCanonica };

        setSalvando(true);
        setStatusSalvar({ texto: 'Salvando projeto...', bloqueado: false });

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, payload, { mensagemErro: 'Falha ao salvar projeto 3D' });

            acoes.defineProjetoAberto({ id: projeto.id, nome: projeto.nome });
            setNomeProjeto(projeto.nome);
            setStatusSalvar({ texto: `Projeto salvo: ${projeto.nome}.`, bloqueado: false });
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
        <div className={styles.menuProjetoEditor3D} data-editor3d-menu-projeto="true">
            <button className={styles.botaoMenuProjetoEditor3D} type="button" onClick={() => setMenuAberto(aberto => !aberto)} aria-expanded={menuAberto} aria-label="Menu de projeto do Editor 3D">
                <span>Projeto</span>
                <strong>{estado.projetoAberto?.nome ?? 'Sem projeto'}</strong>
            </button>

            {menuAberto && (
                <div className={styles.listaAcoesProjetoEditor3D}>
                    <button type="button" onClick={abreSalvarProjeto}><span>S</span><strong>Salvar Projeto</strong></button>
                    <button type="button" onClick={abreCarregarProjeto}><span>C</span><strong>Carregar Projeto</strong></button>
                </div>
            )}

            {modalAberto === 'SALVAR' && (
                <ModalAreaInterativa3D titulo="Salvar Projeto" subtitulo={estado.projetoAberto === null ? 'Novo projeto' : `Atualizando ${estado.projetoAberto.nome}`} ariaLabel="Salvar projeto 3D" fecha={fechaModal}>
                    <form className={styles.formularioProjetoEditor3D} onSubmit={salvaProjeto}>
                        <label htmlFor="nome-projeto-editor-3d">Nome do projeto</label>
                        <input id="nome-projeto-editor-3d" type="text" value={nomeProjeto} onChange={evento => setNomeProjeto(evento.currentTarget.value)} maxLength={120} autoFocus />

                        {statusSalvar !== null && <div className={`${styles.statusProjetoEditor3D} ${statusSalvar.bloqueado ? styles.statusProjetoEditor3DBloqueado : ''}`}>{statusSalvar.texto}</div>}

                        <div className={styles.acoesFormularioProjetoEditor3D}>
                            <button type="submit" disabled={salvando}>{salvando ? 'Salvando' : 'Confirmar Salvamento'}</button>
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
        </div>
    );
};
