'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { ColecaoCenaEditor3D, PosicaoSoltarCenaEditor3D } from '../estado/editor3D.estado.types';
import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';
import type { ObjetoCenaEditor3D, TipoMalhaEditor3D } from '../editor/editor3D.tipos';

type TipoEdicaoNomeCenaEditor3D = 'OBJETO' | 'COLECAO';
type TipoArrasteCenaEditor3D = 'OBJETO' | 'COLECAO';

interface EdicaoNomeCenaEditor3D {
    readonly tipo: TipoEdicaoNomeCenaEditor3D;
    readonly id: string;
    readonly valor: string;
};

interface ArrasteCenaEditor3D {
    readonly tipo: TipoArrasteCenaEditor3D;
    readonly id: string;
};

const CHAVE_DESTINO_RAIZ_CENA_EDITOR3D = 'RAIZ';

function obtemIconeObjeto(tipo: TipoMalhaEditor3D): string {
    if (tipo === 'VERTICE') return '•';
    if (tipo === 'PLANO_2D') return '▭';
    if (tipo === 'CIRCULO_2D') return '○';
    if (tipo === 'CUBO_3D') return '□';
    if (tipo === 'CILINDRO_3D') return '◉';

    return '●';
};

function obtemTipoObjeto(tipo: TipoMalhaEditor3D): string {
    if (tipo === 'VERTICE') return 'Vértice';
    if (tipo === 'PLANO_2D') return 'Plano';
    if (tipo === 'CIRCULO_2D') return 'Círculo';
    if (tipo === 'CUBO_3D') return 'Cubo';
    if (tipo === 'CILINDRO_3D') return 'Cilindro';

    return 'Esfera';
};

function criaChaveDestinoColecaoCenaEditor3D(idColecao: string): string { return `COLECAO:${idColecao}`; };
function criaChaveDestinoObjetoCenaEditor3D(idObjeto: string, posicao: PosicaoSoltarCenaEditor3D): string { return `OBJETO:${idObjeto}:${posicao}`; };
function criaChaveDestinoOrdemColecaoCenaEditor3D(idColecao: string, posicao: PosicaoSoltarCenaEditor3D): string { return `ORDEM_COLECAO:${idColecao}:${posicao}`; };
function objetoExisteEditor3D(objeto: ObjetoCenaEditor3D | null): objeto is ObjetoCenaEditor3D { return objeto !== null; };

function obtemPosicaoSoltarElementoEditor3D(event: DragEvent<HTMLElement>): PosicaoSoltarCenaEditor3D {
    const rect = event.currentTarget.getBoundingClientRect();
    const meio = rect.top + (rect.height / 2);

    return event.clientY >= meio ? 'DEPOIS' : 'ANTES';
};

