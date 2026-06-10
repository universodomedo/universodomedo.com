'use client';

import styles from './styles.module.css';
import stylesProjeto from '../projeto/styles.module.css';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useMemo, useState, type FormEvent, type ReactElement } from 'react';
import { EventosApiRest } from 'types-nora-api/api/rest';

import { MENUS_EDITOR_3D, itemMenuEditor3DEstaDesabilitado, itemMenuEditor3DEstaVisivel, obtemRotuloItemMenuEditor3D, type ContextoMenuEditor3D, type IdComandoMenuEditor3D, type ItemMenuEditor3D, type MenuEditor3D, type PermissaoMenuEditor3D } from './editor3D.menus.definicoes';
import { NoraApi } from 'Api/NoraApi';
import { ModalAreaInterativa3D } from '../modal/ModalAreaInterativa3D';
import { abaProjeto3DTemAlteracaoNaoSalvaEditor3D, obtemAbaProjeto3DAtivaAtualEditor3D } from '../estado/editor3D.abasProjeto';
import { criaPayloadSalvarNovoProjetoEditor3D, criaPayloadSalvarProjetoAtualEditor3D, obtemBloqueioSalvamentoProjetoEditor3D } from '../projeto/editor3D.projeto.salvamento';
import { obtemBloqueioCarregamentoCenaCanonicaEditor3D } from '../editor/editor3D.cenaCanonica.carregamento';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { Projeto3DResumoPersistido } from 'types-nora-api/shared';

type ModalMenuEditor3D = 'SALVAR_NOVO' | 'CARREGAR';

interface StatusMenuProjetoEditor3D {
    readonly texto: string;
    readonly bloqueado: boolean;
};

