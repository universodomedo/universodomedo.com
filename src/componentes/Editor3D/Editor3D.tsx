'use client';

import styles from './Editor3D.module.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { BufferAttribute, BufferGeometry, Color, Object3D, Vector3 } from 'three';
import type { Mesh } from 'three';
import type { CorpoPersonagemCenaCanonicaEditor3D, MembroPersonagemEditor3D, PecaPersonagemCenaCanonicaEditor3D, Projeto3DResumoPersistido, TipoProjetoEditor3D } from 'types-nora-api';

import { CORPO_PERSONAGEM_PADRAO_EDITOR3D, ancoraPunhoCorpoPersonagem, ancoraRegiaoCorpoPersonagem, escalaMaoCorpoPersonagem, geraGeometriaCorpoPersonagem } from 'Funcionalidades/CorpoPersonagem/corpoPersonagem.gerador';
import { criaMalhaMaoSuavizadaCorpoPersonagem } from './corpoPersonagem.maos';

import { ALTURA_ARTE_DE_CAPA, LARGURA_ARTE_DE_CAPA, type ArteDeCapa } from 'Funcionalidades/ArteDeCapa/arteDeCapa.types';
import { salvaArteDeCapa } from 'Funcionalidades/ArteDeCapa/arteDeCapa.storage';
import { BarraMenusEditor3D } from './BarraMenusEditor3D';
import { BarraAbasEditor3D } from './BarraAbasEditor3D';
import { SeletorModoEditor3D } from './SeletorModoEditor3D';
import { BotaoComandoEditor3D } from './BotaoComandoEditor3D';
import { PainelLateralEditor3D, type ColecaoArvoreEditor3D, type ObjetoResumoEditor3D } from './PainelLateralEditor3D';
import { ModalSalvarProjetoEditor3D } from './ModalSalvarProjetoEditor3D';
import { ModalAbrirProjetoEditor3D } from './ModalAbrirProjetoEditor3D';
import { CAMERA_PADRAO_CAPA_ARTE_EDITOR3D, CAPA_ARTE_PADRAO_EDITOR3D, COR_OBJETO_PADRAO_EDITOR3D, capaArteDaCena, cameraDaCena, corpoPersonagemDaCena, desserializaCenaCanonicaEditor3D, pecasDaCena, restringeTextoNaCameraEditor3D, serializaCenaCanonicaEditor3D, tipoProjetoDaCena, type CameraEditor3D, type CapaArteEditor3D, type EntradaSerializacaoObjetoEditor3D, type ObjetoCarregadoEditor3D, type TipoPrimitivaEditor3D, type TransformEditor3D } from './editor3D.projeto.serializacao';
import { consultaProjeto3D, listaProjetos3D, salvaProjeto3D } from './editor3D.projeto.api';
import type { ComandoMenuEditor3D } from './editor3D.menus';
import { SELECAO_CAMERA_EDITOR3D, SELECAO_CORPO_PERSONAGEM_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D, type CampoTransformEditor3D, type ModoTransformEditor3D } from './editor3D.tipos';
import { MAXIMO_SUBDIVISAO_MALHA_EDITOR3D, arestasDaMalha, centroideDaMalha, chanframaAresta, cortaAnelAresta, criaGeometriaDeMalha, criaMalhaCilindro, criaMalhaCubo, criaMalhaEsfera, espelhaMalhaX, excluiFacesDaMalha, excluiVerticesDaMalha, extrudaFace, fundeVerticesDaMalha, insetaFace, subdivideMalhaCatmullClark, type MalhaEditavelLocal, type Vetor3Malha } from './editor3D.malha';
import { BarraEdicaoMalhaEditor3D, type ModoSelecaoEdicaoEditor3D } from './BarraEdicaoMalhaEditor3D';
import { PainelParametrizacaoMeshEditor3D, type CampoVetorCriacaoEditor3D, type ParamCriacaoMalhaEditor3D } from './PainelParametrizacaoMeshEditor3D';
import { CameraCapaArteEditor3D, CameraPovEditor3D, PreviewVivoCapaArteEditor3D, RenderizadorCapaArteEditor3D, type RenderCapaArteEditor3D } from './CameraCapaArteEditor3D';
import { TituloCapaArteEditor3D } from './TituloCapaArteEditor3D';
import type { CampoVetorCameraCapaArteEditor3D } from './PainelCameraCapaArteEditor3D';
import { HomeEditor3D } from './HomeEditor3D';

type ModoOperacaoEditor3D = 'OBJETO' | 'EDICAO';
type ObjetoEditor3D = { id: number; tipo: TipoPrimitivaEditor3D; nome: string; cor: string; idPeca: string | null; visivel: boolean; malha: MalhaEditavelLocal; subdivisao: number; transformInicial: TransformEditor3D; };

const ROTULO_REGIAO_CORPO_EDITOR3D: Record<MembroPersonagemEditor3D, string> = { CABECA: 'Cabeça', TRONCO: 'Tronco', BRACO_ESQUERDO: 'Braço Esquerdo', BRACO_DIREITO: 'Braço Direito', PERNA_ESQUERDA: 'Perna Esquerda', PERNA_DIREITA: 'Perna Direita' };
const REGIOES_CORPO_EDITOR3D: readonly MembroPersonagemEditor3D[] = ['CABECA', 'TRONCO', 'BRACO_ESQUERDO', 'BRACO_DIREITO', 'PERNA_ESQUERDA', 'PERNA_DIREITA'];

function criaMalhaPrimitiva(tipo: TipoPrimitivaEditor3D, segmentos = 24): MalhaEditavelLocal { return tipo === 'CUBO' ? criaMalhaCubo() : tipo === 'CILINDRO' ? criaMalhaCilindro(segmentos) : criaMalhaEsfera(segmentos); };
type ColecaoEditor3D = { id: number; nome: string; idsObjetos: readonly number[]; visivel: boolean; };
type ProjetoAbertoEditor3D = { id: number; nome: string; };
type CenaArmazenadaEditor3D = { readonly objetos: readonly ObjetoEditor3D[]; readonly colecoes: readonly ColecaoEditor3D[]; readonly pecas: readonly PecaPersonagemCenaCanonicaEditor3D[]; readonly corpoPersonagem: CorpoPersonagemCenaCanonicaEditor3D | null; readonly idSelecionado: number | null; readonly projetoAberto: ProjetoAbertoEditor3D | null; readonly alterado: boolean; readonly ehInicio: boolean; readonly tipoProjeto: TipoProjetoEditor3D; readonly camera: CameraEditor3D | null; readonly capaArte: CapaArteEditor3D; };
type AbaEditor3D = { readonly idAba: number; readonly nomePadrao: string; readonly cenaInativa: CenaArmazenadaEditor3D | null; };

// Cena ativa vive no estado plano; abas inativas guardam sua cena (com transforms já capturados das meshes). Coleções são organização de sessão (não vão para a CenaCanonica do banco). `ehInicio` = aba mostra a tela inicial (Home), ainda sem projeto/editor. `tipoProjeto`/`camera`/`capaArte`: projetos Capa de Arte carregam a câmera-output e os textos de overlay (título/assinatura).
const CENA_VAZIA_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: false, tipoProjeto: 'PADRAO', camera: null, capaArte: CAPA_ARTE_PADRAO_EDITOR3D };
const CENA_INICIO_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: true, tipoProjeto: 'PADRAO', camera: null, capaArte: CAPA_ARTE_PADRAO_EDITOR3D };
const CENA_CAPA_ARTE_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: false, tipoProjeto: 'CAPA_ARTE', camera: CAMERA_PADRAO_CAPA_ARTE_EDITOR3D, capaArte: CAPA_ARTE_PADRAO_EDITOR3D };

// Histórico de Desfazer/Refazer: snapshots da cena ativa (mesma captura usada pelas abas), com teto para não crescer sem limite.
const LIMITE_HISTORICO_EDITOR3D = 50;
// Janela de coalescência de operações contínuas (arrasto de slider/gizmo/digitação): só o primeiro evento da rajada registra histórico.
const JANELA_COALESCENCIA_HISTORICO_MS = 900;

const ROTULO_PRIMITIVA_EDITOR3D: Record<TipoPrimitivaEditor3D, string> = { CUBO: 'Cubo', CILINDRO: 'Cilindro', ESFERA: 'Esfera' };
const ICONE_PRIMITIVA_EDITOR3D: Record<TipoPrimitivaEditor3D, string> = { CUBO: '□', CILINDRO: '◉', ESFERA: '●' };
function rotuloTipoPrimitivaEditor3D(tipo: TipoPrimitivaEditor3D): string { return ROTULO_PRIMITIVA_EDITOR3D[tipo]; };
function iconeTipoPrimitivaEditor3D(tipo: TipoPrimitivaEditor3D): string { return ICONE_PRIMITIVA_EDITOR3D[tipo]; };

// Atalhos de modo (g/r/s) não devem disparar enquanto o usuário digita num campo (ex.: nome do projeto no modal).
function alvoEhCampoEditavelEditor3D(alvo: EventTarget | null): boolean {
    if (!(alvo instanceof HTMLElement)) return false;
    return alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable;
};