export function PainelCenaColecaoEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const [colecoesAbertas, setColecoesAbertas] = useState<Record<string, boolean>>({});
    const [edicaoNome, setEdicaoNome] = useState<EdicaoNomeCenaEditor3D | null>(null);
    const [arrasteAtual, setArrasteAtual] = useState<ArrasteCenaEditor3D | null>(null);
    const [chaveDestinoArraste, setChaveDestinoArraste] = useState<string | null>(null);
    const editandoGeometria = estado.modoOperacao === 'EDICAO';

    function colecaoEstaAberta(idColecao: string): boolean { return colecoesAbertas[idColecao] ?? true; };

    function alternaColecao(event: MouseEvent<HTMLButtonElement>, idColecao: string): void {
        event.preventDefault();
        event.stopPropagation();
        setColecoesAbertas(estadoAtual => ({ ...estadoAtual, [idColecao]: !(estadoAtual[idColecao] ?? true) }));
    };

    function criaColecao(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        event.stopPropagation();
        acoes.criaColecaoCena();
    };

    function selecionaColecao(event: MouseEvent<HTMLButtonElement>, idColecao: string): void {
        if (editandoGeometria) return;

        event.preventDefault();
        event.stopPropagation();
        acoes.selecionaColecaoCena(idColecao);
    };

    function selecionaObjeto(event: MouseEvent<HTMLButtonElement>, idObjeto: string): void {
        if (editandoGeometria) return;

        acoes.selecionaObjeto(idObjeto, event.shiftKey);
    };

    function alternaVisibilidadeObjeto(event: MouseEvent<HTMLButtonElement>, idObjeto: string): void {
        event.preventDefault();
        event.stopPropagation();
        acoes.alternaVisibilidadeObjeto(idObjeto);
    };

    function alternaVisibilidadeColecao(event: MouseEvent<HTMLButtonElement>, idColecao: string): void {
        event.preventDefault();
        event.stopPropagation();
        acoes.alternaVisibilidadeColecao(idColecao);
    };

    function iniciaEdicaoNomeObjeto(event: MouseEvent<HTMLButtonElement>, objeto: ObjetoCenaEditor3D): void {
        if (editandoGeometria) return;

        event.preventDefault();
        event.stopPropagation();
        setEdicaoNome({ tipo: 'OBJETO', id: objeto.id, valor: objeto.nome });
    };

    function iniciaEdicaoNomeColecao(event: MouseEvent<HTMLButtonElement>, colecao: ColecaoCenaEditor3D): void {
        if (editandoGeometria) return;

        event.preventDefault();
        event.stopPropagation();
        setEdicaoNome({ tipo: 'COLECAO', id: colecao.id, valor: colecao.nome });
    };

    function atualizaNomeEmEdicao(valor: string): void { setEdicaoNome(edicaoAtual => edicaoAtual === null ? null : { ...edicaoAtual, valor }); };

    function cancelaEdicaoNome(): void { setEdicaoNome(null); };

    function confirmaEdicaoNome(): void {
        if (edicaoNome === null) return;

        if (edicaoNome.tipo === 'OBJETO') acoes.renomeiaObjetoCena(edicaoNome.id, edicaoNome.valor);
        if (edicaoNome.tipo === 'COLECAO') acoes.renomeiaColecaoCena(edicaoNome.id, edicaoNome.valor);

        setEdicaoNome(null);
    };

    function processaTeclaEdicaoNome(event: KeyboardEvent<HTMLInputElement>): void {
        event.stopPropagation();

        if (event.key === 'Enter') {
            event.preventDefault();
            confirmaEdicaoNome();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            cancelaEdicaoNome();
        }
    };

    function iniciaArrasteObjeto(event: DragEvent<HTMLDivElement>, idObjeto: string): void {
        if (editandoGeometria) return;

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', idObjeto);
        setArrasteAtual({ tipo: 'OBJETO', id: idObjeto });
    };

    function iniciaArrasteColecao(event: DragEvent<HTMLDivElement>, idColecao: string): void {
        if (editandoGeometria) return;

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', idColecao);
        setArrasteAtual({ tipo: 'COLECAO', id: idColecao });
    };

    function encerraArraste(): void {
        setArrasteAtual(null);
        setChaveDestinoArraste(null);
    };

    function removeRealceDestinoArraste(event: DragEvent<HTMLElement>, chaveDestino: string): void {
        if (chaveDestinoArraste !== chaveDestino) return;
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;

        event.preventDefault();
        setChaveDestinoArraste(null);
    };

    function processaEntradaArrasteObjetoEmRaiz(event: DragEvent<HTMLElement>): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        setChaveDestinoArraste(CHAVE_DESTINO_RAIZ_CENA_EDITOR3D);
    };

    function processaEntradaArrasteObjetoEmColecao(event: DragEvent<HTMLElement>, idColecao: string): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        setChaveDestinoArraste(criaChaveDestinoColecaoCenaEditor3D(idColecao));
    };

    function processaEntradaArrasteObjetoEmObjeto(event: DragEvent<HTMLElement>, idObjetoReferencia: string): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();

        if (arrasteAtual.id === idObjetoReferencia) {
            setChaveDestinoArraste(null);

            return;
        }

        const posicao = obtemPosicaoSoltarElementoEditor3D(event);

        event.dataTransfer.dropEffect = 'move';
        setChaveDestinoArraste(criaChaveDestinoObjetoCenaEditor3D(idObjetoReferencia, posicao));
    };

    function processaEntradaArrasteColecaoEmColecao(event: DragEvent<HTMLElement>, idColecaoReferencia: string): void {
        if (arrasteAtual?.tipo !== 'COLECAO') return;

        event.preventDefault();
        event.stopPropagation();

        if (arrasteAtual.id === idColecaoReferencia) {
            setChaveDestinoArraste(null);

            return;
        }

        const posicao = obtemPosicaoSoltarElementoEditor3D(event);

        event.dataTransfer.dropEffect = 'move';
        setChaveDestinoArraste(criaChaveDestinoOrdemColecaoCenaEditor3D(idColecaoReferencia, posicao));
    };

    function soltaObjetoNaRaiz(event: DragEvent<HTMLElement>): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();
        acoes.moveObjetoParaColecaoCena(arrasteAtual.id, null, null, null);
        encerraArraste();
    };

    function soltaObjetoNaColecao(event: DragEvent<HTMLElement>, idColecao: string): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();
        acoes.moveObjetoParaColecaoCena(arrasteAtual.id, idColecao, null, null);
        encerraArraste();
    };

    function soltaObjetoEmObjeto(event: DragEvent<HTMLElement>, idColecao: string | null, idObjetoReferencia: string): void {
        if (arrasteAtual?.tipo !== 'OBJETO') return;

        event.preventDefault();
        event.stopPropagation();

        if (arrasteAtual.id === idObjetoReferencia) {
            encerraArraste();

            return;
        }

        acoes.moveObjetoParaColecaoCena(arrasteAtual.id, idColecao, idObjetoReferencia, obtemPosicaoSoltarElementoEditor3D(event));
        encerraArraste();
    };

    function soltaColecaoEmColecao(event: DragEvent<HTMLElement>, idColecaoReferencia: string): void {
        if (arrasteAtual?.tipo !== 'COLECAO') return;

        event.preventDefault();
        event.stopPropagation();

        if (arrasteAtual.id === idColecaoReferencia) {
            encerraArraste();

            return;
        }

        acoes.moveColecaoCena(arrasteAtual.id, idColecaoReferencia, obtemPosicaoSoltarElementoEditor3D(event));
        encerraArraste();
    };

    function objetoEstaEmAlgumaColecao(idObjeto: string): boolean { return estado.colecoes.some(colecao => colecao.idsObjetos.includes(idObjeto)); };

    function obtemObjetosRaiz(): ObjetoCenaEditor3D[] { return estado.objetos.filter(objeto => !objetoEstaEmAlgumaColecao(objeto.id)); };

    function obtemObjetosColecao(colecao: ColecaoCenaEditor3D): ObjetoCenaEditor3D[] { return colecao.idsObjetos.map(idObjeto => estado.objetos.find(objeto => objeto.id === idObjeto) ?? null).filter(objetoExisteEditor3D); };

    function colecaoEstaOculta(colecao: ColecaoCenaEditor3D): boolean { return estado.idsColecoesOcultas.includes(colecao.id); };

    function estaEditandoNome(tipo: TipoEdicaoNomeCenaEditor3D, id: string): boolean { return edicaoNome?.tipo === tipo && edicaoNome.id === id; };

    function renderizaEditorNomeObjeto(objeto: ObjetoCenaEditor3D) {
        return (
            <div className={styles.editorNomeObjetoCena}>
                <span className={styles.espacoArvore} />
                <span className={styles.iconeObjetoCena}>{obtemIconeObjeto(objeto.tipo)}</span>
                <input type="text" value={edicaoNome?.valor ?? objeto.nome} autoFocus onChange={event => atualizaNomeEmEdicao(event.target.value)} onBlur={confirmaEdicaoNome} onKeyDown={processaTeclaEdicaoNome} />
            </div>
        );
    };

    function renderizaEditorNomeColecao(colecao: ColecaoCenaEditor3D) {
        return (
            <div className={styles.editorNomeColecaoCena}>
                <span className={styles.iconeColecao}>▣</span>
                <input type="text" value={edicaoNome?.valor ?? colecao.nome} autoFocus onChange={event => atualizaNomeEmEdicao(event.target.value)} onBlur={confirmaEdicaoNome} onKeyDown={processaTeclaEdicaoNome} />
            </div>
        );
    };

    function renderizaObjeto(objeto: ObjetoCenaEditor3D, idColecaoContainer: string | null) {
        const objetoOculto = estado.idsObjetosOcultos.includes(objeto.id);
        const objetoArrastado = arrasteAtual?.tipo === 'OBJETO' && arrasteAtual.id === objeto.id;
        const chaveDestinoAntes = criaChaveDestinoObjetoCenaEditor3D(objeto.id, 'ANTES');
        const chaveDestinoDepois = criaChaveDestinoObjetoCenaEditor3D(objeto.id, 'DEPOIS');
        const objetoRecebendoArrasteAntes = chaveDestinoArraste === chaveDestinoAntes;
        const objetoRecebendoArrasteDepois = chaveDestinoArraste === chaveDestinoDepois;

        return (
            <div key={objeto.id} className={`${styles.linhaObjetoCena} ${estado.idsObjetosSelecionados.includes(objeto.id) ? styles.linhaObjetoCenaSelecionado : ''} ${objetoOculto ? styles.linhaObjetoCenaOculto : ''} ${objetoArrastado ? styles.linhaObjetoCenaArrastando : ''} ${objetoRecebendoArrasteAntes ? styles.linhaObjetoCenaRecebendoArrasteAntes : ''} ${objetoRecebendoArrasteDepois ? styles.linhaObjetoCenaRecebendoArrasteDepois : ''}`} draggable={!editandoGeometria} onDragStart={event => iniciaArrasteObjeto(event, objeto.id)} onDragEnd={encerraArraste} onDragOver={event => processaEntradaArrasteObjetoEmObjeto(event, objeto.id)} onDragLeave={event => removeRealceDestinoArraste(event, objetoRecebendoArrasteAntes ? chaveDestinoAntes : chaveDestinoDepois)} onDrop={event => soltaObjetoEmObjeto(event, idColecaoContainer, objeto.id)}>
                {estaEditandoNome('OBJETO', objeto.id) ? renderizaEditorNomeObjeto(objeto) : (
                    <button className={styles.botaoConteudoObjetoCena} type="button" disabled={editandoGeometria} onClick={event => selecionaObjeto(event, objeto.id)} onDoubleClick={event => iniciaEdicaoNomeObjeto(event, objeto)} aria-pressed={estado.idsObjetosSelecionados.includes(objeto.id)}>
                        <span className={styles.espacoArvore} />
                        <span className={styles.iconeObjetoCena}>{obtemIconeObjeto(objeto.tipo)}</span>
                        <span className={styles.nomeObjetoCena}>{objeto.nome}</span>
                        <strong>{obtemTipoObjeto(objeto.tipo)}</strong>
                    </button>
                )}

                <button className={styles.botaoVisibilidadeObjetoCena} type="button" onClick={event => alternaVisibilidadeObjeto(event, objeto.id)} aria-pressed={!objetoOculto} aria-label={objetoOculto ? `Mostrar ${objeto.nome}` : `Ocultar ${objeto.nome}`} title={objetoOculto ? 'Mostrar objeto' : 'Ocultar objeto'}>
                    {objetoOculto ? '⊘' : '👁'}
                </button>
            </div>
        );
    };

    function renderizaColecao(colecao: ColecaoCenaEditor3D) {
        const colecaoAberta = colecaoEstaAberta(colecao.id);
        const objetosColecao = obtemObjetosColecao(colecao);
        const colecaoSelecionada = estado.idColecaoSelecionada === colecao.id;
        const colecaoOculta = colecaoEstaOculta(colecao);
        const colecaoArrastada = arrasteAtual?.tipo === 'COLECAO' && arrasteAtual.id === colecao.id;
        const chaveDestinoColecao = criaChaveDestinoColecaoCenaEditor3D(colecao.id);
        const chaveDestinoOrdemAntes = criaChaveDestinoOrdemColecaoCenaEditor3D(colecao.id, 'ANTES');
        const chaveDestinoOrdemDepois = criaChaveDestinoOrdemColecaoCenaEditor3D(colecao.id, 'DEPOIS');
        const colecaoRecebendoObjeto = chaveDestinoArraste === chaveDestinoColecao;
        const colecaoRecebendoOrdemAntes = chaveDestinoArraste === chaveDestinoOrdemAntes;
        const colecaoRecebendoOrdemDepois = chaveDestinoArraste === chaveDestinoOrdemDepois;

        return (
            <div key={colecao.id} className={`${styles.blocoColecaoCena} ${colecaoRecebendoObjeto ? styles.blocoColecaoCenaRecebendoArraste : ''}`} onDragOver={event => processaEntradaArrasteObjetoEmColecao(event, colecao.id)} onDragLeave={event => removeRealceDestinoArraste(event, chaveDestinoColecao)} onDrop={event => soltaObjetoNaColecao(event, colecao.id)}>
                <div className={`${styles.linhaColecao} ${colecaoSelecionada ? styles.linhaColecaoSelecionada : ''} ${colecaoOculta ? styles.linhaColecaoOculta : ''} ${colecaoArrastada ? styles.linhaColecaoArrastando : ''} ${colecaoRecebendoOrdemAntes ? styles.linhaColecaoRecebendoArrasteAntes : ''} ${colecaoRecebendoOrdemDepois ? styles.linhaColecaoRecebendoArrasteDepois : ''}`} draggable={!editandoGeometria} onDragStart={event => iniciaArrasteColecao(event, colecao.id)} onDragEnd={encerraArraste} onDragOver={event => processaEntradaArrasteColecaoEmColecao(event, colecao.id)} onDragLeave={event => removeRealceDestinoArraste(event, colecaoRecebendoOrdemAntes ? chaveDestinoOrdemAntes : chaveDestinoOrdemDepois)} onDrop={event => soltaColecaoEmColecao(event, colecao.id)}>
                    <button className={styles.botaoAlternarColecaoCena} type="button" onClick={event => alternaColecao(event, colecao.id)} aria-label={colecaoAberta ? `Colapsar ${colecao.nome}` : `Expandir ${colecao.nome}`} aria-expanded={colecaoAberta}>
                        <span className={styles.indicadorArvore}>{colecaoAberta ? '▾' : '▸'}</span>
                    </button>

                    {estaEditandoNome('COLECAO', colecao.id) ? renderizaEditorNomeColecao(colecao) : (
                        <button className={styles.botaoConteudoColecaoCena} type="button" disabled={editandoGeometria} onClick={event => selecionaColecao(event, colecao.id)} onDoubleClick={event => iniciaEdicaoNomeColecao(event, colecao)} aria-pressed={colecaoSelecionada}>
                            <span className={styles.iconeColecao}>▣</span>
                            <strong>{colecao.nome}</strong>
                            <small>{objetosColecao.length}</small>
                        </button>
                    )}

                    <button className={styles.botaoVisibilidadeColecaoCena} type="button" onClick={event => alternaVisibilidadeColecao(event, colecao.id)} aria-pressed={!colecaoOculta} aria-label={colecaoOculta ? `Mostrar ${colecao.nome}` : `Ocultar ${colecao.nome}`} title={colecaoOculta ? 'Mostrar coleção' : 'Ocultar coleção'}>
                        {colecaoOculta ? '⊘' : '👁'}
                    </button>
                </div>

                {colecaoAberta && objetosColecao.map(objeto => renderizaObjeto(objeto, colecao.id))}
            </div>
        );
    };

    return (
        <PainelColapsavelEditor3D titulo="Coleção da Cena" valor={String(estado.objetos.length)}>
            <div className={styles.arvoreCena}>
                <div className={styles.acoesArvoreCena}>
                    <button className={styles.botaoCriarColecaoCena} type="button" onClick={criaColecao}>
                        <span>+</span>
                        <strong>Nova coleção</strong>
                    </button>
                </div>

                {editandoGeometria && <div className={styles.avisoModoEdicaoCena}>Modo de edição ativo: seleção de objetos travada.</div>}

                <div className={`${styles.blocoRaizCena} ${chaveDestinoArraste === CHAVE_DESTINO_RAIZ_CENA_EDITOR3D ? styles.blocoRaizCenaRecebendoArraste : ''}`} onDragOver={processaEntradaArrasteObjetoEmRaiz} onDragLeave={event => removeRealceDestinoArraste(event, CHAVE_DESTINO_RAIZ_CENA_EDITOR3D)} onDrop={soltaObjetoNaRaiz}>
                    <button className={styles.linhaObjetoCena} type="button" disabled={editandoGeometria} onClick={() => acoes.selecionaObjeto(null)}>
                        <span className={styles.espacoArvore} />
                        <span className={styles.iconeOrigem}>◎</span>
                        <span className={styles.nomeObjetoCena}>Origem</span>
                        <strong>0, 0, 0</strong>
                    </button>

                    {obtemObjetosRaiz().map(objeto => renderizaObjeto(objeto, null))}
                </div>

                {estado.colecoes.map(renderizaColecao)}
            </div>
        </PainelColapsavelEditor3D>
    );
};