function formataDataAtualizacaoProjetoEditor3D(dataAtualizacao: string): string {
    const data = new Date(dataAtualizacao);

    if (Number.isNaN(data.getTime())) return dataAtualizacao;

    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

function obtemMensagemErroPadraoProjetoEditor3D(operacao: string): string { return `Falha ao ${operacao} projeto 3D.`; };

export function BarraMenusEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const [indiceMenuAberto, setIndiceMenuAberto] = useState<number | null>(null);
    const [modalAberto, setModalAberto] = useState<ModalMenuEditor3D | null>(null);
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [statusSalvar, setStatusSalvar] = useState<StatusMenuProjetoEditor3D | null>(null);
    const [statusCarregar, setStatusCarregar] = useState<StatusMenuProjetoEditor3D | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [carregandoListagem, setCarregandoListagem] = useState(false);
    const [idProjetoCarregando, setIdProjetoCarregando] = useState<number | null>(null);
    const [projetos, setProjetos] = useState<Projeto3DResumoPersistido[]>([]);
    const permissoes = useMemo<readonly PermissaoMenuEditor3D[]>(() => [], []);
    const abaAtiva = obtemAbaProjeto3DAtivaAtualEditor3D(estado);
    const temAlteracaoNaoSalva = abaAtiva === null ? false : abaProjeto3DTemAlteracaoNaoSalvaEditor3D(abaAtiva);
    const motivoBloqueioSalvar = obtemBloqueioSalvamentoProjetoEditor3D(estado);
    const motivoBloqueioCarregar = obtemBloqueioCarregamentoCenaCanonicaEditor3D(estado);
    const contextoMenu: ContextoMenuEditor3D = {
        permissoes,
        podeCriarNovoProjeto: motivoBloqueioCarregar === null,
        podeSalvarNovoProjeto: motivoBloqueioSalvar === null && !salvando,
        podeSalvarProjetoAtual: estado.projetoAberto !== null && temAlteracaoNaoSalva && motivoBloqueioSalvar === null && !salvando,
        podeCarregarProjeto: motivoBloqueioCarregar === null && !carregandoListagem,
        salvandoProjeto: salvando,
        carregandoProjeto: carregandoListagem || idProjetoCarregando !== null,
        projetoAberto: estado.projetoAberto !== null,
    };

    function fechaMenus(): void { setIndiceMenuAberto(null); };

    function fechaModal(): void {
        setModalAberto(null);
        setStatusSalvar(null);
        setStatusCarregar(null);
        setIdProjetoCarregando(null);
    };

    function abreNovoProjeto(): void {
        if (motivoBloqueioCarregar !== null) {
            setStatusSalvar({ texto: motivoBloqueioCarregar, bloqueado: true });

            return;
        }

        acoes.criaNovaAbaProjeto3D();
        setStatusSalvar(null);
        fechaMenus();
    };

    function abreSalvarNovoProjeto(): void {
        if (motivoBloqueioSalvar !== null) {
            setStatusSalvar({ texto: motivoBloqueioSalvar, bloqueado: true });

            return;
        }

        fechaMenus();
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
        } catch {
            setStatusCarregar({ texto: obtemMensagemErroPadraoProjetoEditor3D('listar'), bloqueado: true });
        } finally {
            setCarregandoListagem(false);
        }
    };

    function abreCarregarProjeto(): void {
        if (motivoBloqueioCarregar !== null) {
            setStatusCarregar({ texto: motivoBloqueioCarregar, bloqueado: true });

            return;
        }

        fechaMenus();
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

        if (!temAlteracaoNaoSalva) {
            setStatusSalvar({ texto: 'O projeto atual nao possui alteracoes para salvar.', bloqueado: true });

            return;
        }

        if (motivoBloqueioSalvar !== null) {
            setStatusSalvar({ texto: motivoBloqueioSalvar, bloqueado: true });

            return;
        }

        const payload = criaPayloadSalvarProjetoAtualEditor3D(estado);

        if (payload === null) {
            setStatusSalvar({ texto: 'Nenhum projeto aberto para atualizar.', bloqueado: true });

            return;
        }

        fechaMenus();
        setSalvando(true);
        setStatusSalvar({ texto: `Salvando projeto atual: ${estado.projetoAberto.nome}...`, bloqueado: false });

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, payload, { mensagemErro: 'Falha ao salvar projeto atual 3D' });

            acoes.marcaAbaProjeto3DSalva({ id: projeto.id, nome: projeto.nome });
            setStatusSalvar({ texto: `Projeto atual salvo: ${projeto.nome}.`, bloqueado: false });
        } catch {
            setStatusSalvar({ texto: obtemMensagemErroPadraoProjetoEditor3D('salvar o'), bloqueado: true });
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

        if (motivoBloqueioSalvar !== null) {
            setStatusSalvar({ texto: motivoBloqueioSalvar, bloqueado: true });

            return;
        }

        const payload = criaPayloadSalvarNovoProjetoEditor3D(estado, nome);

        setSalvando(true);
        setStatusSalvar({ texto: 'Salvando novo projeto...', bloqueado: false });

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, payload, { mensagemErro: 'Falha ao salvar projeto 3D' });

            acoes.marcaAbaProjeto3DSalva({ id: projeto.id, nome: projeto.nome });
            setNomeProjeto(projeto.nome);
            setStatusSalvar({ texto: `Novo projeto salvo: ${projeto.nome}.`, bloqueado: false });
        } catch {
            setStatusSalvar({ texto: obtemMensagemErroPadraoProjetoEditor3D('salvar novo'), bloqueado: true });
        } finally {
            setSalvando(false);
        }
    };

    async function carregaProjeto(projetoResumo: Projeto3DResumoPersistido): Promise<void> {
        if (motivoBloqueioCarregar !== null) {
            setStatusCarregar({ texto: motivoBloqueioCarregar, bloqueado: true });

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

            acoes.carregaProjetoCanonicoEmAba(projeto);
            fechaModal();
        } catch {
            setStatusCarregar({ texto: obtemMensagemErroPadraoProjetoEditor3D('carregar'), bloqueado: true });
        } finally {
            setIdProjetoCarregando(null);
        }
    };

    function executaComando(comando: IdComandoMenuEditor3D): void {
        if (comando === 'NOVO_PROJETO') abreNovoProjeto();
        if (comando === 'SALVAR_NOVO_PROJETO') abreSalvarNovoProjeto();
        if (comando === 'SALVAR_PROJETO_ATUAL') void salvaProjetoAtual();
        if (comando === 'CARREGAR_PROJETO') abreCarregarProjeto();
    };

    function renderizaItensMenu(itens: readonly ItemMenuEditor3D[]): ReactElement[] {
        return itens.filter(item => itemMenuEditor3DEstaVisivel(item, contextoMenu)).map(item => {
            const disabled = itemMenuEditor3DEstaDesabilitado(item, contextoMenu);
            const rotulo = obtemRotuloItemMenuEditor3D(item, contextoMenu);
            const itensFilhos = item.itens?.filter(itemFilho => itemMenuEditor3DEstaVisivel(itemFilho, contextoMenu)) ?? [];
            const temSubmenu = itensFilhos.length > 0;

            return (
                <div key={rotulo} className={styles.itemMenuEditor3D}>
                    <button type="button" disabled={disabled} onClick={() => item.comando !== undefined && executaComando(item.comando)}>
                        <span>{rotulo}</span>
                        {temSubmenu && <ChevronRightIcon />}
                    </button>

                    {temSubmenu && <div className={styles.submenuEditor3D}>{renderizaItensMenu(itensFilhos)}</div>}
                </div>
            );
        });
    };

    function renderizaMenu(menu: MenuEditor3D, indice: number): ReactElement {
        const aberto = indiceMenuAberto === indice;

        return (
            <div key={menu.rotulo} className={styles.menuEditor3D} onMouseEnter={() => indiceMenuAberto !== null && setIndiceMenuAberto(indice)}>
                <button type="button" className={aberto ? styles.botaoMenuEditor3DAtivo : ''} onClick={() => setIndiceMenuAberto(indiceAtual => indiceAtual === indice ? null : indice)} aria-expanded={aberto}>{menu.rotulo}</button>
                {aberto && <div className={styles.listaItensMenuEditor3D}>{renderizaItensMenu(menu.itens)}</div>}
            </div>
        );
    };

    return (
        <>
            <section className={styles.barraMenusEditor3D} data-editor3d-shell="true" aria-label="Menus do Editor 3D" onMouseLeave={fechaMenus}>
                {MENUS_EDITOR_3D.map(renderizaMenu)}
                {statusSalvar !== null && modalAberto === null && <div className={`${styles.statusBarraMenusEditor3D} ${statusSalvar.bloqueado ? styles.statusBarraMenusEditor3DBloqueado : ''}`}>{statusSalvar.texto}</div>}
            </section>

            {modalAberto === 'SALVAR_NOVO' && (
                <ModalAreaInterativa3D titulo={estado.projetoAberto === null ? 'Salvar Novo Projeto' : 'Salvar Como'} subtitulo="Criando novo projeto" ariaLabel="Salvar novo projeto 3D" fecha={fechaModal}>
                    <form className={stylesProjeto.formularioProjetoEditor3D} onSubmit={salvaNovoProjeto}>
                        <label htmlFor="nome-projeto-editor-3d">Nome do novo projeto</label>
                        <input id="nome-projeto-editor-3d" type="text" value={nomeProjeto} onChange={evento => setNomeProjeto(evento.currentTarget.value)} maxLength={120} autoFocus />

                        {statusSalvar !== null && <div className={`${stylesProjeto.statusProjetoEditor3D} ${statusSalvar.bloqueado ? stylesProjeto.statusProjetoEditor3DBloqueado : ''}`}>{statusSalvar.texto}</div>}

                        <div className={stylesProjeto.acoesFormularioProjetoEditor3D}>
                            <button type="submit" disabled={salvando}>{salvando ? 'Salvando' : 'Criar Novo Projeto'}</button>
                        </div>
                    </form>
                </ModalAreaInterativa3D>
            )}

            {modalAberto === 'CARREGAR' && (
                <ModalAreaInterativa3D titulo="Carregar Projeto" subtitulo="Projetos salvos" ariaLabel="Carregar projeto 3D" fecha={fechaModal}>
                    <div className={stylesProjeto.listagemProjetosEditor3D}>
                        <div className={stylesProjeto.acoesListagemProjetosEditor3D}>
                            <button type="button" onClick={carregaListagemProjetos} disabled={carregandoListagem}>{carregandoListagem ? 'Atualizando' : 'Atualizar Lista'}</button>
                        </div>

                        {statusCarregar !== null && <div className={`${stylesProjeto.statusProjetoEditor3D} ${statusCarregar.bloqueado ? stylesProjeto.statusProjetoEditor3DBloqueado : ''}`}>{statusCarregar.texto}</div>}

                        <div className={stylesProjeto.itensListagemProjetosEditor3D}>
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