// O shell do app anima a escala do container na entrada; o R3F mede o canvas antes do layout assentar e fica em tamanho zero (cena preta). Reforçamos a remedição depois que assenta (mesmo padrão da Sala de Jogo R3F).
function useReforcaRedimensionamentoCanvas() {
    useEffect(() => {
        const tempos = [120, 360, 720].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, []);
};

function calculaPosicaoInicialObjeto(indice: number): [number, number, number] {
    return [(indice % 3 - 1) * 0.5, 0.5, (Math.floor(indice / 3) % 3 - 1) * 0.5];
};

// Redesenha o canvas do editor (qualquer tamanho) num canvas 2D de exatamente 1280x720 (cover, centralizado), garantindo a dimensão da Arte de Capa.
function reenquadraArteDeCapa(canvasOrigem: HTMLCanvasElement): string {
    const destino = document.createElement('canvas');
    destino.width = LARGURA_ARTE_DE_CAPA;
    destino.height = ALTURA_ARTE_DE_CAPA;
    const contexto = destino.getContext('2d');
    if (!contexto) return canvasOrigem.toDataURL('image/png');
    const escala = Math.max(LARGURA_ARTE_DE_CAPA / canvasOrigem.width, ALTURA_ARTE_DE_CAPA / canvasOrigem.height);
    const larguraDesenho = canvasOrigem.width * escala;
    const alturaDesenho = canvasOrigem.height * escala;
    contexto.drawImage(canvasOrigem, (LARGURA_ARTE_DE_CAPA - larguraDesenho) / 2, (ALTURA_ARTE_DE_CAPA - alturaDesenho) / 2, larguraDesenho, alturaDesenho);
    return destino.toDataURL('image/png');
};

export function Editor3D() {
    useReforcaRedimensionamentoCanvas();
    const [objetos, setObjetos] = useState<readonly ObjetoEditor3D[]>([]);
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
    const [modo, setModo] = useState<ModoTransformEditor3D>('translate');
    const [modoOperacao, setModoOperacao] = useState<ModoOperacaoEditor3D>('OBJETO');
    const [verticesSelecionados, setVerticesSelecionados] = useState<readonly number[]>([]);
    const [modoSelecaoEdicao, setModoSelecaoEdicao] = useState<ModoSelecaoEdicaoEditor3D>('VERTICE');
    const [faceSelecionada, setFaceSelecionada] = useState<string | null>(null);
    const [quantidadeBevel, setQuantidadeBevel] = useState(0.25);
    const [fatorInset, setFatorInset] = useState(0.3);
    const [paramsCriacao, setParamsCriacao] = useState<ParamCriacaoMalhaEditor3D | null>(null);
    const [capturando, setCapturando] = useState(false);
    const [capaSalva, setCapaSalva] = useState(false);
    const [projetoAberto, setProjetoAberto] = useState<ProjetoAbertoEditor3D | null>(null);
    const [alterado, setAlterado] = useState(false);
    const [ehInicio, setEhInicio] = useState(true);
    const [tipoProjeto, setTipoProjeto] = useState<TipoProjetoEditor3D>('PADRAO');
    const [camera, setCamera] = useState<CameraEditor3D | null>(null);
    const [capaArte, setCapaArte] = useState<CapaArteEditor3D>(CAPA_ARTE_PADRAO_EDITOR3D);
    const renderCapaRef = useRef<((camera: CameraEditor3D) => RenderCapaArteEditor3D) | null>(null);
    const registraRenderCapa = useCallback((render: ((camera: CameraEditor3D) => RenderCapaArteEditor3D) | null) => { renderCapaRef.current = render; }, []);
    const refCanvasPreviewCapa = useRef<HTMLCanvasElement | null>(null);
    const [camPovAtiva, setCamPovAtiva] = useState(false);
    const [alvoTravado, setAlvoTravado] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
    const [modalAbrirAberto, setModalAbrirAberto] = useState(false);
    const [modalAnexarPecaAberto, setModalAnexarPecaAberto] = useState(false);
    const [pecas, setPecas] = useState<readonly PecaPersonagemCenaCanonicaEditor3D[]>([]);
    const [corpoPersonagem, setCorpoPersonagem] = useState<CorpoPersonagemCenaCanonicaEditor3D | null>(null);
    const [regiaoCorpoSelecionada, setRegiaoCorpoSelecionada] = useState<MembroPersonagemEditor3D | null>(null);
    const [projetosListados, setProjetosListados] = useState<readonly Projeto3DResumoPersistido[]>([]);
    const [carregandoLista, setCarregandoLista] = useState(false);
    const [colecoes, setColecoes] = useState<readonly ColecaoEditor3D[]>([]);
    const contadorRef = useRef(0);
    const contadorColecaoRef = useRef(0);
    const contadorAbaRef = useRef(1);
    const [abas, setAbas] = useState<readonly AbaEditor3D[]>([{ idAba: 1, nomePadrao: 'Início', cenaInativa: null }]);
    const [idAbaAtiva, setIdAbaAtiva] = useState(1);
    const refMeshSelecionada = useRef<Mesh | null>(null);
    const registroMeshes = useRef<Map<number, Mesh>>(new Map());
    const registraMeshSelecionada = useCallback((mesh: Mesh | null) => { refMeshSelecionada.current = mesh; }, []);
    const registraMesh = useCallback((id: number, mesh: Mesh | null) => { if (mesh) registroMeshes.current.set(id, mesh); else registroMeshes.current.delete(id); }, []);
    const [transformSelecionado, setTransformSelecionado] = useState<TransformEditor3D | null>(null);
    const [pilhaDesfazer, setPilhaDesfazer] = useState<readonly CenaArmazenadaEditor3D[]>([]);
    const [pilhaRefazer, setPilhaRefazer] = useState<readonly CenaArmazenadaEditor3D[]>([]);
    const tagHistoricoRef = useRef<string | null>(null);
    const tempoHistoricoRef = useRef(0);

    // O transform vive na mesh (o gizmo a muta direto), então lemos dela para alimentar os campos do inspetor.
    const lerTransformDaMeshSelecionada = useCallback((): TransformEditor3D | null => {
        const mesh = refMeshSelecionada.current;
        if (!mesh) return null;
        return { posicao: [mesh.position.x, mesh.position.y, mesh.position.z], rotacao: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z] };
    }, []);

    const sincronizaTransformSelecionado = useCallback(() => { setTransformSelecionado(lerTransformDaMeshSelecionada()); }, [lerTransformDaMeshSelecionada]);

    // Captura os transforms vivos das meshes no estado para a aba poder ser restaurada depois sem perder edições.
    const capturaCenaAtiva = useCallback((): CenaArmazenadaEditor3D => ({
        objetos: objetos.map(objeto => {
            const mesh = registroMeshes.current.get(objeto.id);
            if (!mesh) return objeto;
            return { ...objeto, transformInicial: { posicao: [mesh.position.x, mesh.position.y, mesh.position.z], rotacao: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z] } };
        }),
        colecoes, pecas, corpoPersonagem, idSelecionado, projetoAberto, alterado, ehInicio, tipoProjeto, camera, capaArte,
    }), [objetos, colecoes, pecas, corpoPersonagem, idSelecionado, projetoAberto, alterado, ehInicio, tipoProjeto, camera, capaArte]);

    const aplicaCenaAtiva = useCallback((cena: CenaArmazenadaEditor3D) => {
        setObjetos(cena.objetos);
        setColecoes(cena.colecoes);
        setPecas(cena.pecas);
        setCorpoPersonagem(cena.corpoPersonagem);
        setRegiaoCorpoSelecionada(null);
        setIdSelecionado(cena.idSelecionado);
        setProjetoAberto(cena.projetoAberto);
        setAlterado(cena.alterado);
        setEhInicio(cena.ehInicio);
        setTipoProjeto(cena.tipoProjeto);
        setCamera(cena.camera);
        setCapaArte(cena.capaArte);
        setCamPovAtiva(false);
        setAlvoTravado(true);
    }, []);

    // Registra o estado PRÉ-mutação no histórico de Desfazer. `tag` marca operações contínuas: chamadas repetidas
    // com a mesma tag dentro da janela coalescem num único registro (janela deslizante — atualiza a cada chamada).
    const registraHistorico = useCallback((tag?: string) => {
        const agora = Date.now();
        if (tag !== undefined && tag === tagHistoricoRef.current && agora - tempoHistoricoRef.current < JANELA_COALESCENCIA_HISTORICO_MS) { tempoHistoricoRef.current = agora; return; }
        tagHistoricoRef.current = tag ?? null;
        tempoHistoricoRef.current = agora;
        const captura = capturaCenaAtiva();
        setPilhaDesfazer(atuais => atuais.length >= LIMITE_HISTORICO_EDITOR3D ? [...atuais.slice(1), captura] : [...atuais, captura]);
        setPilhaRefazer([]);
    }, [capturaCenaAtiva]);

    // Arrasto de gizmo (objeto ou vértices): cada arrasto é UM registro, capturado no mouseDown (antes da primeira mutação).
    const registraHistoricoArrasto = useCallback(() => { registraHistorico(); }, [registraHistorico]);

    const limpaHistorico = useCallback(() => {
        setPilhaDesfazer([]);
        setPilhaRefazer([]);
        tagHistoricoRef.current = null;
    }, []);

    // Cena NOVA no contexto da aba ativa (trocar aba, abrir/criar projeto): o histórico pertence à cena anterior e zera.
    const aplicaCenaNova = useCallback((cena: CenaArmazenadaEditor3D) => {
        limpaHistorico();
        aplicaCenaAtiva(cena);
    }, [limpaHistorico, aplicaCenaAtiva]);

    // A seleção de subelementos não participa do snapshot: limpa ao desfazer/refazer para não apontar índices de uma malha que mudou.
    const desfazer = useCallback(() => {
        if (pilhaDesfazer.length === 0) return;
        const alvo = pilhaDesfazer[pilhaDesfazer.length - 1];
        const capturaAtual = capturaCenaAtiva();
        setPilhaDesfazer(atuais => atuais.slice(0, -1));
        setPilhaRefazer(atuais => [...atuais, capturaAtual]);
        tagHistoricoRef.current = null;
        setVerticesSelecionados([]);
        setFaceSelecionada(null);
        aplicaCenaAtiva(alvo);
    }, [pilhaDesfazer, capturaCenaAtiva, aplicaCenaAtiva]);

    const refazer = useCallback(() => {
        if (pilhaRefazer.length === 0) return;
        const alvo = pilhaRefazer[pilhaRefazer.length - 1];
        const capturaAtual = capturaCenaAtiva();
        setPilhaRefazer(atuais => atuais.slice(0, -1));
        setPilhaDesfazer(atuais => [...atuais, capturaAtual]);
        tagHistoricoRef.current = null;
        setVerticesSelecionados([]);
        setFaceSelecionada(null);
        aplicaCenaAtiva(alvo);
    }, [pilhaRefazer, capturaCenaAtiva, aplicaCenaAtiva]);

    const atualizaTransformObjeto = useCallback((campo: CampoTransformEditor3D, indice: number, valor: number) => {
        const mesh = refMeshSelecionada.current;
        if (!mesh) return;
        registraHistorico(`transform-painel-${campo}-${indice}`);
        if (campo === 'posicao') mesh.position.setComponent(indice, valor);
        else if (campo === 'escala') mesh.scale.setComponent(indice, valor);
        else { const rotacao: [number, number, number] = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z]; rotacao[indice] = valor; mesh.rotation.set(rotacao[0], rotacao[1], rotacao[2]); }
        mesh.updateMatrix();
        setTransformSelecionado(lerTransformDaMeshSelecionada());
        setAlterado(true);
    }, [lerTransformDaMeshSelecionada, registraHistorico]);

    const atualizaCameraVetor = useCallback((campo: CampoVetorCameraCapaArteEditor3D, indice: number, valor: number) => {
        registraHistorico(`camera-vetor-${campo}-${indice}`);
        setCamera(atual => {
            if (!atual) return atual;
            const vetor = [...atual[campo]] as [number, number, number];
            const anterior = vetor[indice];
            vetor[indice] = valor;
            // Posição com alvo destravado: o alvo acompanha o deslocamento (preserva a direção do olhar).
            if (campo === 'posicao' && !alvoTravado) {
                const alvo = [...atual.alvo] as [number, number, number];
                alvo[indice] += valor - anterior;
                return { ...atual, posicao: vetor, alvo };
            }
            return { ...atual, [campo]: vetor };
        });
        setAlterado(true);
    }, [alvoTravado, registraHistorico]);

    const atualizaCameraFov = useCallback((valor: number) => {
        registraHistorico('camera-fov');
        setCamera(atual => atual ? { ...atual, fov: valor } : atual);
        // FOV mudou → o frustum mudou; re-restringe o título para continuar dentro da área da câmera.
        setCapaArte(atual => ({ ...atual, titulo: { ...atual.titulo, posicao: restringeTextoNaCameraEditor3D(atual.titulo.posicao, valor) } }));
        setAlterado(true);
    }, [registraHistorico]);

    // Alvo travado: mover a posição não mexe no alvo (a câmera re-mira nele). Destravado: o alvo acompanha a posição (preserva a direção do olhar).
    const moveCameraPosicao = useCallback((posicao: [number, number, number]) => {
        registraHistorico('camera-gizmo-posicao');
        setCamera(atual => {
            if (!atual) return atual;
            if (alvoTravado) return { ...atual, posicao };
            const alvo: [number, number, number] = [atual.alvo[0] + (posicao[0] - atual.posicao[0]), atual.alvo[1] + (posicao[1] - atual.posicao[1]), atual.alvo[2] + (posicao[2] - atual.posicao[2])];
            return { ...atual, posicao, alvo };
        });
        setAlterado(true);
    }, [alvoTravado, registraHistorico]);
    const moveCameraAlvo = useCallback((alvo: [number, number, number]) => { registraHistorico('camera-gizmo-alvo'); setCamera(atual => atual ? { ...atual, alvo } : atual); setAlterado(true); }, [registraHistorico]);
    const navegaCameraPov = useCallback((posicao: [number, number, number], alvo: [number, number, number]) => { registraHistorico('camera-pov'); setCamera(atual => atual ? { ...atual, posicao, alvo } : atual); setAlterado(true); }, [registraHistorico]);
    const alternaPovCamera = useCallback(() => { setCamPovAtiva(atual => !atual); }, []);
    const alternaAlvoTravado = useCallback(() => { setAlvoTravado(atual => !atual); }, []);
    // Título da Capa de Arte: objeto 3D (texto) filho da câmera-output, editável como qualquer objeto.
    const atualizaTituloTexto = useCallback((texto: string) => { registraHistorico('titulo-texto'); setCapaArte(atual => ({ ...atual, titulo: { ...atual.titulo, texto } })); setAlterado(true); }, [registraHistorico]);
    const atualizaTituloCor = useCallback((cor: string) => { registraHistorico('titulo-cor'); setCapaArte(atual => ({ ...atual, titulo: { ...atual.titulo, cor } })); setAlterado(true); }, [registraHistorico]);
    const atualizaTituloTransform = useCallback((campo: CampoTransformEditor3D, indice: number, valor: number) => {
        registraHistorico(`titulo-transform-${campo}-${indice}`);
        setCapaArte(atual => {
            const vetor = [...atual.titulo[campo]] as [number, number, number];
            vetor[indice] = valor;
            // Posição é restrita ao frustum da câmera (não sai da área da câmera); rotação/escala são livres.
            const titulo = campo === 'posicao' ? { ...atual.titulo, posicao: restringeTextoNaCameraEditor3D(vetor, camera?.fov ?? 40) } : { ...atual.titulo, [campo]: vetor };
            return { ...atual, titulo };
        });
        setAlterado(true);
    }, [camera, registraHistorico]);
    // Arrasto do gizmo do título no cenário: posição restrita ao frustum.
    const moveTituloPosicao = useCallback((posicao: [number, number, number]) => {
        registraHistorico('titulo-gizmo');
        setCapaArte(atual => ({ ...atual, titulo: { ...atual.titulo, posicao: restringeTextoNaCameraEditor3D(posicao, camera?.fov ?? 40) } }));
        setAlterado(true);
    }, [camera, registraHistorico]);

    const adicionaObjeto = useCallback((tipo: TipoPrimitivaEditor3D) => {
        registraHistorico();
        contadorRef.current += 1;
        const id = contadorRef.current;
        setObjetos(atuais => [...atuais, { id, tipo, nome: `${rotuloTipoPrimitivaEditor3D(tipo)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, idPeca: null, visivel: true, malha: criaMalhaPrimitiva(tipo), subdivisao: 0, transformInicial: { posicao: calculaPosicaoInicialObjeto(atuais.length), rotacao: [0, 0, 0], escala: [1, 1, 1] } }]);
        setIdSelecionado(id);
        setAlterado(true);
    }, [registraHistorico]);

    const alternaVisibilidade = useCallback((id: number) => {
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, visivel: !objeto.visivel } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    // Partes de peça não podem ser excluídas/duplicadas individualmente (remove-se a peça inteira).
    const removeObjeto = useCallback((id: number) => {
        const objeto = objetos.find(item => item.id === id);
        if (!objeto || objeto.idPeca !== null) return;
        registraHistorico();
        setObjetos(atuais => atuais.filter(item => item.id !== id));
        setColecoes(atuais => atuais.map(colecao => colecao.idsObjetos.includes(id) ? { ...colecao, idsObjetos: colecao.idsObjetos.filter(idObjeto => idObjeto !== id) } : colecao));
        setIdSelecionado(atual => atual === id ? null : atual);
        setAlterado(true);
    }, [objetos, registraHistorico]);

    // Duplica com o transform VIVO da mesh (não o inicial), deslocado para a cópia não nascer sobreposta; entra na mesma coleção do original.
    const duplicaObjeto = useCallback((id: number) => {
        const objeto = objetos.find(item => item.id === id);
        if (!objeto || objeto.idPeca !== null) return;
        registraHistorico();
        const mesh = registroMeshes.current.get(id);
        const transformAtual: TransformEditor3D = mesh
            ? { posicao: [mesh.position.x + 0.4, mesh.position.y, mesh.position.z + 0.4], rotacao: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z] }
            : { ...objeto.transformInicial, posicao: [objeto.transformInicial.posicao[0] + 0.4, objeto.transformInicial.posicao[1], objeto.transformInicial.posicao[2] + 0.4] };
        contadorRef.current += 1;
        const novoId = contadorRef.current;
        const malhaCopiada: MalhaEditavelLocal = { vertices: objeto.malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3Malha), faces: objeto.malha.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices] })), proximoIdFace: objeto.malha.proximoIdFace };
        setObjetos(atuais => [...atuais, { ...objeto, id: novoId, nome: `${objeto.nome} (cópia)`, malha: malhaCopiada, transformInicial: transformAtual }]);
        setColecoes(atuais => atuais.map(colecao => colecao.idsObjetos.includes(id) ? { ...colecao, idsObjetos: [...colecao.idsObjetos, novoId] } : colecao));
        setIdSelecionado(novoId);
        setAlterado(true);
    }, [objetos, registraHistorico]);

    const renomeiaObjeto = useCallback((id: number, nome: string) => {
        const nomeLimpo = nome.trim();
        if (nomeLimpo.length === 0) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, nome: nomeLimpo } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    const mudaCorObjeto = useCallback((id: number, cor: string) => {
        registraHistorico(`cor-objeto-${id}`);
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, cor } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    // Nível de subdivisão Catmull-Clark de EXIBIÇÃO do objeto: a gaiola (malha) segue sendo o que se edita; o viewport mostra a superfície subdividida.
    const mudaSubdivisaoObjeto = useCallback((id: number, subdivisao: number) => {
        const nivel = Math.max(0, Math.min(MAXIMO_SUBDIVISAO_MALHA_EDITOR3D, Math.round(subdivisao)));
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, subdivisao: nivel } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    const abrirModalAnexarPeca = useCallback(async () => {
        setModalAnexarPecaAberto(true);
        setCarregandoLista(true);
        try {
            setProjetosListados(await listaProjetos3D());
        } catch {
            setProjetosListados([]);
        } finally {
            setCarregandoLista(false);
        }
    }, []);

    // Copy-on-attach: os objetos do projeto de origem são COPIADOS para a cena como camada da peça (marcados com idPeca), deslocados para a âncora da região no corpo; a origem fica só como referência.
    const anexaPeca = useCallback(async (idProjeto: number, nomeProjeto: string) => {
        setModalAnexarPecaAberto(false);
        if (!corpoPersonagem || regiaoCorpoSelecionada === null) return;
        const persistido = await consultaProjeto3D(idProjeto);
        if (!persistido) return;
        const carregados = desserializaCenaCanonicaEditor3D(persistido.cenaCanonica);
        if (carregados.length === 0) return;
        registraHistorico();
        const idPeca = crypto.randomUUID();
        const base = ancoraRegiaoCorpoPersonagem(corpoPersonagem, regiaoCorpoSelecionada);
        const novos: ObjetoEditor3D[] = carregados.map(carregado => {
            contadorRef.current += 1;
            return { id: contadorRef.current, tipo: carregado.tipo, nome: carregado.nome, cor: carregado.cor, idPeca, visivel: true, malha: carregado.malha ?? criaMalhaPrimitiva(carregado.tipo), subdivisao: carregado.subdivisao, transformInicial: { posicao: [carregado.transform.posicao[0] + base[0], carregado.transform.posicao[1] + base[1], carregado.transform.posicao[2] + base[2]], rotacao: carregado.transform.rotacao, escala: carregado.transform.escala } };
        });
        setObjetos(atuais => [...atuais, ...novos]);
        setPecas(atuais => [...atuais, { idPeca, membro: regiaoCorpoSelecionada, nome: nomeProjeto, idProjetoOrigem: persistido.id }]);
        setAlterado(true);
    }, [corpoPersonagem, regiaoCorpoSelecionada, registraHistorico]);

    // Remover a peça remove a camada inteira (todos os objetos marcados + o registro da peça).
    const removePeca = useCallback((idPeca: string) => {
        registraHistorico();
        const idsRemovidos = new Set(objetos.filter(objeto => objeto.idPeca === idPeca).map(objeto => objeto.id));
        setObjetos(atuais => atuais.filter(objeto => objeto.idPeca !== idPeca));
        setColecoes(atuais => atuais.map(colecao => ({ ...colecao, idsObjetos: colecao.idsObjetos.filter(id => !idsRemovidos.has(id)) })));
        setPecas(atuais => atuais.filter(peca => peca.idPeca !== idPeca));
        setIdSelecionado(atual => atual !== null && idsRemovidos.has(atual) ? null : atual);
        setAlterado(true);
    }, [objetos, registraHistorico]);

    const abreCriacaoMalha = useCallback(() => { setParamsCriacao({ tipo: 'CUBO', segmentos: 24, posicao: [0, 0.5, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] }); }, []);
    const mudaTipoCriacao = useCallback((tipo: TipoPrimitivaEditor3D) => { setParamsCriacao(atual => atual ? { ...atual, tipo } : atual); }, []);
    const mudaSegmentosCriacao = useCallback((segmentos: number) => { setParamsCriacao(atual => atual ? { ...atual, segmentos } : atual); }, []);
    const mudaVetorCriacao = useCallback((campo: CampoVetorCriacaoEditor3D, indice: number, valor: number) => {
        setParamsCriacao(atual => { if (!atual) return atual; const vetor = [...atual[campo]] as [number, number, number]; vetor[indice] = valor; return { ...atual, [campo]: vetor }; });
    }, []);
    const cancelaCriacaoMalha = useCallback(() => { setParamsCriacao(null); }, []);

    const confirmaCriacaoMalha = useCallback(() => {
        if (!paramsCriacao) return;
        registraHistorico();
        contadorRef.current += 1;
        const id = contadorRef.current;
        const malha = criaMalhaPrimitiva(paramsCriacao.tipo, paramsCriacao.segmentos);
        setObjetos(atuais => [...atuais, { id, tipo: paramsCriacao.tipo, nome: `${rotuloTipoPrimitivaEditor3D(paramsCriacao.tipo)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, idPeca: null, visivel: true, malha, subdivisao: 0, transformInicial: { posicao: paramsCriacao.posicao, rotacao: paramsCriacao.rotacao, escala: paramsCriacao.escala } }]);
        setIdSelecionado(id);
        setAlterado(true);
        setParamsCriacao(null);
    }, [paramsCriacao, registraHistorico]);

    const selecionaSubElemento = useCallback((vertices: readonly number[], faceId: string | null, aditivo: boolean) => {
        setFaceSelecionada(aditivo ? null : faceId);
        setVerticesSelecionados(atuais => {
            if (!aditivo) return [...vertices];
            const conjunto = new Set(atuais);
            const todosPresentes = vertices.every(vertice => conjunto.has(vertice));
            for (const vertice of vertices) { if (todosPresentes) conjunto.delete(vertice); else conjunto.add(vertice); }
            return [...conjunto];
        });
    }, []);

    const extrudaFaceSelecionada = useCallback(() => {
        if (idSelecionado === null || faceSelecionada === null) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const resultado = extrudaFace(objeto.malha, faceSelecionada);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesNovaFace);
        setFaceSelecionada(resultado.idNovaFace);
        setAlterado(true);
    }, [idSelecionado, faceSelecionada, objetos, registraHistorico]);

    const chanframaArestaSelecionada = useCallback(() => {
        if (idSelecionado === null || modoSelecaoEdicao !== 'ARESTA' || verticesSelecionados.length !== 2) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = chanframaAresta(objeto.malha, verticesSelecionados[0], verticesSelecionados[1], quantidadeBevel);
        if (resultado.indicesChanfro.length === 0) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesChanfro);
        setFaceSelecionada(null);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, verticesSelecionados, objetos, quantidadeBevel, registraHistorico]);

    // Corte de anel: perpendicular à aresta selecionada; a seleção passa a ser o anel novo inteiro (todos os pontos médios).
    const cortaAnelSelecionado = useCallback(() => {
        if (idSelecionado === null || modoSelecaoEdicao !== 'ARESTA' || verticesSelecionados.length !== 2) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = cortaAnelAresta(objeto.malha, verticesSelecionados[0], verticesSelecionados[1]);
        if (!resultado) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesNovoAnel);
        setFaceSelecionada(null);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, verticesSelecionados, objetos, registraHistorico]);

    const insetaFaceSelecionada = useCallback(() => {
        if (idSelecionado === null || faceSelecionada === null) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const resultado = insetaFace(objeto.malha, faceSelecionada, fatorInset);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesNovaFace);
        setFaceSelecionada(resultado.idNovaFace);
        setAlterado(true);
    }, [idSelecionado, faceSelecionada, objetos, fatorInset, registraHistorico]);

    // Espelhar X: opera na malha inteira do objeto selecionado (plano X=0 local; modele metade e espelhe).
    const espelhaObjetoSelecionadoX = useCallback(() => {
        if (idSelecionado === null || idSelecionado < 0) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const malhaEspelhada = espelhaMalhaX(objeto.malha);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: malhaEspelhada } : item));
        setVerticesSelecionados([]);
        setFaceSelecionada(null);
        setAlterado(true);
    }, [idSelecionado, objetos, registraHistorico]);

    // Excluir contextual: no modo FACE remove a face selecionada; no modo VÉRTICE remove as faces que tocam os vértices selecionados.
    const excluiSelecaoEdicao = useCallback(() => {
        if (idSelecionado === null) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = modoSelecaoEdicao === 'FACE' && faceSelecionada !== null
            ? excluiFacesDaMalha(objeto.malha, [faceSelecionada])
            : modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length > 0
                ? excluiVerticesDaMalha(objeto.malha, verticesSelecionados)
                : null;
        if (!resultado) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado } : item));
        setVerticesSelecionados([]);
        setFaceSelecionada(null);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, faceSelecionada, verticesSelecionados, objetos, registraHistorico]);

    const fundeVerticesSelecionadosEdicao = useCallback(() => {
        if (idSelecionado === null || modoSelecaoEdicao !== 'VERTICE' || verticesSelecionados.length < 2) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = fundeVerticesDaMalha(objeto.malha, verticesSelecionados);
        if (!resultado) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados([resultado.indiceFundido]);
        setFaceSelecionada(null);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, verticesSelecionados, objetos, registraHistorico]);

    const moveVerticesSelecionados = useCallback((delta: [number, number, number]) => {
        if (idSelecionado === null || verticesSelecionados.length === 0) return;
        const selecionados = new Set(verticesSelecionados);
        setObjetos(atuais => atuais.map(objeto => {
            if (objeto.id !== idSelecionado) return objeto;
            const vertices = objeto.malha.vertices.map((vertice, indice) => selecionados.has(indice) ? [vertice[0] + delta[0], vertice[1] + delta[1], vertice[2] + delta[2]] as Vetor3Malha : vertice);
            return { ...objeto, malha: { ...objeto.malha, vertices } };
        }));
        setAlterado(true);
    }, [idSelecionado, verticesSelecionados]);

    const iniciaCaptura = useCallback(() => {
        // Capa de Arte: captura direto o render da câmera-output (1280x720) e publica no armazenamento que o /teste-assets consome.
        if (tipoProjeto === 'CAPA_ARTE' && camera) {
            const dataUrl = renderCapaRef.current?.(camera).base;
            if (!dataUrl) return;
            salvaArteDeCapa({ id: crypto.randomUUID(), tipo: 'ARTE_CAPA', largura: LARGURA_ARTE_DE_CAPA, altura: ALTURA_ARTE_DE_CAPA, imagem: dataUrl, origem: 'SNAPSHOT_3D', criadoEmMs: Date.now() });
            setCapaSalva(true);
            return;
        }
        setCapaSalva(false);
        setCapturando(true);
    }, [tipoProjeto, camera]);

    const montaObjetosCarregados = useCallback((carregados: readonly ObjetoCarregadoEditor3D[]): ObjetoEditor3D[] => carregados.map(carregado => { contadorRef.current += 1; return { id: contadorRef.current, tipo: carregado.tipo, nome: carregado.nome, cor: carregado.cor, idPeca: carregado.idPeca, visivel: true, malha: carregado.malha ?? criaMalhaPrimitiva(carregado.tipo), subdivisao: carregado.subdivisao, transformInicial: carregado.transform }; }), []);

    const criaColecao = useCallback(() => {
        registraHistorico();
        contadorColecaoRef.current += 1;
        const id = contadorColecaoRef.current;
        setColecoes(atuais => [...atuais, { id, nome: `Coleção ${id}`, idsObjetos: [], visivel: true }]);
        setAlterado(true);
    }, [registraHistorico]);

    const moveObjetoParaColecao = useCallback((idObjeto: number, idColecaoDestino: number | null) => {
        registraHistorico();
        setColecoes(atuais => atuais.map(colecao => ({ ...colecao, idsObjetos: colecao.idsObjetos.filter(id => id !== idObjeto) })).map(colecao => colecao.id === idColecaoDestino ? { ...colecao, idsObjetos: [...colecao.idsObjetos, idObjeto] } : colecao));
        setAlterado(true);
    }, [registraHistorico]);

    const alternaVisibilidadeColecao = useCallback((idColecao: number) => {
        registraHistorico();
        setColecoes(atuais => atuais.map(colecao => colecao.id === idColecao ? { ...colecao, visivel: !colecao.visivel } : colecao));
        setAlterado(true);
    }, [registraHistorico]);

    const renomeiaColecao = useCallback((idColecao: number, nome: string) => {
        const nomeLimpo = nome.trim();
        if (nomeLimpo.length === 0) return;
        registraHistorico();
        setColecoes(atuais => atuais.map(colecao => colecao.id === idColecao ? { ...colecao, nome: nomeLimpo } : colecao));
        setAlterado(true);
    }, [registraHistorico]);

    const removeColecao = useCallback((idColecao: number) => {
        registraHistorico();
        setColecoes(atuais => atuais.filter(colecao => colecao.id !== idColecao));
        setAlterado(true);
    }, [registraHistorico]);

    const trocaAba = useCallback((idAlvo: number) => {
        if (idAlvo === idAbaAtiva) return;
        const alvo = abas.find(aba => aba.idAba === idAlvo);
        if (!alvo || alvo.cenaInativa === null) return;
        const cenaAtual = capturaCenaAtiva();
        setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, cenaInativa: cenaAtual } : aba.idAba === idAlvo ? { ...aba, cenaInativa: null } : aba));
        aplicaCenaNova(alvo.cenaInativa);
        setIdAbaAtiva(idAlvo);
    }, [idAbaAtiva, abas, capturaCenaAtiva, aplicaCenaNova]);

    const abreNovaAba = useCallback((cenaInicial: CenaArmazenadaEditor3D) => {
        const cenaAtual = capturaCenaAtiva();
        contadorAbaRef.current += 1;
        const novoId = contadorAbaRef.current;
        const nomeNovaAba = cenaInicial.ehInicio ? 'Início' : cenaInicial.tipoProjeto === 'CAPA_ARTE' ? `Capa de Arte ${novoId}` : cenaInicial.tipoProjeto === 'PERSONAGEM' ? `Personagem ${novoId}` : `Novo Projeto ${novoId}`;
        setAbas(atuais => [...atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, cenaInativa: cenaAtual } : aba), { idAba: novoId, nomePadrao: nomeNovaAba, cenaInativa: null }]);
        aplicaCenaNova(cenaInicial);
        setIdAbaAtiva(novoId);
    }, [idAbaAtiva, capturaCenaAtiva, aplicaCenaNova]);

    const fechaAba = useCallback((idAlvo: number) => {
        const aba = abas.find(item => item.idAba === idAlvo);
        if (!aba) return;
        const alteradoDaAba = idAlvo === idAbaAtiva ? alterado : (aba.cenaInativa?.alterado ?? false);
        if (alteradoDaAba && !window.confirm('Esta aba tem alterações não salvas. Fechar mesmo assim?')) return;
        if (abas.length === 1) {
            contadorAbaRef.current += 1;
            const novoId = contadorAbaRef.current;
            setAbas([{ idAba: novoId, nomePadrao: 'Início', cenaInativa: null }]);
            aplicaCenaNova(CENA_INICIO_EDITOR3D);
            setIdAbaAtiva(novoId);
            return;
        }
        const restantes = abas.filter(item => item.idAba !== idAlvo);
        if (idAlvo !== idAbaAtiva) { setAbas(restantes); return; }
        const vizinho = restantes[restantes.length - 1];
        setAbas(restantes.map(item => item.idAba === vizinho.idAba ? { ...item, cenaInativa: null } : item));
        if (vizinho.cenaInativa !== null) aplicaCenaNova(vizinho.cenaInativa);
        setIdAbaAtiva(vizinho.idAba);
    }, [abas, idAbaAtiva, alterado, aplicaCenaNova]);

    const construirEntradasSerializacao = useCallback((): EntradaSerializacaoObjetoEditor3D[] => {
        const entradas: EntradaSerializacaoObjetoEditor3D[] = [];
        for (const objeto of objetos) {
            const mesh = registroMeshes.current.get(objeto.id);
            if (!mesh) continue;
            entradas.push({ id: objeto.id, nome: objeto.nome, tipo: objeto.tipo, cor: objeto.cor, idPeca: objeto.idPeca, malha: objeto.malha, subdivisao: objeto.subdivisao, mesh });
        }
        return entradas;
    }, [objetos]);

    const salvar = useCallback(async (nome: string, idProjeto?: number) => {
        const entradas = construirEntradasSerializacao();
        const ehCapaArte = tipoProjeto === 'CAPA_ARTE' && camera !== null;
        const ehPersonagem = tipoProjeto === 'PERSONAGEM' && corpoPersonagem !== null;
        if (entradas.length === 0 && !ehCapaArte && !ehPersonagem) return;
        // Capa de Arte: o output final é o render da câmera (1280x720) em 2 camadas — base (sem título) + título (transparente) — enviado junto da cena.
        let imagemCapaBase64: string | undefined;
        let imagemCapaTituloBase64: string | undefined;
        if (ehCapaArte && camera) {
            const render = renderCapaRef.current?.(camera);
            if (!render) return;
            imagemCapaBase64 = render.base;
            imagemCapaTituloBase64 = render.titulo ?? undefined;
        }
        setSalvando(true);
        try {
            const persistido = await salvaProjeto3D(nome, serializaCenaCanonicaEditor3D(entradas, tipoProjeto, camera, capaArte, corpoPersonagem, pecas), idProjeto, imagemCapaBase64, imagemCapaTituloBase64);
            setProjetoAberto({ id: persistido.id, nome: persistido.nome });
            setAlterado(false);
            setModalSalvarAberto(false);
        } catch {
            // NoraApi já exibiu o toast de erro ao usuário.
        } finally {
            setSalvando(false);
        }
    }, [construirEntradasSerializacao, tipoProjeto, camera, capaArte, corpoPersonagem, pecas]);

    const salvarProjetoAtual = useCallback(() => {
        if (projetoAberto) void salvar(projetoAberto.nome, projetoAberto.id);
        else setModalSalvarAberto(true);
    }, [projetoAberto, salvar]);

    // Início vira editor na própria aba (renomeando-a); fora do início, abre uma aba nova.
    const iniciaProjetoVazio = useCallback(() => {
        if (ehInicio) {
            setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, nomePadrao: `Novo Projeto ${aba.idAba}` } : aba));
            aplicaCenaNova(CENA_VAZIA_EDITOR3D);
        } else {
            abreNovaAba(CENA_VAZIA_EDITOR3D);
        }
    }, [ehInicio, idAbaAtiva, aplicaCenaNova, abreNovaAba]);
    const iniciaCapaArte = useCallback(() => {
        if (ehInicio) {
            setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, nomePadrao: `Capa de Arte ${aba.idAba}` } : aba));
            aplicaCenaNova(CENA_CAPA_ARTE_EDITOR3D);
        } else {
            abreNovaAba(CENA_CAPA_ARTE_EDITOR3D);
        }
    }, [ehInicio, idAbaAtiva, aplicaCenaNova, abreNovaAba]);

    // Personagem nasce COMPLETO (modelo Hero Forge): o corpo contínuo já vem inteiro; a customização é por região, via sliders.
    const iniciaPersonagem = useCallback(() => {
        const cena: CenaArmazenadaEditor3D = { ...CENA_VAZIA_EDITOR3D, tipoProjeto: 'PERSONAGEM', corpoPersonagem: CORPO_PERSONAGEM_PADRAO_EDITOR3D, idSelecionado: SELECAO_CORPO_PERSONAGEM_EDITOR3D };
        if (ehInicio) {
            setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, nomePadrao: `Personagem ${aba.idAba}` } : aba));
            aplicaCenaNova(cena);
        } else {
            abreNovaAba(cena);
        }
    }, [ehInicio, idAbaAtiva, aplicaCenaNova, abreNovaAba]);

    const selecionaCorpo = useCallback((regiao: MembroPersonagemEditor3D | null) => {
        setIdSelecionado(SELECAO_CORPO_PERSONAGEM_EDITOR3D);
        setRegiaoCorpoSelecionada(regiao);
    }, []);

    // Slider do corpo: atualiza o parâmetro (global ou da região) — a casca única é regenerada por inteiro a partir dos parâmetros.
    const atualizaParametroCorpo = useCallback((regiao: MembroPersonagemEditor3D | null, campo: keyof CorpoPersonagemCenaCanonicaEditor3D['global'], valor: number) => {
        registraHistorico(`corpo-${regiao ?? 'GLOBAL'}-${campo}`);
        setCorpoPersonagem(atual => {
            if (!atual) return atual;
            if (regiao === null) return { ...atual, global: { ...atual.global, [campo]: valor } };
            return { ...atual, regioes: { ...atual.regioes, [regiao]: { ...atual.regioes[regiao], [campo]: valor } } };
        });
        setAlterado(true);
    }, [registraHistorico]);

    const mudaCorCorpo = useCallback((cor: string) => {
        registraHistorico('cor-corpo');
        const convertida = new Color(cor);
        setCorpoPersonagem(atual => atual ? { ...atual, cor: [convertida.r, convertida.g, convertida.b] } : atual);
        setAlterado(true);
    }, [registraHistorico]);

    const abrirModalAbrirProjeto = useCallback(async () => {
        setModalAbrirAberto(true);
        setCarregandoLista(true);
        try {
            setProjetosListados(await listaProjetos3D());
        } catch {
            setProjetosListados([]);
        } finally {
            setCarregandoLista(false);
        }
    }, []);

    const abreProjetoEmAba = useCallback(async (id: number, _nome: string) => {
        setModalAbrirAberto(false);
        // Dedupe: não abrir o mesmo projeto em duas abas — se já está aberto, vai para a aba dele.
        if (projetoAberto?.id === id) return;
        const abaComProjeto = abas.find(aba => aba.cenaInativa?.projetoAberto?.id === id);
        if (abaComProjeto) { trocaAba(abaComProjeto.idAba); return; }
        const persistido = await consultaProjeto3D(id);
        if (!persistido) return;
        const cena: CenaArmazenadaEditor3D = { objetos: montaObjetosCarregados(desserializaCenaCanonicaEditor3D(persistido.cenaCanonica)), colecoes: [], pecas: pecasDaCena(persistido.cenaCanonica), corpoPersonagem: corpoPersonagemDaCena(persistido.cenaCanonica), idSelecionado: null, projetoAberto: { id: persistido.id, nome: persistido.nome }, alterado: false, ehInicio: false, tipoProjeto: tipoProjetoDaCena(persistido.cenaCanonica), camera: cameraDaCena(persistido.cenaCanonica), capaArte: capaArteDaCena(persistido.cenaCanonica) };
        if (ehInicio) aplicaCenaNova(cena);
        else abreNovaAba(cena);
    }, [projetoAberto, abas, ehInicio, trocaAba, aplicaCenaNova, abreNovaAba, montaObjetosCarregados]);

    const comandoDesabilitado = useCallback((comando: ComandoMenuEditor3D): boolean => {
        if (salvando) return true;
        if (ehInicio) return comando !== 'NOVO_PROJETO' && comando !== 'ABRIR_PROJETO' && comando !== 'CRIAR_CAPA_ARTE' && comando !== 'CRIAR_PERSONAGEM';
        if (comando === 'SALVAR_PROJETO_ATUAL' || comando === 'SALVAR_NOVO_PROJETO') return objetos.length === 0 && tipoProjeto !== 'CAPA_ARTE' && tipoProjeto !== 'PERSONAGEM';
        if (comando === 'CAPTURAR_ARTE_CAPA') return objetos.length === 0 && tipoProjeto !== 'PERSONAGEM';
        return false;
    }, [salvando, ehInicio, objetos.length, tipoProjeto]);

    const aoComando = useCallback((comando: ComandoMenuEditor3D) => {
        if (comando === 'ADD_CUBO') adicionaObjeto('CUBO');
        else if (comando === 'ADD_CILINDRO') adicionaObjeto('CILINDRO');
        else if (comando === 'ADD_ESFERA') adicionaObjeto('ESFERA');
        else if (comando === 'NOVO_MESH') abreCriacaoMalha();
        else if (comando === 'NOVO_PROJETO') iniciaProjetoVazio();
        else if (comando === 'CRIAR_CAPA_ARTE') iniciaCapaArte();
        else if (comando === 'CRIAR_PERSONAGEM') iniciaPersonagem();
        else if (comando === 'SALVAR_PROJETO_ATUAL') salvarProjetoAtual();
        else if (comando === 'SALVAR_NOVO_PROJETO') setModalSalvarAberto(true);
        else if (comando === 'ABRIR_PROJETO') void abrirModalAbrirProjeto();
        else if (comando === 'CAPTURAR_ARTE_CAPA') iniciaCaptura();
    }, [adicionaObjeto, abreCriacaoMalha, iniciaProjetoVazio, iniciaCapaArte, iniciaPersonagem, salvarProjetoAtual, abrirModalAbrirProjeto, iniciaCaptura]);

    const aoCapturar = useCallback((dataUrl: string) => {
        const arte: ArteDeCapa = { id: crypto.randomUUID(), tipo: 'ARTE_CAPA', largura: LARGURA_ARTE_DE_CAPA, altura: ALTURA_ARTE_DE_CAPA, imagem: dataUrl, origem: 'SNAPSHOT_3D', criadoEmMs: Date.now() };
        salvaArteDeCapa(arte);
        setCapturando(false);
        setCapaSalva(true);
    }, []);

    useEffect(() => {
        if (idSelecionado === null || idSelecionado < 0) { setModoOperacao('OBJETO'); return; }
        function aoTeclar(evento: KeyboardEvent): void {
            if (alvoEhCampoEditavelEditor3D(evento.target)) return;
            if (evento.key === 'Tab') { evento.preventDefault(); setModoOperacao(atual => atual === 'OBJETO' ? 'EDICAO' : 'OBJETO'); }
            if (evento.key === 'g') setModo('translate');
            if (evento.key === 'r') setModo('rotate');
            if (evento.key === 's') setModo('scale');
        };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [idSelecionado]);

    useEffect(() => { setVerticesSelecionados([]); setFaceSelecionada(null); setModoSelecaoEdicao('VERTICE'); }, [modoOperacao, idSelecionado]);

    useEffect(() => { setVerticesSelecionados([]); setFaceSelecionada(null); }, [modoSelecaoEdicao]);

    // Ao sair do Início para o editor, o Canvas monta agora; reforça a remedição para não ficar preto no 1º frame.
    useEffect(() => {
        if (ehInicio) return;
        const tempos = [60, 220, 440].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, [ehInicio]);

    // Sair do POV ao deselecionar a câmera.
    useEffect(() => { if (idSelecionado !== SELECAO_CAMERA_EDITOR3D) setCamPovAtiva(false); }, [idSelecionado]);

    // ESC sai do POV.
    useEffect(() => {
        if (!camPovAtiva) return;
        function aoTeclar(evento: KeyboardEvent): void { if (evento.key === 'Escape') setCamPovAtiva(false); };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [camPovAtiva]);

    useEffect(() => {
        if (modoOperacao !== 'EDICAO') return;
        function aoTeclarEdicao(evento: KeyboardEvent): void {
            if (alvoEhCampoEditavelEditor3D(evento.target)) return;
            if (evento.key === '1') setModoSelecaoEdicao('VERTICE');
            else if (evento.key === '2') setModoSelecaoEdicao('ARESTA');
            else if (evento.key === '3') setModoSelecaoEdicao('FACE');
            else if (evento.key === 'e' || evento.key === 'E') extrudaFaceSelecionada();
            else if (evento.key === 'b' || evento.key === 'B') chanframaArestaSelecionada();
        };
        window.addEventListener('keydown', aoTeclarEdicao);
        return () => window.removeEventListener('keydown', aoTeclarEdicao);
    }, [modoOperacao, extrudaFaceSelecionada, chanframaArestaSelecionada]);

    const colecaoOcultaPorObjeto = useMemo(() => {
        const ocultos = new Set<number>();
        for (const colecao of colecoes) if (!colecao.visivel) for (const id of colecao.idsObjetos) ocultos.add(id);
        return ocultos;
    }, [colecoes]);

    const objetosResumo = useMemo<ObjetoResumoEditor3D[]>(() => objetos.map(objeto => ({ id: objeto.id, nome: objeto.nome, icone: objeto.idPeca !== null ? '🧥' : iconeTipoPrimitivaEditor3D(objeto.tipo), tipoRotulo: objeto.idPeca !== null ? 'Peça' : rotuloTipoPrimitivaEditor3D(objeto.tipo), visivel: objeto.visivel })), [objetos]);

    const objetoSelecionadoResumo = useMemo(() => {
        if (idSelecionado === null || idSelecionado < 0) return null;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return null;
        const pecaDoObjeto = objeto.idPeca !== null ? (pecas.find(peca => peca.idPeca === objeto.idPeca) ?? null) : null;
        return { nome: objeto.nome, cor: objeto.cor, tipoRotulo: objeto.idPeca !== null ? 'Peça' : rotuloTipoPrimitivaEditor3D(objeto.tipo), subdivisao: objeto.subdivisao, peca: pecaDoObjeto !== null ? { idPeca: pecaDoObjeto.idPeca, nome: pecaDoObjeto.nome } : null };
    }, [objetos, pecas, idSelecionado]);

    const regioesCorpo = useMemo(() => corpoPersonagem !== null ? REGIOES_CORPO_EDITOR3D.map(membro => ({ membro, rotulo: ROTULO_REGIAO_CORPO_EDITOR3D[membro] })) : [], [corpoPersonagem]);

    const pecasDaRegiaoSelecionada = useMemo(() => {
        if (regiaoCorpoSelecionada === null) return [];
        return pecas.filter(peca => peca.membro === regiaoCorpoSelecionada).map(peca => ({ idPeca: peca.idPeca, nome: peca.nome }));
    }, [pecas, regiaoCorpoSelecionada]);

    const idsObjetosEmColecoes = useMemo(() => new Set(colecoes.flatMap(colecao => [...colecao.idsObjetos])), [colecoes]);
    const objetosRaizResumo = useMemo(() => objetosResumo.filter(objeto => !idsObjetosEmColecoes.has(objeto.id)), [objetosResumo, idsObjetosEmColecoes]);
    const colecoesArvore = useMemo<ColecaoArvoreEditor3D[]>(() => colecoes.map(colecao => ({ id: colecao.id, nome: colecao.nome, visivel: colecao.visivel, objetos: colecao.idsObjetos.map(id => objetosResumo.find(objeto => objeto.id === id)).filter((objeto): objeto is ObjetoResumoEditor3D => objeto !== undefined) })), [colecoes, objetosResumo]);
    const abasResumo = useMemo(() => abas.map(aba => {
        const ativa = aba.idAba === idAbaAtiva;
        const ehInicioDaAba = ativa ? ehInicio : (aba.cenaInativa?.ehInicio ?? false);
        const projetoDaAba = ativa ? projetoAberto : (aba.cenaInativa?.projetoAberto ?? null);
        const alteradoDaAba = ativa ? alterado : (aba.cenaInativa?.alterado ?? false);
        return { idAba: aba.idAba, nome: ehInicioDaAba ? 'Início' : (projetoDaAba?.nome ?? aba.nomePadrao), ativa, alterado: !ehInicioDaAba && (alteradoDaAba || projetoDaAba === null) };
    }), [abas, idAbaAtiva, ehInicio, projetoAberto, alterado]);

    return (
        <div className={styles.recipiente_editor_3d}>
            <BarraMenusEditor3D comandoDesabilitado={comandoDesabilitado} aoComando={aoComando} podeDesfazer={!ehInicio && pilhaDesfazer.length > 0} podeRefazer={!ehInicio && pilhaRefazer.length > 0} aoDesfazer={desfazer} aoRefazer={refazer} />
            <BarraAbasEditor3D abas={abasResumo} aoSelecionar={trocaAba} aoFechar={fechaAba} aoNovaAba={() => abreNovaAba(CENA_INICIO_EDITOR3D)} />

            {ehInicio ? (
                <HomeEditor3D aoProjetoVazio={iniciaProjetoVazio} aoCapaArte={iniciaCapaArte} aoPersonagem={iniciaPersonagem} aoAbrirProjeto={abreProjetoEmAba} aoAbrirModal={() => void abrirModalAbrirProjeto()} />
            ) : (
                <div className={styles.area_editor}>
                <div className={styles.viewport}>
                    <SeletorModoEditor3D modoOperacao={modoOperacao} modoTransform={modo} podeEditar={idSelecionado !== null && idSelecionado > 0} aoTrocarModoOperacao={setModoOperacao} />
                    {modoOperacao === 'EDICAO' && <BarraEdicaoMalhaEditor3D modoSelecao={modoSelecaoEdicao} podeExtrudar={modoSelecaoEdicao === 'FACE' && faceSelecionada !== null} podeChanfrar={modoSelecaoEdicao === 'ARESTA' && verticesSelecionados.length === 2} podeCortarAnel={modoSelecaoEdicao === 'ARESTA' && verticesSelecionados.length === 2} podeInsetar={modoSelecaoEdicao === 'FACE' && faceSelecionada !== null} podeExcluir={(modoSelecaoEdicao === 'FACE' && faceSelecionada !== null) || (modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length > 0)} podeFundir={modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length >= 2} quantidadeBevel={quantidadeBevel} fatorInset={fatorInset} aoTrocarModoSelecao={setModoSelecaoEdicao} aoExtrudar={extrudaFaceSelecionada} aoChanfrar={chanframaArestaSelecionada} aoCortarAnel={cortaAnelSelecionado} aoInsetar={insetaFaceSelecionada} aoExcluir={excluiSelecaoEdicao} aoFundir={fundeVerticesSelecionadosEdicao} aoMudarQuantidadeBevel={setQuantidadeBevel} aoMudarFatorInset={setFatorInset} />}
                    <BotaoComandoEditor3D />

                    <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} resize={{ offsetSize: true }} camera={{ position: [6, 5, 6], fov: 38, near: 0.1, far: 200 }} onPointerMissed={() => { if (modoOperacao === 'EDICAO') setVerticesSelecionados([]); else { setIdSelecionado(null); setRegiaoCorpoSelecionada(null); } }}>
                        <color attach="background" args={['#0e0c14']} />
                        <ambientLight intensity={0.6} color="#eef2f6" />
                        <hemisphereLight intensity={0.5} color="#f4f7fb" groundColor="#9aa1ad" />
                        <directionalLight castShadow position={[8, 12, 6]} intensity={1.1} color="#fff4e2" />

                        {!capturando && <ChaoEditor3D />}

                        {tipoProjeto === 'PERSONAGEM' && corpoPersonagem && <CorpoPersonagemViewportEditor3D corpo={corpoPersonagem} selecionado={idSelecionado === SELECAO_CORPO_PERSONAGEM_EDITOR3D} aoSelecionar={() => selecionaCorpo(null)} />}

                        {objetos.map(objeto => <ObjetoEditavelEditor3D key={objeto.id} objeto={objeto} visivelEfetivo={objeto.visivel && !colecaoOcultaPorObjeto.has(objeto.id)} selecionado={objeto.id === idSelecionado} edicaoAtiva={modoOperacao === 'EDICAO' && objeto.id === idSelecionado} modoSelecaoEdicao={modoSelecaoEdicao} verticesSelecionados={verticesSelecionados} faceSelecionada={faceSelecionada} modo={modo} ocultarGizmo={capturando} aoSelecionar={setIdSelecionado} aoSelecionarSubElemento={selecionaSubElemento} aoMoverVertices={moveVerticesSelecionados} aoIniciarArrasto={registraHistoricoArrasto} registraMeshSelecionada={registraMeshSelecionada} registraMesh={registraMesh} aoTransformar={sincronizaTransformSelecionado} />)}

                        {paramsCriacao && <PreviewMalhaEditor3D params={paramsCriacao} />}

                        {tipoProjeto === 'CAPA_ARTE' && camera && <CameraCapaArteEditor3D camera={camera} selecionada={idSelecionado === SELECAO_CAMERA_EDITOR3D} ocultarGizmo={capturando} povAtiva={camPovAtiva} aoSelecionarCamera={() => setIdSelecionado(SELECAO_CAMERA_EDITOR3D)} aoMoverPosicao={moveCameraPosicao} aoMoverAlvo={moveCameraAlvo} />}
                        {tipoProjeto === 'CAPA_ARTE' && camera && <TituloCapaArteEditor3D camera={camera} titulo={capaArte.titulo} mostrarGizmo={idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D && !camPovAtiva && !capturando} aoSelecionar={() => setIdSelecionado(SELECAO_TITULO_CAPA_ARTE_EDITOR3D)} aoMover={moveTituloPosicao} />}
                        {tipoProjeto === 'CAPA_ARTE' && camera && <PreviewVivoCapaArteEditor3D camera={camera} ativo={idSelecionado === SELECAO_CAMERA_EDITOR3D || idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D} refCanvas={refCanvasPreviewCapa} />}
                        <RenderizadorCapaArteEditor3D aoRegistrar={registraRenderCapa} />

                        <CapturadorArteDeCapa capturando={capturando} aoCapturar={aoCapturar} />
                        {camPovAtiva && camera ? (
                            <CameraPovEditor3D camera={camera} permitePan={!alvoTravado} aoNavegar={navegaCameraPov} />
                        ) : (
                            <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0, 1, 0]} minDistance={2} maxDistance={60} />
                        )}
                        {!capturando && (
                            <GizmoHelper alignment="top-right" margin={[72, 72]}>
                                <GizmoViewport axisColors={['#c0392b', '#27ae60', '#2980b9']} labelColor="#eaeaea" />
                            </GizmoHelper>
                        )}
                    </Canvas>

                    {paramsCriacao && <PainelParametrizacaoMeshEditor3D params={paramsCriacao} aoMudarTipo={mudaTipoCriacao} aoMudarSegmentos={mudaSegmentosCriacao} aoMudarVetor={mudaVetorCriacao} aoConfirmar={confirmaCriacaoMalha} aoCancelar={cancelaCriacaoMalha} />}

                    {camPovAtiva && (
                        <div className={styles.overlay_pov_camera}>
                            <div className={styles.guia_enquadramento_pov} />
                            <span className={styles.aviso_pov_camera}>Controlando a câmera · navegue para enquadrar · ESC para sair</span>
                        </div>
                    )}
                </div>

                <PainelLateralEditor3D objetosRaiz={objetosRaizResumo} colecoes={colecoesArvore} totalObjetos={objetos.length} idSelecionado={idSelecionado} objetoSelecionado={objetoSelecionadoResumo} aoRenomearObjeto={nome => idSelecionado !== null && renomeiaObjeto(idSelecionado, nome)} aoMudarCorObjeto={cor => idSelecionado !== null && mudaCorObjeto(idSelecionado, cor)} aoMudarSubdivisaoObjeto={subdivisao => idSelecionado !== null && mudaSubdivisaoObjeto(idSelecionado, subdivisao)} aoEspelharObjetoX={espelhaObjetoSelecionadoX} aoDuplicarObjeto={() => idSelecionado !== null && duplicaObjeto(idSelecionado)} aoExcluirObjeto={() => idSelecionado !== null && removeObjeto(idSelecionado)} corpoPersonagem={corpoPersonagem} regioesCorpo={regioesCorpo} regiaoCorpoSelecionada={regiaoCorpoSelecionada} rotuloRegiaoSelecionada={regiaoCorpoSelecionada !== null ? ROTULO_REGIAO_CORPO_EDITOR3D[regiaoCorpoSelecionada] : 'Corpo'} pecasDaRegiao={pecasDaRegiaoSelecionada} aoSelecionarCorpo={selecionaCorpo} aoAtualizarParametroCorpo={atualizaParametroCorpo} aoMudarCorCorpo={mudaCorCorpo} aoAnexarPeca={() => void abrirModalAnexarPeca()} aoRemoverPeca={removePeca} transformSelecionado={transformSelecionado} camera={camera} capaArte={capaArte} refPreviewCamera={refCanvasPreviewCapa} povCameraAtiva={camPovAtiva} alvoTravado={alvoTravado} capturando={capturando} capaSalva={capaSalva} aoSelecionar={id => { setRegiaoCorpoSelecionada(null); setIdSelecionado(id === SELECAO_CAMERA_EDITOR3D || id === SELECAO_TITULO_CAPA_ARTE_EDITOR3D ? id : id < 0 ? null : id); }} aoAlternarVisibilidade={alternaVisibilidade} aoAtualizarTransform={atualizaTransformObjeto} aoAtualizarCameraVetor={atualizaCameraVetor} aoAtualizarCameraFov={atualizaCameraFov} aoAtualizarTituloTexto={atualizaTituloTexto} aoAtualizarTituloTransform={atualizaTituloTransform} aoAtualizarTituloCor={atualizaTituloCor} aoAlternarPovCamera={alternaPovCamera} aoAlternarAlvoTravado={alternaAlvoTravado} aoCapturar={iniciaCaptura} aoCriarColecao={criaColecao} aoAlternarVisibilidadeColecao={alternaVisibilidadeColecao} aoRenomearColecao={renomeiaColecao} aoRemoverColecao={removeColecao} aoMoverObjeto={moveObjetoParaColecao} />
                </div>
            )}

            {modalSalvarAberto && <ModalSalvarProjetoEditor3D nomeInicial={projetoAberto?.nome ?? ''} salvando={salvando} aoConfirmar={nome => void salvar(nome)} aoFechar={() => setModalSalvarAberto(false)} />}
            {modalAbrirAberto && <ModalAbrirProjetoEditor3D projetos={projetosListados} carregando={carregandoLista} aoSelecionar={abreProjetoEmAba} aoFechar={() => setModalAbrirAberto(false)} />}
            {modalAnexarPecaAberto && <ModalAbrirProjetoEditor3D titulo="Anexar peça ao membro" projetos={projetosListados.filter(projeto => projeto.id !== projetoAberto?.id)} carregando={carregandoLista} aoSelecionar={(id, nome) => void anexaPeca(id, nome)} aoFechar={() => setModalAnexarPecaAberto(false)} />}
        </div>
    );
};

interface CapturadorArteDeCapaProps {
    readonly capturando: boolean;
    readonly aoCapturar: (dataUrl: string) => void;
};

function CapturadorArteDeCapa({ capturando, aoCapturar }: CapturadorArteDeCapaProps) {
    const gl = useThree(estado => estado.gl);

    useEffect(() => {
        if (!capturando) return;
        let segundoQuadro = 0;
        // Dois quadros de espera para garantir que o frame limpo (sem grade/volume/gizmo) já foi desenhado antes de capturar.
        const primeiroQuadro = requestAnimationFrame(() => {
            segundoQuadro = requestAnimationFrame(() => aoCapturar(reenquadraArteDeCapa(gl.domElement)));
        });
        return () => { cancelAnimationFrame(primeiroQuadro); cancelAnimationFrame(segundoQuadro); };
    }, [capturando, gl, aoCapturar]);

    return null;
};

interface ObjetoEditavelEditor3DProps {
    readonly objeto: ObjetoEditor3D;
    readonly visivelEfetivo: boolean;
    readonly selecionado: boolean;
    readonly edicaoAtiva: boolean;
    readonly modoSelecaoEdicao: ModoSelecaoEdicaoEditor3D;
    readonly verticesSelecionados: readonly number[];
    readonly faceSelecionada: string | null;
    readonly modo: ModoTransformEditor3D;
    readonly ocultarGizmo: boolean;
    readonly aoSelecionar: (id: number) => void;
    readonly aoSelecionarSubElemento: (vertices: readonly number[], faceId: string | null, aditivo: boolean) => void;
    readonly aoMoverVertices: (delta: [number, number, number]) => void;
    readonly aoIniciarArrasto: () => void;
    readonly registraMeshSelecionada: (mesh: Mesh | null) => void;
    readonly registraMesh: (id: number, mesh: Mesh | null) => void;
    readonly aoTransformar: () => void;
};

function ObjetoEditavelEditor3D({ objeto, visivelEfetivo, selecionado, edicaoAtiva, modoSelecaoEdicao, verticesSelecionados, faceSelecionada, modo, ocultarGizmo, aoSelecionar, aoSelecionarSubElemento, aoMoverVertices, aoIniciarArrasto, registraMeshSelecionada, registraMesh, aoTransformar }: ObjetoEditavelEditor3DProps) {
    const meshRef = useRef<Mesh>(null);
    // A geometria de EXIBIÇÃO aplica a subdivisão Catmull-Clark sobre a gaiola; os handles de edição seguem na gaiola (objeto.malha).
    const geometria = useMemo(() => criaGeometriaDeMalha(objeto.subdivisao > 0 ? subdivideMalhaCatmullClark(objeto.malha, objeto.subdivisao) : objeto.malha), [objeto.malha, objeto.subdivisao]);
    const proxyVertices = useMemo(() => new Object3D(), []);
    const arestas = useMemo(() => arestasDaMalha(objeto.malha), [objeto.malha]);

    // Wireframe da GAIOLA no modo edição: as arestas reais como linhas (as bolinhas são só alças de seleção).
    const geometriaArestasGaiola = useMemo(() => {
        if (!edicaoAtiva) return null;
        const posicoes = new Float32Array(arestas.length * 6);
        arestas.forEach((aresta, i) => {
            const va = objeto.malha.vertices[aresta.a];
            const vb = objeto.malha.vertices[aresta.b];
            posicoes.set([va[0], va[1], va[2], vb[0], vb[1], vb[2]], i * 6);
        });
        const geometriaLinhas = new BufferGeometry();
        geometriaLinhas.setAttribute('position', new BufferAttribute(posicoes, 3));
        return geometriaLinhas;
    }, [edicaoAtiva, arestas, objeto.malha]);

    useEffect(() => () => { geometriaArestasGaiola?.dispose(); }, [geometriaArestasGaiola]);
    const centroidRef = useRef(new Vector3());
    const temSelecaoVertices = edicaoAtiva && verticesSelecionados.length > 0;

    useEffect(() => () => geometria.dispose(), [geometria]);

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        mesh.position.set(objeto.transformInicial.posicao[0], objeto.transformInicial.posicao[1], objeto.transformInicial.posicao[2]);
        mesh.rotation.set(objeto.transformInicial.rotacao[0], objeto.transformInicial.rotacao[1], objeto.transformInicial.rotacao[2]);
        mesh.scale.set(objeto.transformInicial.escala[0], objeto.transformInicial.escala[1], objeto.transformInicial.escala[2]);
    }, [objeto.transformInicial]);

    useEffect(() => {
        registraMesh(objeto.id, meshRef.current);
        return () => registraMesh(objeto.id, null);
    }, [objeto.id, registraMesh]);

    useEffect(() => {
        if (!selecionado) return;
        registraMeshSelecionada(meshRef.current);
        aoTransformar();
        return () => { registraMeshSelecionada(null); aoTransformar(); };
    }, [selecionado, registraMeshSelecionada, aoTransformar]);

    // Posiciona o proxy (alvo do gizmo) no centroide dos vértices selecionados, em espaço local da mesh.
    useEffect(() => {
        if (!temSelecaoVertices) return;
        const centro = new Vector3();
        for (const indice of verticesSelecionados) centro.add(new Vector3(objeto.malha.vertices[indice][0], objeto.malha.vertices[indice][1], objeto.malha.vertices[indice][2]));
        centro.divideScalar(verticesSelecionados.length);
        proxyVertices.position.copy(centro);
        centroidRef.current.copy(centro);
    }, [temSelecaoVertices, verticesSelecionados, objeto.malha, proxyVertices]);

    function aoClicar(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionar(objeto.id); };
    function aoClicarHandle(evento: ThreeEvent<MouseEvent>, vertices: readonly number[], faceId: string | null): void { evento.stopPropagation(); aoSelecionarSubElemento(vertices, faceId, evento.nativeEvent.shiftKey); };

    function aoMoverProxy(): void {
        const delta = proxyVertices.position.clone().sub(centroidRef.current);
        // Delta não-finito (estado de arrasto corrompido) contaminaria a malha com NaN — e NaN persiste no projeto.
        if (!Number.isFinite(delta.x) || !Number.isFinite(delta.y) || !Number.isFinite(delta.z)) return;
        if (delta.lengthSq() === 0) return;
        centroidRef.current.copy(proxyVertices.position);
        aoMoverVertices([delta.x, delta.y, delta.z]);
    };

    return (
        <>
            <mesh ref={meshRef} geometry={geometria} visible={visivelEfetivo} castShadow receiveShadow onClick={aoClicar}>
                <meshStandardMaterial color={objeto.cor} emissive={selecionado ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.35 : 0} roughness={0.55} metalness={0.1} flatShading={objeto.subdivisao === 0} key={`material-${objeto.subdivisao === 0 ? 'flat' : 'suave'}`} />
                {edicaoAtiva && modoSelecaoEdicao === 'VERTICE' && objeto.malha.vertices.map((vertice, indice) => (
                    <mesh key={`v${indice}`} position={vertice} onClick={evento => aoClicarHandle(evento, [indice], null)}>
                        <sphereGeometry args={[0.05, 10, 10]} />
                        <meshBasicMaterial color={verticesSelecionados.includes(indice) ? '#ff8a3d' : '#f0d28a'} depthTest={false} />
                    </mesh>
                ))}
                {edicaoAtiva && modoSelecaoEdicao === 'ARESTA' && arestas.map(aresta => {
                    const verticeA = objeto.malha.vertices[aresta.a];
                    const verticeB = objeto.malha.vertices[aresta.b];
                    const selecionada = verticesSelecionados.includes(aresta.a) && verticesSelecionados.includes(aresta.b);
                    return (
                        <mesh key={aresta.id} position={[(verticeA[0] + verticeB[0]) / 2, (verticeA[1] + verticeB[1]) / 2, (verticeA[2] + verticeB[2]) / 2]} onClick={evento => aoClicarHandle(evento, [aresta.a, aresta.b], null)}>
                            <sphereGeometry args={[0.05, 10, 10]} />
                            <meshBasicMaterial color={selecionada ? '#ff8a3d' : '#9ad0ff'} depthTest={false} />
                        </mesh>
                    );
                })}
                {edicaoAtiva && modoSelecaoEdicao === 'FACE' && objeto.malha.faces.map(face => (
                    <mesh key={face.id} position={centroideDaMalha(objeto.malha, face.indicesVertices)} onClick={evento => aoClicarHandle(evento, face.indicesVertices, face.id)}>
                        <sphereGeometry args={[0.06, 10, 10]} />
                        <meshBasicMaterial color={faceSelecionada === face.id ? '#ff8a3d' : '#7bdc8a'} depthTest={false} />
                    </mesh>
                ))}
                {edicaoAtiva && geometriaArestasGaiola && (
                    <lineSegments geometry={geometriaArestasGaiola} raycast={() => null}>
                        <lineBasicMaterial color="#f0d28a" transparent opacity={0.5} depthTest={false} />
                    </lineSegments>
                )}
                {temSelecaoVertices && <primitive object={proxyVertices} />}
            </mesh>
            {selecionado && visivelEfetivo && !edicaoAtiva && !ocultarGizmo && <TransformControls object={meshRef} mode={modo} onMouseDown={aoIniciarArrasto} onObjectChange={aoTransformar} />}
            {temSelecaoVertices && !ocultarGizmo && <TransformControls object={proxyVertices} mode="translate" space="local" onMouseDown={aoIniciarArrasto} onObjectChange={aoMoverProxy} />}
        </>
    );
};

interface CorpoPersonagemViewportEditor3DProps {
    readonly corpo: CorpoPersonagemCenaCanonicaEditor3D;
    readonly selecionado: boolean;
    readonly aoSelecionar: () => void;
};

// Corpo contínuo do Personagem no viewport: casca única regenerada dos parâmetros (gerador compartilhado com a Sala de Jogo), shading suave, cor própria.
// As mãos são MODELADAS (gaiola + subdivisão Catmull-Clark — cada dedo uma forma) e ancoram nos punhos derivados do mesmo gerador.
function CorpoPersonagemViewportEditor3D({ corpo, selecionado, aoSelecionar }: CorpoPersonagemViewportEditor3DProps) {
    const geometria = useMemo(() => geraGeometriaCorpoPersonagem(corpo), [corpo]);
    const geometriaMao = useMemo(() => criaGeometriaDeMalha(criaMalhaMaoSuavizadaCorpoPersonagem()), []);
    const corCorpo = useMemo(() => new Color(corpo.cor[0], corpo.cor[1], corpo.cor[2]), [corpo.cor]);
    const deslocamentoY = (geometria.userData as { deslocamentoY?: number }).deslocamentoY ?? 0;
    const maos = useMemo(() => ([1, -1] as const).map(lado => ({ lado, posicao: ancoraPunhoCorpoPersonagem(corpo, lado), escala: escalaMaoCorpoPersonagem(corpo, lado) })), [corpo]);

    useEffect(() => () => geometria.dispose(), [geometria]);
    useEffect(() => () => geometriaMao.dispose(), [geometriaMao]);

    return (
        <group>
            <mesh geometry={geometria} castShadow receiveShadow onClick={evento => { evento.stopPropagation(); aoSelecionar(); }}>
                <meshStandardMaterial color={corCorpo} emissive={selecionado ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.22 : 0} roughness={0.5} metalness={0.05} />
            </mesh>
            {maos.map(mao => (
                <mesh key={mao.lado} geometry={geometriaMao} position={[mao.posicao[0], mao.posicao[1] + deslocamentoY, mao.posicao[2]]} scale={mao.escala} castShadow receiveShadow onClick={evento => { evento.stopPropagation(); aoSelecionar(); }}>
                    <meshStandardMaterial color={corCorpo} emissive={selecionado ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.22 : 0} roughness={0.5} metalness={0.05} />
                </mesh>
            ))}
        </group>
    );
};

function PreviewMalhaEditor3D({ params }: { readonly params: ParamCriacaoMalhaEditor3D }) {
    const geometria = useMemo(() => criaGeometriaDeMalha(criaMalhaPrimitiva(params.tipo, params.segmentos)), [params.tipo, params.segmentos]);

    useEffect(() => () => geometria.dispose(), [geometria]);

    return (
        <mesh geometry={geometria} position={params.posicao} rotation={params.rotacao} scale={params.escala}>
            <meshStandardMaterial color="#9aa0b8" transparent opacity={0.6} roughness={0.6} flatShading />
        </mesh>
    );
};

function ChaoEditor3D() {
    return (
        <group userData={{ naoExibirNaCapa: true }}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#16131d" roughness={0.9} metalness={0.05} />
            </mesh>
            <Grid position={[0, 0.002, 0]} args={[40, 40]} cellSize={1} cellThickness={0.6} cellColor="#3a3550" sectionSize={5} sectionThickness={1.1} sectionColor="#6c5f8f" fadeDistance={60} fadeStrength={1} followCamera={false} infiniteGrid={false} />
        </group>
    );
};
