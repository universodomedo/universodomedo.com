'use client';

import styles from './Editor3D.module.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { Box3, BufferAttribute, BufferGeometry, Color, EdgesGeometry, Mesh, MeshStandardMaterial, Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three';
import type { EventDispatcher } from 'three';
import type { CorpoPersonagemCenaCanonicaEditor3D, MembroPersonagemEditor3D, OperacaoRoteiroEditor3D, PassoRoteiroEditor3D, PecaPersonagemCenaCanonicaEditor3D, Projeto3DResumoPersistido, RoteiroEditor3DPersistido, RoteiroEditor3DResumoPersistido, TipoFonteDeLuzMapa, TipoProjetoEditor3D } from 'types-nora-api';

import { CORPO_PERSONAGEM_PADRAO_EDITOR3D, ancoraPunhoCorpoPersonagem, ancoraRegiaoCorpoPersonagem, escalaMaoCorpoPersonagem, geraGeometriaCorpoPersonagem } from 'Funcionalidades/CorpoPersonagem/corpoPersonagem.gerador';
import { criaMalhaMaoSuavizadaCorpoPersonagem } from './corpoPersonagem.maos';

import { ALTURA_ARTE_DE_CAPA, LARGURA_ARTE_DE_CAPA, type ArteDeCapa } from 'Funcionalidades/ArteDeCapa/arteDeCapa.types';
import { salvaArteDeCapa } from 'Funcionalidades/ArteDeCapa/arteDeCapa.storage';
import { BarraMenusEditor3D } from './BarraMenusEditor3D';
import { BarraAbasEditor3D } from './BarraAbasEditor3D';
import { BotaoComandoEditor3D } from './BotaoComandoEditor3D';
import { GizmoNavegacaoEditor3D } from './GizmoNavegacaoEditor3D';
import { PainelLateralEditor3D, type ColecaoArvoreEditor3D, type ObjetoResumoEditor3D } from './PainelLateralEditor3D';
import { ModalSalvarProjetoEditor3D } from './ModalSalvarProjetoEditor3D';
import { ModalAbrirProjetoEditor3D } from './ModalAbrirProjetoEditor3D';
import { CAMERA_PADRAO_CAPA_ARTE_EDITOR3D, CAPA_ARTE_PADRAO_EDITOR3D, COR_OBJETO_PADRAO_EDITOR3D, capaArteDaCena, cameraDaCena, corpoPersonagemDaCena, desserializaCenaCanonicaEditor3D, pecasDaCena, restringeTextoNaCameraEditor3D, serializaCenaCanonicaEditor3D, tipoProjetoDaCena, type CameraEditor3D, type CapaArteEditor3D, type EntradaSerializacaoObjetoEditor3D, type ObjetoCarregadoEditor3D, type TipoPrimitivaEditor3D, type TransformEditor3D } from './editor3D.projeto.serializacao';
import { consultaProjeto3D, listaProjetos3D, salvaProjeto3D } from './editor3D.projeto.api';
import type { ComandoMenuEditor3D } from './editor3D.menus';
import { CAMPO_DO_MODO_TRANSFORM_EDITOR3D, CURSOR_MODO_TRANSFORM_EDITOR3D, SELECAO_CAMERA_EDITOR3D, SELECAO_CORPO_PERSONAGEM_EDITOR3D, SELECAO_TITULO_CAPA_ARTE_EDITOR3D, TRAVAS_TRANSFORM_INICIAL_EDITOR3D, type CampoTransformEditor3D, type ModoTransformEditor3D, type TravasTransformEditor3D } from './editor3D.tipos';
import { MAXIMO_ESPESSURA_MALHA_EDITOR3D, MAXIMO_SUBDIVISAO_MALHA_EDITOR3D, aplicaTransformNaMalha, arestasDaMalha, centroideDaMalha, chanframaAresta, cortaAnelAresta, criaGeometriaDeMalha, criaMalhaCilindro, criaMalhaCubo, criaMalhaEsfera, dimensoesDaMalha, espelhaMalhaX, excluiFacesDaMalha, excluiVerticesDaMalha, extrudaFace, fundeVerticesDaMalha, insetaFacesDaMalha, solidificaMalha, subdivideMalhaCatmullClark, type MalhaEditavelLocal, type Vetor3Malha } from './editor3D.malha';
import { BarraEdicaoMalhaEditor3D, type ModoSelecaoEdicaoEditor3D } from './BarraEdicaoMalhaEditor3D';
import { IndicadorModoEditor3D } from './IndicadorModoEditor3D';
import { PainelParametrizacaoMeshEditor3D, type CampoVetorCriacaoEditor3D, type ParamCriacaoMalhaEditor3D } from './PainelParametrizacaoMeshEditor3D';
import { CameraCapaArteEditor3D, CameraPovEditor3D, PreviewVivoCapaArteEditor3D, RenderizadorCapaArteEditor3D, type RenderCapaArteEditor3D } from './CameraCapaArteEditor3D';
import { TituloCapaArteEditor3D } from './TituloCapaArteEditor3D';
import type { CampoVetorCameraCapaArteEditor3D } from './PainelCameraCapaArteEditor3D';
import { HomeEditor3D } from './HomeEditor3D';
import { LuzesViewportEditor3D } from './LuzesViewportEditor3D';
import { EsquemaEletricoEditor3D } from './EsquemaEletricoEditor3D';
import { INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D, ROTULO_CURTO_TIPO_FONTE_DE_LUZ_EDITOR3D, alternaVinculoLuzInterruptorEditor3D, aplicaCampoLuzEditor3D, camadaJogoDoProjeto, criaFonteDeLuzEditor3D, serializaCamadaJogoEditor3D, vinculaLuzInterruptorEditor3D, type ComandoEditor3D, type FonteDeLuzEditor3D } from './editor3D.camadaJogo';
import { COLECAO_SISTEMA_INICIAL_EDITOR3D, colecaoMostraFiacao, colecaoMostraGeometria, colecaoPermiteComandoMenu, colecaoSistemaInicialDoTipoProjeto, colecaoUsaIluminacaoDeJogo, colecoesSistemaDoTipoProjeto, type TipoColecaoSistemaEditor3D } from './editor3D.colecoesSistema';
import type { CampoLuzEditor3D } from './PainelLuzEditor3D';
import { PainelRoteiroEditor3D } from './PainelRoteiroEditor3D';
import { ESTADO_INICIAL_ROTEIRO_EDITOR3D, executaPassosRoteiroEditor3D, rotuloOperacaoRoteiroEditor3D, type EstadoRoteiroEditor3D } from './editor3D.operacoes';
import { acrescentaPassoComCoalescenciaRoteiroEditor3D, montaGoldenRoteiroEditor3D, validaRoteiroContraGoldenEditor3D, type ModoRoteiroEditor3D, type ResultadoValidacaoRoteiroEditor3D } from './editor3D.roteiro';
import { aprovaRoteiroEditor3D, atualizaPassosRoteiroEditor3D, bloqueiaRoteiroEditor3D, consultaRoteiroEditor3D, listaRoteirosEditor3D } from './editor3D.roteiro.api';

type ModoOperacaoEditor3D = 'OBJETO' | 'EDICAO';
// Raycast no-op estável (X-Ray): o mesh deixa de interceptar cliques sem recriar função a cada render.
const raycastNuloEditor3D = (): null => null;
// Slot de material adicional do objeto (slot 0 = base = `cor`; extras são slots 1..N). Faces apontam o slot via `slotMaterial`.
// Exportados como TIPO para a camada de operações de Roteiro (editor3D.operacoes) manipular o mesmo shape sem duplicá-lo.
export type MaterialExtraEditor3D = { nome: string; cor: string; };
export type ObjetoEditor3D = { id: number; tipo: TipoPrimitivaEditor3D; nome: string; cor: string; materiaisExtras: readonly MaterialExtraEditor3D[]; idPeca: string | null; visivel: boolean; malha: MalhaEditavelLocal; subdivisao: number; espessura: number; transformInicial: TransformEditor3D; };

// Convenção de eixos do editor: Z para cima (Blender), -Y para frente. Mudança GLOBAL do Three.js — afeta gizmo, órbita e todo objeto novo.
// TODO(z-up): a stack inteira é Z-up; mover este set para um init único do app quando o render do jogo migrar.
Object3D.DEFAULT_UP.set(0, 0, 1);

const EPSILON_CHAO_EDITOR3D = 0.0001;
const TOLERANCIA_PENETRACAO_ASSENTAMENTO_EDITOR3D = 0.25;

// Z mínimo MUNDIAL da geometria de EXIBIÇÃO (pós-subdivisão/espessura) do mesh — só a geometria do objeto, sem os filhos (alças de edição). Z-up: o "para baixo" é -Z.
function minimoMundialZMesh(mesh: Mesh): number | null {
    mesh.updateMatrixWorld(true);
    mesh.geometry.computeBoundingBox();
    const caixa = mesh.geometry.boundingBox;
    if (caixa === null) return null;
    const minZ = caixa.clone().applyMatrix4(mesh.matrixWorld).min.z;
    return Number.isFinite(minZ) ? minZ : null;
};

// ASSENTAMENTO EM CAMADAS ("mapa tem gravidade") — Z-up: o piso vive no z=0 e todo objeto assenta na superfície mais alta
// abaixo da sua base — outro objeto (empilhamento) ou o chão. Sem física (R3F não tem gravidade nativa): raycast
// determinístico em 5 pontos da base (cantos + centro do bbox XY) — uma viga apoiada em duas paredes assenta nelas,
// não no vão. Também elimina o subsolo (apoio nunca fica abaixo de 0 — bug real da Cena 3D do Site afundada a -1.5).
function assentaMeshNaCamadaEditor3D(mesh: Mesh, apoios: readonly Mesh[]): boolean {
    const minZ = minimoMundialZMesh(mesh);
    if (minZ === null) return false;
    const caixa = mesh.geometry.boundingBox;
    if (caixa === null) return false;
    const caixaMundo = caixa.clone().applyMatrix4(mesh.matrixWorld);
    // O raio parte de POUCO ACIMA DA BASE (não do topo): apoio mais alto que a tolerância não eleva o objeto — senão
    // um contêiner (a sala) pularia para cima do próprio conteúdo (o cubo). A tolerância ainda des-interpenetra cascas
    // finas (base enfiada num piso de até 25cm sobe para o topo dele).
    const origemZ = minZ + TOLERANCIA_PENETRACAO_ASSENTAMENTO_EDITOR3D;
    const pontosBase: readonly [number, number][] = [
        [caixaMundo.min.x, caixaMundo.min.y],
        [caixaMundo.min.x, caixaMundo.max.y],
        [caixaMundo.max.x, caixaMundo.min.y],
        [caixaMundo.max.x, caixaMundo.max.y],
        [(caixaMundo.min.x + caixaMundo.max.x) / 2, (caixaMundo.min.y + caixaMundo.max.y) / 2],
    ];
    const raycaster = new Raycaster();
    const direcaoBaixo = new Vector3(0, 0, -1);
    let apoioZ = 0;
    for (const [x, y] of pontosBase) {
        raycaster.set(new Vector3(x, y, origemZ), direcaoBaixo);
        for (const alvo of apoios) {
            const impacto = raycaster.intersectObject(alvo, false)[0];
            if (impacto && impacto.point.z > apoioZ) apoioZ = impacto.point.z;
        }
    }
    const deslocamento = apoioZ - minZ;
    if (Math.abs(deslocamento) <= EPSILON_CHAO_EDITOR3D) return false;
    mesh.position.z += deslocamento;
    mesh.updateMatrix();
    return true;
};
// O `state.controls` do R3F é tipado como EventDispatcher; o OrbitControls do drei acrescenta `enabled` — estreitamos p/ togglar durante o drag.
type ControleOrbitaEditor3D = EventDispatcher & { enabled: boolean };

const ROTULO_REGIAO_CORPO_EDITOR3D: Record<MembroPersonagemEditor3D, string> = { CABECA: 'Cabeça', TRONCO: 'Tronco', BRACO_ESQUERDO: 'Braço Esquerdo', BRACO_DIREITO: 'Braço Direito', PERNA_ESQUERDA: 'Perna Esquerda', PERNA_DIREITA: 'Perna Direita' };
const REGIOES_CORPO_EDITOR3D: readonly MembroPersonagemEditor3D[] = ['CABECA', 'TRONCO', 'BRACO_ESQUERDO', 'BRACO_DIREITO', 'PERNA_ESQUERDA', 'PERNA_DIREITA'];

function criaMalhaPrimitiva(tipo: TipoPrimitivaEditor3D, segmentos = 24): MalhaEditavelLocal { return tipo === 'CUBO' ? criaMalhaCubo() : tipo === 'CILINDRO' ? criaMalhaCilindro(segmentos) : criaMalhaEsfera(segmentos); };
type ColecaoEditor3D = { id: number; nome: string; idsObjetos: readonly number[]; visivel: boolean; };
type ProjetoAbertoEditor3D = { id: number; nome: string; };
type CenaArmazenadaEditor3D = { readonly objetos: readonly ObjetoEditor3D[]; readonly colecoes: readonly ColecaoEditor3D[]; readonly pecas: readonly PecaPersonagemCenaCanonicaEditor3D[]; readonly corpoPersonagem: CorpoPersonagemCenaCanonicaEditor3D | null; readonly idSelecionado: number | null; readonly projetoAberto: ProjetoAbertoEditor3D | null; readonly alterado: boolean; readonly ehInicio: boolean; readonly tipoProjeto: TipoProjetoEditor3D; readonly camera: CameraEditor3D | null; readonly capaArte: CapaArteEditor3D; readonly luzes: readonly FonteDeLuzEditor3D[]; readonly idLuzSelecionada: string | null; readonly comandos: readonly ComandoEditor3D[]; };
type AbaEditor3D = { readonly idAba: number; readonly nomePadrao: string; readonly cenaInativa: CenaArmazenadaEditor3D | null; };

// Cena ativa vive no estado plano; abas inativas guardam sua cena (com transforms já capturados das meshes). Coleções são organização de sessão (não vão para a CenaCanonica do banco). `ehInicio` = aba mostra a tela inicial (Home), ainda sem projeto/editor. `tipoProjeto`/`camera`/`capaArte`: projetos Capa de Arte carregam a câmera-output e os textos de overlay (título/assinatura).
const CENA_VAZIA_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: false, tipoProjeto: 'PADRAO', camera: null, capaArte: CAPA_ARTE_PADRAO_EDITOR3D, luzes: [], idLuzSelecionada: null, comandos: [] };
const CENA_INICIO_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: true, tipoProjeto: 'PADRAO', camera: null, capaArte: CAPA_ARTE_PADRAO_EDITOR3D, luzes: [], idLuzSelecionada: null, comandos: [] };
const CENA_CAPA_ARTE_EDITOR3D: CenaArmazenadaEditor3D = { objetos: [], colecoes: [], pecas: [], corpoPersonagem: null, idSelecionado: null, projetoAberto: null, alterado: false, ehInicio: false, tipoProjeto: 'CAPA_ARTE', camera: CAMERA_PADRAO_CAPA_ARTE_EDITOR3D, capaArte: CAPA_ARTE_PADRAO_EDITOR3D, luzes: [], idLuzSelecionada: null, comandos: [] };
// Mapa: cena de autoria de MAPAS jogáveis (a sala do jogo nasce aqui). Estruturalmente igual ao projeto vazio — a diferença é o tipoProjeto persistido, que gateia o consumo (Partida referencia projetos MAPA).
const CENA_MAPA_EDITOR3D: CenaArmazenadaEditor3D = { ...CENA_VAZIA_EDITOR3D, tipoProjeto: 'MAPA' };

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
    const [modo, setModo] = useState<ModoTransformEditor3D>('select');
    // Travas de eixo do gesto (lock do painel Transform): estado do EDITOR, editável em qualquer modo, não serializa.
    const [travasTransform, setTravasTransform] = useState<TravasTransformEditor3D>(TRAVAS_TRANSFORM_INICIAL_EDITOR3D);
    const alternaTravaTransform = useCallback((campo: CampoTransformEditor3D, indice: number): void => {
        setTravasTransform(anterior => ({ ...anterior, [campo]: anterior[campo].map((travada, i) => i === indice ? !travada : travada) as unknown as readonly [boolean, boolean, boolean] }));
    }, []);
    const [modoOperacao, setModoOperacao] = useState<ModoOperacaoEditor3D>('OBJETO');
    const [verticesSelecionados, setVerticesSelecionados] = useState<readonly number[]>([]);
    const [modoSelecaoEdicao, setModoSelecaoEdicao] = useState<ModoSelecaoEdicaoEditor3D>('VERTICE');
    // Seleção de faces é um CONJUNTO (shift aditivo, como nos vértices): operações por face varrem a seleção inteira.
    const [facesSelecionadas, setFacesSelecionadas] = useState<readonly string[]>([]);
    const [quantidadeBevel, setQuantidadeBevel] = useState(0.25);
    const [distanciaInset, setDistanciaInset] = useState(0.5);
    // X-Ray (modo EDIÇÃO): malha translúcida e SELEÇÃO atravessando a geometria — sem ele, handle atrás de parede é inalcançável.
    const [xRayAtivo, setXRayAtivo] = useState(false);
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
    // Fontes de Luz do MAPA: nós de primeira classe da cena, com seleção PRÓPRIA (id string) — não entram na numeração dos objetos.
    const [luzes, setLuzes] = useState<readonly FonteDeLuzEditor3D[]>([]);
    const [idLuzSelecionada, setIdLuzSelecionada] = useState<string | null>(null);
    // Comandos (a fiação): quem aciona o quê. Domínio LÓGICO do mapa — não entra na cena canônica.
    const [comandos, setComandos] = useState<readonly ComandoEditor3D[]>([]);
    const [idComandoSelecionado, setIdComandoSelecionado] = useState<string | null>(null);
    // COLEÇÃO DE SISTEMA ativa: a lente que escopa árvore, menus, seleção e visualização (domínio em editor3D.colecoesSistema).
    // A visualização não tem toggles próprios: a Iluminação É o modo de jogo, e o esquema elétrico segue a luz selecionada.
    const [colecaoSistema, setColecaoSistema] = useState<TipoColecaoSistemaEditor3D>(COLECAO_SISTEMA_INICIAL_EDITOR3D);
    const contadorRef = useRef(0);
    const contadorColecaoRef = useRef(0);
    const contadorAbaRef = useRef(1);
    const [abas, setAbas] = useState<readonly AbaEditor3D[]>([{ idAba: 1, nomePadrao: 'Início', cenaInativa: null }]);
    const [idAbaAtiva, setIdAbaAtiva] = useState(1);
    const refMeshSelecionada = useRef<Mesh | null>(null);
    const registroMeshes = useRef<Map<number, Mesh>>(new Map());
    const registraMeshSelecionada = useCallback((mesh: Mesh | null) => { refMeshSelecionada.current = mesh; }, []);
    const registraMesh = useCallback((id: number, mesh: Mesh | null) => { if (mesh) registroMeshes.current.set(id, mesh); else registroMeshes.current.delete(id); }, []);

    // Apoios do assentamento em camadas: todas as OUTRAS meshes registradas e visíveis da cena.
    const assentaMeshNaCamada = useCallback((mesh: Mesh): boolean => {
        const apoios = [...registroMeshes.current.values()].filter(outra => outra !== mesh && outra.visible);
        return assentaMeshNaCamadaEditor3D(mesh, apoios);
    }, []);
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
        colecoes, pecas, corpoPersonagem, idSelecionado, projetoAberto, alterado, ehInicio, tipoProjeto, camera, capaArte, luzes, idLuzSelecionada, comandos,
    }), [objetos, colecoes, pecas, corpoPersonagem, idSelecionado, projetoAberto, alterado, ehInicio, tipoProjeto, camera, capaArte, luzes, idLuzSelecionada, comandos]);

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
        setLuzes(cena.luzes);
        setIdLuzSelecionada(cena.idLuzSelecionada);
        setComandos(cena.comandos);
        // O painel Transform lê da mesh viva, mas ao repor uma cena (undo/redo/troca de aba) a mesh só assenta no effect do
        // objeto — sincroniza pelo transform gravado na própria cena (o mesmo que a mesh vai receber) p/ não exibir valor velho.
        const objetoSelecionadoCena = cena.idSelecionado !== null && cena.idSelecionado > 0 ? (cena.objetos.find(objeto => objeto.id === cena.idSelecionado) ?? null) : null;
        setTransformSelecionado(objetoSelecionadoCena !== null ? objetoSelecionadoCena.transformInicial : null);
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

    // ---- ROTEIRO (Painel Roteiro): sessão de montagem/validação amarrada a UMA aba. Em montagem, o editor é a VIEW
    // da reexecução: cada operação gravada reexecuta o prefixo na camada pura e repõe a cena — o que não entra no
    // roteiro não fica na cena, e o golden reflete exatamente o que a validação vai reexecutar. ----
    const [painelRoteiroAberto, setPainelRoteiroAberto] = useState(false);
    const [idAbaRoteiro, setIdAbaRoteiro] = useState<number | null>(null);
    const [roteirosListados, setRoteirosListados] = useState<readonly RoteiroEditor3DResumoPersistido[]>([]);
    const [carregandoRoteiros, setCarregandoRoteiros] = useState(false);
    // Falha ao listar NÃO pode virar "nenhum roteiro cadastrado": lista vazia por erro é mentira sobre o estado.
    const [erroListaRoteiros, setErroListaRoteiros] = useState<string | null>(null);
    const [roteiroAtivo, setRoteiroAtivo] = useState<RoteiroEditor3DPersistido | null>(null);
    const [passosRoteiro, setPassosRoteiro] = useState<readonly PassoRoteiroEditor3D[]>([]);
    const [posicaoRoteiro, setPosicaoRoteiro] = useState(0);
    const [modoRoteiro, setModoRoteiro] = useState<ModoRoteiroEditor3D>('VISUALIZACAO');
    const [pendenciaRoteiro, setPendenciaRoteiro] = useState(false);
    const [salvandoRoteiro, setSalvandoRoteiro] = useState(false);
    const [avisoGravacaoRoteiro, setAvisoGravacaoRoteiro] = useState<string | null>(null);
    const [resultadoValidacaoRoteiro, setResultadoValidacaoRoteiro] = useState<ResultadoValidacaoRoteiroEditor3D | null>(null);

    // Execução DERIVADA dos passos atuais: estados incrementais para stepping/rótulos + a eventual falha de execução.
    const execucaoRoteiro = useMemo(() => executaPassosRoteiroEditor3D(passosRoteiro), [passosRoteiro]);
    const rotulosPassosRoteiro = useMemo(() => passosRoteiro.map((passo, indice) => rotuloOperacaoRoteiroEditor3D(passo.operacao, indice === 0 ? ESTADO_INICIAL_ROTEIRO_EDITOR3D : (execucaoRoteiro.estados[indice - 1] ?? ESTADO_INICIAL_ROTEIRO_EDITOR3D))), [passosRoteiro, execucaoRoteiro]);
    const sessaoRoteiroNaAba = painelRoteiroAberto && idAbaAtiva === idAbaRoteiro;

    // Repõe no editor o estado PURO de uma posição do roteiro. O contadorRef global NÃO é rebaixado: os ids que a cena
    // reposta exibe vêm sempre da reexecução (densos a partir de 1); ids vivos de rajada são descartados na reposição.
    // A seleção de OBJETO sobrevive quando o objeto continua existindo — sem isso a operadora reselecionaria o alvo a
    // cada operação gravada. Subelementos (faces/vértices) sempre limpam: a seleção deles é da sessão de edição.
    const aplicaEstadoRoteiroNoEditor = useCallback((estado: EstadoRoteiroEditor3D, marcaProjetoAlterado: boolean) => {
        const objetoPreservado = idSelecionado !== null && idSelecionado > 0 ? (estado.objetos.find(objeto => objeto.id === idSelecionado) ?? null) : null;
        setObjetos(estado.objetos);
        setIdSelecionado(objetoPreservado?.id ?? null);
        setTransformSelecionado(objetoPreservado?.transformInicial ?? null);
        setVerticesSelecionados([]);
        setFacesSelecionadas([]);
        // Navegar/carregar é LEITURA: só a gravação de passo marca o projeto da aba como alterado.
        if (marcaProjetoAlterado) setAlterado(true);
    }, [idSelecionado]);

    const irParaPosicaoRoteiro = useCallback((posicao: number) => {
        const maximo = execucaoRoteiro.falha !== null ? execucaoRoteiro.falha.indicePasso : passosRoteiro.length;
        const alvo = Math.max(0, Math.min(maximo, posicao));
        setPosicaoRoteiro(alvo);
        aplicaEstadoRoteiroNoEditor(alvo === 0 ? ESTADO_INICIAL_ROTEIRO_EDITOR3D : execucaoRoteiro.estados[alvo - 1], false);
    }, [execucaoRoteiro, passosRoteiro.length, aplicaEstadoRoteiroNoEditor]);

    // GRAVAÇÃO: operação do vocabulário executada no editor vira passo — truncando os passos à frente da posição
    // (inserir no meio descarta o resto) e coalescendo rajadas sobre o mesmo alvo. A cena é reposta pela reexecução.
    const gravaOperacaoRoteiro = useCallback((operacao: OperacaoRoteiroEditor3D) => {
        if (!sessaoRoteiroNaAba || roteiroAtivo === null || modoRoteiro !== 'MONTAGEM') return;
        const novosPassos = acrescentaPassoComCoalescenciaRoteiroEditor3D(passosRoteiro.slice(0, posicaoRoteiro), operacao);
        const execucao = executaPassosRoteiroEditor3D(novosPassos);
        if (execucao.falha !== null) { setAvisoGravacaoRoteiro(`Operação não entrou no roteiro: ${execucao.falha.motivo}`); return; }
        setPassosRoteiro(novosPassos);
        setPosicaoRoteiro(novosPassos.length);
        setPendenciaRoteiro(true);
        setResultadoValidacaoRoteiro(null);
        setAvisoGravacaoRoteiro(null);
        aplicaEstadoRoteiroNoEditor(execucao.estados[execucao.estados.length - 1], true);
    }, [sessaoRoteiroNaAba, roteiroAtivo, modoRoteiro, passosRoteiro, posicaoRoteiro, aplicaEstadoRoteiroNoEditor]);

    // Pendência de passos não salvos segura o unload (mesma proteção do padrão de rascunho).
    useEffect(() => {
        if (!pendenciaRoteiro) return;
        function aoSair(evento: BeforeUnloadEvent): void { evento.preventDefault(); };
        window.addEventListener('beforeunload', aoSair);
        return () => window.removeEventListener('beforeunload', aoSair);
    }, [pendenciaRoteiro]);

    // Arrasto de OBJETO com CANCELAMENTO (botão direito): o snapshot pré-arrasto é capturado no 1º move, mas só entra no
    // Desfazer no COMMIT (soltar). Cancelar descarta o snapshot → nada no histórico e o mesh é restaurado (é cancelar, não undo).
    const snapshotArrastoObjetoRef = useRef<CenaArmazenadaEditor3D | null>(null);
    // Verdadeiro enquanto um transform modal está em andamento: suprime o onPointerMissed (o clique de confirmar/cancelar não deve deselecionar nem cair p/ Selecionar).
    const arrastoObjetoAtivoRef = useRef(false);
    const iniciaArrastoObjeto = useCallback(() => { snapshotArrastoObjetoRef.current = capturaCenaAtiva(); }, [capturaCenaAtiva]);
    const confirmaArrastoObjeto = useCallback(() => {
        const snap = snapshotArrastoObjetoRef.current;
        if (!snap) return;
        snapshotArrastoObjetoRef.current = null;
        setPilhaDesfazer(atuais => atuais.length >= LIMITE_HISTORICO_EDITOR3D ? [...atuais.slice(1), snap] : [...atuais, snap]);
        setPilhaRefazer([]);
        // Commit do gesto de ESCALA em montagem de roteiro: grava o vetor final (a escala é o resultado; o assentamento só mexe no Z da posição).
        const mesh = refMeshSelecionada.current;
        if (modo === 'scale' && mesh && idSelecionado !== null && idSelecionado > 0) gravaOperacaoRoteiro({ tipo: 'ESCALAR', idObjeto: idSelecionado, escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z] });
    }, [modo, idSelecionado, gravaOperacaoRoteiro]);
    const cancelaArrastoObjeto = useCallback(() => { snapshotArrastoObjetoRef.current = null; }, []);

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
        setFacesSelecionadas([]);
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
        setFacesSelecionadas([]);
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
        assentaMeshNaCamada(mesh);
        setTransformSelecionado(lerTransformDaMeshSelecionada());
        setAlterado(true);
        // Digitação de ESCALA no painel em montagem de roteiro: grava o vetor completo resultante (rajada por eixo coalesce).
        if (campo === 'escala' && idSelecionado !== null && idSelecionado > 0) gravaOperacaoRoteiro({ tipo: 'ESCALAR', idObjeto: idSelecionado, escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z] });
    }, [lerTransformDaMeshSelecionada, registraHistorico, assentaMeshNaCamada, idSelecionado, gravaOperacaoRoteiro]);

    // Affordance "Assentar": reaplica o assentamento em camadas ao selecionado (útil após mover o APOIO de baixo —
    // o empilhado de cima não re-cai sozinho quando o apoio sai; esta é a limitação conhecida do assentamento sem física).
    const assentaObjetoSelecionadoNoChao = useCallback(() => {
        const mesh = refMeshSelecionada.current;
        if (!mesh) return;
        registraHistorico();
        if (!assentaMeshNaCamada(mesh)) return;
        setTransformSelecionado(lerTransformDaMeshSelecionada());
        setAlterado(true);
    }, [registraHistorico, assentaMeshNaCamada, lerTransformDaMeshSelecionada]);

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
        // Objeto novo nasce na ORIGEM do mundo (0,0,0), como no Blender — sem escalonamento anti-sobreposição (decisão
        // §6.1; quando houver Cursor 3D, nasce nele). O assentamento de camadas ainda ajusta o Z (base no apoio).
        setObjetos(atuais => [...atuais, { id, tipo, nome: `${rotuloTipoPrimitivaEditor3D(tipo)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, materiaisExtras: [], idPeca: null, visivel: true, malha: criaMalhaPrimitiva(tipo), subdivisao: 0, espessura: 0, transformInicial: { posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] } }]);
        setIdSelecionado(id);
        setAlterado(true);
        // Em montagem de roteiro a reposição da reexecução substitui este estado vivo (ids do roteiro são os da reexecução).
        if (tipo === 'CUBO') gravaOperacaoRoteiro({ tipo: 'ADD_CUBO' });
    }, [registraHistorico, gravaOperacaoRoteiro]);

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
        const malhaCopiada: MalhaEditavelLocal = { vertices: objeto.malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3Malha), faces: objeto.malha.faces.map(face => ({ ...face, indicesVertices: [...face.indicesVertices] })), proximoIdFace: objeto.malha.proximoIdFace };
        setObjetos(atuais => [...atuais, { ...objeto, id: novoId, nome: `${objeto.nome} (cópia)`, materiaisExtras: objeto.materiaisExtras.map(material => ({ ...material })), malha: malhaCopiada, transformInicial: transformAtual }]);
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
        gravaOperacaoRoteiro({ tipo: 'DEFINIR_COR_BASE', idObjeto: id, cor });
    }, [registraHistorico, gravaOperacaoRoteiro]);

    // Nível de subdivisão Catmull-Clark de EXIBIÇÃO do objeto: a gaiola (malha) segue sendo o que se edita; o viewport mostra a superfície subdividida.
    const mudaSubdivisaoObjeto = useCallback((id: number, subdivisao: number) => {
        const nivel = Math.max(0, Math.min(MAXIMO_SUBDIVISAO_MALHA_EDITOR3D, Math.round(subdivisao)));
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, subdivisao: nivel } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    // Materiais do objeto: slot 0 = base (a Cor); extras = slots 1..N. Novo material nasce claro (o interior da sala do roteiro).
    const adicionaMaterialObjeto = useCallback((id: number) => {
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, materiaisExtras: [...objeto.materiaisExtras, { nome: `Material ${objeto.materiaisExtras.length + 2}`, cor: '#ede8d0' }] } : objeto));
        setAlterado(true);
        gravaOperacaoRoteiro({ tipo: 'NOVO_MATERIAL', idObjeto: id });
    }, [registraHistorico, gravaOperacaoRoteiro]);

    const mudaCorMaterialObjeto = useCallback((id: number, slot: number, cor: string) => {
        if (slot <= 0) { mudaCorObjeto(id, cor); return; }
        registraHistorico(`cor-material-${id}-${slot}`);
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, materiaisExtras: objeto.materiaisExtras.map((material, indice) => indice === slot - 1 ? { ...material, cor } : material) } : objeto));
        setAlterado(true);
    }, [mudaCorObjeto, registraHistorico]);

    const renomeiaMaterialObjeto = useCallback((id: number, slot: number, nome: string) => {
        const nomeLimpo = nome.trim();
        if (nomeLimpo.length === 0 || slot <= 0) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, materiaisExtras: objeto.materiaisExtras.map((material, indice) => indice === slot - 1 ? { ...material, nome: nomeLimpo } : material) } : objeto));
        setAlterado(true);
    }, [registraHistorico]);

    // Atribuir (Assign): grava o slot do material nas faces SELECIONADAS da gaiola — o render agrupa os triângulos por slot.
    const atribuiMaterialAsFacesSelecionadas = useCallback((slot: number) => {
        if (idSelecionado === null || facesSelecionadas.length === 0) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const alvo = new Set(facesSelecionadas);
        const faces = objeto.malha.faces.map(face => alvo.has(face.id) ? { ...face, slotMaterial: slot <= 0 ? undefined : slot } : face);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: { ...item.malha, faces } } : item));
        setAlterado(true);
        // Roteiro grava a atribuição por ID ESTÁVEL de face (a seleção é estado do editor, não do projeto).
        gravaOperacaoRoteiro({ tipo: 'ATRIBUIR_MATERIAL', idObjeto: idSelecionado, slot, idsFaces: [...facesSelecionadas] });
    }, [idSelecionado, facesSelecionadas, objetos, registraHistorico, gravaOperacaoRoteiro]);

    // Espessura de parede (Solidify) de EXIBIÇÃO do objeto, em metros: 0 = desligado; a gaiola segue original (não-destrutivo, padrão da subdivisão).
    const mudaEspessuraObjeto = useCallback((id: number, espessura: number) => {
        const valor = Math.max(0, Math.min(MAXIMO_ESPESSURA_MALHA_EDITOR3D, espessura));
        registraHistorico(`espessura-objeto-${id}`);
        setObjetos(atuais => atuais.map(objeto => objeto.id === id ? { ...objeto, espessura: valor } : objeto));
        setAlterado(true);
        // Grava o valor JÁ clampado (rajada do slider coalesce).
        gravaOperacaoRoteiro({ tipo: 'SOLIDIFICAR', idObjeto: id, espessura: valor });
    }, [registraHistorico, gravaOperacaoRoteiro]);

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
            return { id: contadorRef.current, tipo: carregado.tipo, nome: carregado.nome, cor: carregado.cor, materiaisExtras: [], idPeca, visivel: true, malha: carregado.malha ?? criaMalhaPrimitiva(carregado.tipo), subdivisao: carregado.subdivisao, espessura: 0, transformInicial: { posicao: [carregado.transform.posicao[0] + base[0], carregado.transform.posicao[1] + base[1], carregado.transform.posicao[2] + base[2]], rotacao: carregado.transform.rotacao, escala: carregado.transform.escala } };
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

    const abreCriacaoMalha = useCallback(() => { setParamsCriacao({ tipo: 'CUBO', segmentos: 24, posicao: [0, 0, 0.5], rotacao: [0, 0, 0], escala: [1, 1, 1] }); }, []);
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
        setObjetos(atuais => [...atuais, { id, tipo: paramsCriacao.tipo, nome: `${rotuloTipoPrimitivaEditor3D(paramsCriacao.tipo)} ${id}`, cor: COR_OBJETO_PADRAO_EDITOR3D, materiaisExtras: [], idPeca: null, visivel: true, malha, subdivisao: 0, espessura: 0, transformInicial: { posicao: paramsCriacao.posicao, rotacao: paramsCriacao.rotacao, escala: paramsCriacao.escala } }]);
        setIdSelecionado(id);
        setAlterado(true);
        setParamsCriacao(null);
    }, [paramsCriacao, registraHistorico]);

    const selecionaSubElemento = useCallback((vertices: readonly number[], faceId: string | null, aditivo: boolean) => {
        // Faces: clique simples substitui a seleção; shift alterna a face no conjunto (mesma semântica dos vértices).
        setFacesSelecionadas(atuais => {
            if (faceId === null) return aditivo ? atuais : [];
            if (!aditivo) return [faceId];
            return atuais.includes(faceId) ? atuais.filter(id => id !== faceId) : [...atuais, faceId];
        });
        setVerticesSelecionados(atuais => {
            if (!aditivo) return [...vertices];
            const conjunto = new Set(atuais);
            const todosPresentes = vertices.every(vertice => conjunto.has(vertice));
            for (const vertice of vertices) { if (todosPresentes) conjunto.delete(vertice); else conjunto.add(vertice); }
            return [...conjunto];
        });
    }, []);

    // Extrude segue operação de UMA face (o fluxo com gizmo é por face); com várias selecionadas o botão desabilita.
    const extrudaFaceSelecionada = useCallback(() => {
        if (idSelecionado === null || facesSelecionadas.length !== 1) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const resultado = extrudaFace(objeto.malha, facesSelecionadas[0]);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesNovaFace);
        setFacesSelecionadas([resultado.idNovaFace]);
        setAlterado(true);
    }, [idSelecionado, facesSelecionadas, objetos, registraHistorico]);

    const chanframaArestaSelecionada = useCallback(() => {
        if (idSelecionado === null || modoSelecaoEdicao !== 'ARESTA' || verticesSelecionados.length !== 2) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = chanframaAresta(objeto.malha, verticesSelecionados[0], verticesSelecionados[1], quantidadeBevel);
        if (resultado.indicesChanfro.length === 0) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesChanfro);
        setFacesSelecionadas([]);
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
        setFacesSelecionadas([]);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, verticesSelecionados, objetos, registraHistorico]);

    // Inset varre TODAS as faces selecionadas, cada uma individualmente, com largura de moldura absoluta em metros.
    const insetaFacesSelecionadas = useCallback(() => {
        if (idSelecionado === null || facesSelecionadas.length === 0) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = insetaFacesDaMalha(objeto.malha, facesSelecionadas, distanciaInset);
        if (resultado.idsNovasFaces.length === 0) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados(resultado.indicesNovasFaces);
        setFacesSelecionadas(resultado.idsNovasFaces);
        setAlterado(true);
    }, [idSelecionado, facesSelecionadas, objetos, distanciaInset, registraHistorico]);

    // Espelhar X: opera na malha inteira do objeto selecionado (plano X=0 local; modele metade e espelhe).
    const espelhaObjetoSelecionadoX = useCallback(() => {
        if (idSelecionado === null || idSelecionado < 0) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        registraHistorico();
        const malhaEspelhada = espelhaMalhaX(objeto.malha);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: malhaEspelhada } : item));
        setVerticesSelecionados([]);
        setFacesSelecionadas([]);
        setAlterado(true);
    }, [idSelecionado, objetos, registraHistorico]);

    // Aplicar Transformações (bake): grava o transform vivo da mesh nos vértices da gaiola e zera o transform (pos/rot 0, escala 1)
    // sem mudança visual — as medidas reais viram a condição inicial do objeto (operações absolutas passam a valer sobre elas).
    const aplicaTransformacoesObjetoSelecionado = useCallback(() => {
        if (idSelecionado === null || idSelecionado < 0) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        const mesh = registroMeshes.current.get(idSelecionado);
        if (!objeto || !mesh) return;
        registraHistorico();
        mesh.updateMatrix();
        const malhaAplicada = aplicaTransformNaMalha(objeto.malha, mesh.matrix);
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: malhaAplicada, transformInicial: { posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] } } : item));
        setVerticesSelecionados([]);
        setFacesSelecionadas([]);
        setTransformSelecionado({ posicao: [0, 0, 0], rotacao: [0, 0, 0], escala: [1, 1, 1] });
        setAlterado(true);
    }, [idSelecionado, objetos, registraHistorico]);

    // Excluir contextual: no modo FACE remove as faces selecionadas; no modo VÉRTICE remove as faces que tocam os vértices selecionados.
    const excluiSelecaoEdicao = useCallback(() => {
        if (idSelecionado === null) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = modoSelecaoEdicao === 'FACE' && facesSelecionadas.length > 0
            ? excluiFacesDaMalha(objeto.malha, facesSelecionadas)
            : modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length > 0
                ? excluiVerticesDaMalha(objeto.malha, verticesSelecionados)
                : null;
        if (!resultado) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado } : item));
        setVerticesSelecionados([]);
        setFacesSelecionadas([]);
        setAlterado(true);
    }, [idSelecionado, modoSelecaoEdicao, facesSelecionadas, verticesSelecionados, objetos, registraHistorico]);

    const fundeVerticesSelecionadosEdicao = useCallback(() => {
        if (idSelecionado === null || modoSelecaoEdicao !== 'VERTICE' || verticesSelecionados.length < 2) return;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return;
        const resultado = fundeVerticesDaMalha(objeto.malha, verticesSelecionados);
        if (!resultado) return;
        registraHistorico();
        setObjetos(atuais => atuais.map(item => item.id === idSelecionado ? { ...item, malha: resultado.malha } : item));
        setVerticesSelecionados([resultado.indiceFundido]);
        setFacesSelecionadas([]);
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

    const montaObjetosCarregados = useCallback((carregados: readonly ObjetoCarregadoEditor3D[]): ObjetoEditor3D[] => carregados.map(carregado => { contadorRef.current += 1; return { id: contadorRef.current, tipo: carregado.tipo, nome: carregado.nome, cor: carregado.cor, materiaisExtras: carregado.materiaisExtras.map(material => ({ ...material })), idPeca: carregado.idPeca, visivel: true, malha: carregado.malha ?? criaMalhaPrimitiva(carregado.tipo), subdivisao: carregado.subdivisao, espessura: carregado.espessura, transformInicial: carregado.transform }; }), []);

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
        const nomeNovaAba = cenaInicial.ehInicio ? 'Início' : cenaInicial.tipoProjeto === 'CAPA_ARTE' ? `Capa de Arte ${novoId}` : cenaInicial.tipoProjeto === 'PERSONAGEM' ? `Personagem ${novoId}` : cenaInicial.tipoProjeto === 'MAPA' ? `Mapa ${novoId}` : `Novo Projeto ${novoId}`;
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
            entradas.push({ id: objeto.id, nome: objeto.nome, tipo: objeto.tipo, cor: objeto.cor, materiaisExtras: objeto.materiaisExtras, idPeca: objeto.idPeca, malha: objeto.malha, subdivisao: objeto.subdivisao, espessura: objeto.espessura, mesh });
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
            const cenaCanonica = serializaCenaCanonicaEditor3D(entradas, tipoProjeto, camera, capaArte, corpoPersonagem, pecas);
            // MAPA salva geometria + camada de jogo no MESMO save: os corpos dos comandos são rederivados da cena agora,
            // então mover o interruptor no Editor já regrava a posição que o runtime usa pra validar alcance.
            const camadaJogoMapa = tipoProjeto === 'MAPA' ? serializaCamadaJogoEditor3D({ fontesDeLuz: luzes, comandos }, cenaCanonica) : undefined;
            const persistido = await salvaProjeto3D(nome, cenaCanonica, idProjeto, imagemCapaBase64, imagemCapaTituloBase64, camadaJogoMapa);
            setProjetoAberto({ id: persistido.id, nome: persistido.nome });
            setAlterado(false);
            setModalSalvarAberto(false);
        } catch {
            // NoraApi já exibiu o toast de erro ao usuário.
        } finally {
            setSalvando(false);
        }
    }, [construirEntradasSerializacao, tipoProjeto, camera, capaArte, corpoPersonagem, pecas, luzes, comandos]);

    // Modo ARMADO de fiação ("Definir interruptor"): só enquanto armado o clique num objeto do cenário vincula — clique
    // de câmera/seleção NUNCA cria fiação. Qualquer troca de seleção/coleção, ESC ou clique no vazio desarma.
    const [definindoInterruptor, setDefinindoInterruptor] = useState(false);

    // Fonte de Luz: nó novo da cena do MAPA. Selecionar uma luz LIMPA a seleção de objeto (e vice-versa) — painel de um
    // só nó por vez. Mover segue o padrão modal do editor: o MODO (Mover) é escolhido à parte, selecionar não o muda.
    const selecionaLuz = useCallback((idLocal: string) => {
        setIdSelecionado(null);
        setRegiaoCorpoSelecionada(null);
        setIdComandoSelecionado(null);
        setIdLuzSelecionada(idLocal);
        setDefinindoInterruptor(false);
    }, []);

    const adicionaLuz = useCallback(() => {
        registraHistorico();
        const nova = criaFonteDeLuzEditor3D(luzes);
        setLuzes(atuais => [...atuais, nova]);
        setAlterado(true);
        selecionaLuz(nova.idLocal);
    }, [luzes, registraHistorico, selecionaLuz]);

    // Toda mutação de luz passa por aqui: um só ponto de histórico + marcação de alterado.
    const atualizaLuz = useCallback((idLocal: string, muda: (luz: FonteDeLuzEditor3D) => FonteDeLuzEditor3D, tagHistorico?: string) => {
        registraHistorico(tagHistorico);
        setLuzes(atuais => atuais.map(luz => luz.idLocal === idLocal ? muda(luz) : luz));
        setAlterado(true);
    }, [registraHistorico]);

    // Trocar o TIPO troca junto a intensidade padrão: PONTO (candela, dezenas) e AMBIENTE (banho, 0–1) medem em escalas
    // diferentes — herdar o valor do outro tipo entrega uma cena estourada ou apagada. O alcance re-amarra à intensidade nova.
    const mudaTipoLuz = useCallback((tipo: TipoFonteDeLuzMapa) => {
        if (idLuzSelecionada === null) return;
        atualizaLuz(idLuzSelecionada, luz => aplicaCampoLuzEditor3D({ ...luz, tipo }, 'intensidade', INTENSIDADE_PADRAO_POR_TIPO_FONTE_EDITOR3D[tipo]));
    }, [idLuzSelecionada, atualizaLuz]);

    const mudaCorLuz = useCallback((cor: string) => {
        if (idLuzSelecionada === null) return;
        atualizaLuz(idLuzSelecionada, luz => ({ ...luz, cor }), `luz-cor-${idLuzSelecionada}`);
    }, [idLuzSelecionada, atualizaLuz]);

    // Intensidade e alcance passam pelo AMARRAMENTO do domínio: o corte nunca promete além do que a intensidade entrega.
    const mudaCampoLuz = useCallback((campo: CampoLuzEditor3D, valor: number) => {
        if (idLuzSelecionada === null) return;
        atualizaLuz(idLuzSelecionada, luz => aplicaCampoLuzEditor3D(luz, campo, valor), `luz-${campo}-${idLuzSelecionada}`);
    }, [idLuzSelecionada, atualizaLuz]);

    const mudaPosicaoLuz = useCallback((indice: number, valor: number) => {
        if (idLuzSelecionada === null) return;
        atualizaLuz(idLuzSelecionada, luz => ({ ...luz, posicao: luz.posicao.map((atual, i) => i === indice ? valor : atual) as [number, number, number] }), `luz-posicao-${idLuzSelecionada}`);
    }, [idLuzSelecionada, atualizaLuz]);

    const renomeiaLuz = useCallback((idLocal: string, nome: string) => {
        atualizaLuz(idLocal, luz => ({ ...luz, nome: nome.trim().length > 0 ? nome : luz.nome }));
    }, [atualizaLuz]);

    // COMANDOS (fiação): mesmo trilho da luz — seleção própria, exclusiva com objeto e luz.
    const selecionaComando = useCallback((idLocal: string) => {
        setIdSelecionado(null);
        setRegiaoCorpoSelecionada(null);
        setIdLuzSelecionada(null);
        setIdComandoSelecionado(idLocal);
        setDefinindoInterruptor(false);
    }, []);

    // O GESTO DE FIAÇÃO: alterna a ARESTA objeto↔luz. Criação do interruptor no primeiro vínculo, agrupamento em
    // circuito e dissolução no último moram no domínio; aqui ficam histórico, estado e a limpeza da seleção de um
    // interruptor que se dissolveu.
    const alternaVinculoLuzObjeto = useCallback((idElementoCena: string, nomeElemento: string, idFonte: string) => {
        registraHistorico();
        const proximos = alternaVinculoLuzInterruptorEditor3D(comandos, idElementoCena, nomeElemento, idFonte);
        setComandos(proximos);
        setIdComandoSelecionado(atual => atual !== null && !proximos.some(comando => comando.idLocal === atual) ? null : atual);
        setAlterado(true);
    }, [comandos, registraHistorico]);

    const atualizaComando = useCallback((idLocal: string, muda: (comando: ComandoEditor3D) => ComandoEditor3D, tagHistorico?: string) => {
        registraHistorico(tagHistorico);
        setComandos(atuais => atuais.map(comando => comando.idLocal === idLocal ? muda(comando) : comando));
        setAlterado(true);
    }, [registraHistorico]);

    const excluiComando = useCallback((idLocal: string) => {
        registraHistorico();
        setComandos(atuais => atuais.filter(comando => comando.idLocal !== idLocal));
        setIdComandoSelecionado(atual => atual === idLocal ? null : atual);
        setAlterado(true);
    }, [registraHistorico]);

    const mudaDescricaoComando = useCallback((descricao: string) => {
        if (idComandoSelecionado === null) return;
        atualizaComando(idComandoSelecionado, comando => ({ ...comando, descricao }));
    }, [idComandoSelecionado, atualizaComando]);

    const mudaAlcanceComando = useCallback((valor: number) => {
        if (idComandoSelecionado === null) return;
        atualizaComando(idComandoSelecionado, comando => ({ ...comando, alcanceMilimetros: valor }), `comando-alcance-${idComandoSelecionado}`);
    }, [idComandoSelecionado, atualizaComando]);

    const renomeiaComando = useCallback((idLocal: string, nome: string) => {
        atualizaComando(idLocal, comando => ({ ...comando, nome: nome.trim().length > 0 ? nome : comando.nome }));
    }, [atualizaComando]);

    // Desvincular pelo painel da LUZ (o ◉ da lista de interruptores): remove esta luz do circuito daquele interruptor.
    // A LUZ é o sujeito da fiação — o painel do interruptor não lista fontes (não escala e inverteria o domínio).
    const alternaInterruptorDaLuz = useCallback((idComando: string) => {
        const comando = comandos.find(comandoAtual => comandoAtual.idLocal === idComando);
        if (comando === undefined || idLuzSelecionada === null) return;
        alternaVinculoLuzObjeto(comando.idElementoCena, comando.nome, idLuzSelecionada);
    }, [comandos, idLuzSelecionada, alternaVinculoLuzObjeto]);

    const comandoSelecionado = useMemo(() => comandos.find(comando => comando.idLocal === idComandoSelecionado) ?? null, [comandos, idComandoSelecionado]);
    const comandosArvore = useMemo(() => comandos.map(comando => ({ idLocal: comando.idLocal, nome: comando.nome, tipoRotulo: `${comando.idsFontesDeLuz.length} luz(es)` })), [comandos]);
    const nomeElementoVinculadoComando = useMemo(() => (comandoSelecionado === null ? null : objetos.find(objeto => String(objeto.id) === comandoSelecionado.idElementoCena)?.nome ?? null), [comandoSelecionado, objetos]);

    // Objetos que SÃO interruptores: na Coleção de Iluminação eles se demarcam no viewport (senão somem no breu) e o
    // clique neles (fora do modo armado) seleciona o INTERRUPTOR — o objeto passa a compor a coleção, só que read-only.
    const idsElementosInterruptores = useMemo(() => new Set(comandos.map(comando => Number(comando.idElementoCena))), [comandos]);

    // PREVIEW do acionamento (botão ⏻ do interruptor): replica a regra do jogo — alguma luz do circuito acesa → apagam
    // todas; todas apagadas → acendem. Estado do EDITOR: não persiste, não suja o projeto, zera ao trocar de coleção.
    const [idsLuzesApagadasPreview, setIdsLuzesApagadasPreview] = useState<ReadonlySet<string>>(new Set());
    const acionaInterruptorPreview = useCallback((idComando: string) => {
        const comando = comandos.find(comandoAtual => comandoAtual.idLocal === idComando);
        if (comando === undefined) return;
        setIdsLuzesApagadasPreview(atuais => {
            const algumaAcesa = comando.idsFontesDeLuz.some(idFonte => !atuais.has(idFonte));
            const proximo = new Set(atuais);
            for (const idFonte of comando.idsFontesDeLuz) { if (algumaAcesa) proximo.add(idFonte); else proximo.delete(idFonte); }
            return proximo;
        });
    }, [comandos]);

    // Trocar de coleção troca o MODO DE TRABALHO, não só o filtro da árvore: seleção que a lente não mostra não pode ficar
    // viva (painel e gizmo de um nó invisível). A LUZ atravessa as lentes — ela existe no Cenário e na Iluminação — então
    // a seleção dela sobrevive à troca; só geometria (na Iluminação) e fiação (fora dela) se limpam.
    const selecionaColecaoSistema = useCallback((colecao: TipoColecaoSistemaEditor3D) => {
        setColecaoSistema(colecao);
        setDefinindoInterruptor(false);
        setIdsLuzesApagadasPreview(new Set());
        if (!colecaoMostraGeometria(colecao)) { setIdSelecionado(null); setRegiaoCorpoSelecionada(null); setModo('select'); }
        if (!colecaoMostraFiacao(colecao)) setIdComandoSelecionado(null);
    }, []);

    // A coleção é estado do EDITOR e as abas trocam o projeto por baixo dela: cair numa aba cujo tipo não oferece a coleção
    // ativa entra na coleção inicial DELE (Mapa entra no Cenário; os demais tipos, na lente única da cena).
    useEffect(() => {
        if (!colecoesSistemaDoTipoProjeto(tipoProjeto).includes(colecaoSistema)) selecionaColecaoSistema(colecaoSistemaInicialDoTipoProjeto(tipoProjeto));
    }, [tipoProjeto, colecaoSistema, selecionaColecaoSistema]);

    // Clique em objeto no viewport passa por aqui: na Coleção de Iluminação geometria NÃO se seleciona — no modo ARMADO
    // ("Definir interruptor") o clique é o gesto de fiação (só ADICIONA: objeto já vinculado = nada acontece; remover é o
    // ◉ dos painéis; vincula UM e desarma). Fora do armado, clique num objeto que É interruptor seleciona o INTERRUPTOR
    // (ele compõe a coleção, read-only — a fiação dele aparece); nos demais objetos o clique é inerte.
    const aoSelecionarObjetoViewport = useCallback((id: number) => {
        if (colecaoMostraGeometria(colecaoSistema)) { setIdSelecionado(id); return; }
        if (!definindoInterruptor) {
            const comandoDoObjeto = comandos.find(comando => comando.idElementoCena === String(id));
            if (comandoDoObjeto !== undefined) selecionaComando(comandoDoObjeto.idLocal);
            return;
        }
        const luz = luzes.find(luzAtual => luzAtual.idLocal === idLuzSelecionada);
        if (luz === undefined) return;
        const objeto = objetos.find(objetoAtual => objetoAtual.id === id);
        if (objeto === undefined) return;
        setDefinindoInterruptor(false);
        const proximos = vinculaLuzInterruptorEditor3D(comandos, String(objeto.id), objeto.nome, luz.idLocal);
        if (proximos === comandos) return;
        registraHistorico();
        setComandos([...proximos]);
        setIdComandoSelecionado(atual => atual !== null && !proximos.some(comando => comando.idLocal === atual) ? null : atual);
        setAlterado(true);
    }, [colecaoSistema, definindoInterruptor, luzes, idLuzSelecionada, objetos, comandos, registraHistorico, selecionaComando]);

    // Saídas do modo armado que não passam por clique: ESC, e a luz deixar de existir por qualquer via.
    useEffect(() => {
        if (!definindoInterruptor) return;
        if (!luzes.some(luzAtual => luzAtual.idLocal === idLuzSelecionada)) { setDefinindoInterruptor(false); return; }
        function aoTeclar(evento: KeyboardEvent): void { if (evento.key === 'Escape') setDefinindoInterruptor(false); };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [definindoInterruptor, luzes, idLuzSelecionada]);

    // Badge da árvore conta o que a coleção ATIVA mostra — a luz conta em toda lente; geometria e fiação, só nas delas.
    const totalColecao = (colecaoMostraGeometria(colecaoSistema) ? objetos.length : 0) + luzes.length + (colecaoMostraFiacao(colecaoSistema) ? comandos.length : 0);

    // A Iluminação É o modo de jogo (sem toggle): entrar nela apaga estúdio e grid; sair devolve a bancada de modelagem.
    const iluminacaoDeJogoAtiva = colecaoUsaIluminacaoDeJogo(colecaoSistema);

    // Posição VIVA do objeto: o CENTRO DO BBOX da mesh, não o pivot — malha editada pode estar deslocada do pivot, e o
    // corpo do comando em jogo deriva do bbox no salvamento; a fiação precisa apontar para o mesmo lugar que o jogo usa.
    // Lida da mesh (não do transform salvo) para a linha acompanhar o gizmo enquanto o autor arrasta o interruptor.
    const obtemPosicaoElemento = useCallback((idElementoCena: string): [number, number, number] | null => {
        const mesh = registroMeshes.current.get(Number(idElementoCena));
        if (mesh === undefined) return null;
        const centro = new Box3().setFromObject(mesh).getCenter(new Vector3());
        return [centro.x, centro.y, centro.z];
    }, []);

    const luzSelecionada = useMemo(() => luzes.find(luz => luz.idLocal === idLuzSelecionada) ?? null, [luzes, idLuzSelecionada]);
    const comandosDaLuzSelecionada = useMemo(() => (luzSelecionada === null ? [] : comandos.filter(comando => comando.idsFontesDeLuz.includes(luzSelecionada.idLocal))), [comandos, luzSelecionada]);

    // O esquema elétrico segue a SELEÇÃO, dos DOIS lados da aresta: luz selecionada → alcance dela + interruptores que
    // a acionam; interruptor selecionado → luzes do circuito dele.
    const fontesDoEsquema = luzSelecionada !== null ? [luzSelecionada] : comandoSelecionado !== null ? luzes.filter(luz => comandoSelecionado.idsFontesDeLuz.includes(luz.idLocal)) : [];
    const comandosDoEsquema = luzSelecionada !== null ? comandosDaLuzSelecionada : comandoSelecionado !== null ? [comandoSelecionado] : [];
    const luzesArvore = useMemo(() => luzes.map(luz => ({ idLocal: luz.idLocal, nome: luz.nome, tipoRotulo: ROTULO_CURTO_TIPO_FONTE_DE_LUZ_EDITOR3D[luz.tipo] })), [luzes]);

    // Seleção de nó é EXCLUSIVA: escolher um objeto (árvore ou viewport) desfaz a seleção de luz e de comando; o inverso mora nos selecionaLuz/selecionaComando.
    useEffect(() => { if (idSelecionado !== null) { setIdLuzSelecionada(null); setIdComandoSelecionado(null); } }, [idSelecionado]);

    // Arrasto do gizmo da luz: coalesce num único registro de histórico enquanto o arrasto dura (mesma janela do gizmo de objeto).
    const moveLuz = useCallback((idLocal: string, posicao: [number, number, number]) => {
        atualizaLuz(idLocal, luz => ({ ...luz, posicao }), `luz-posicao-${idLocal}`);
    }, [atualizaLuz]);

    const excluiLuz = useCallback((idLocal: string) => {
        registraHistorico();
        setLuzes(atuais => atuais.filter(luz => luz.idLocal !== idLocal));
        setIdLuzSelecionada(atual => atual === idLocal ? null : atual);
        setAlterado(true);
    }, [registraHistorico]);

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

    const iniciaMapa = useCallback(() => {
        if (ehInicio) {
            setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, nomePadrao: `Mapa ${aba.idAba}` } : aba));
            aplicaCenaNova(CENA_MAPA_EDITOR3D);
        } else {
            abreNovaAba(CENA_MAPA_EDITOR3D);
        }
    }, [ehInicio, idAbaAtiva, aplicaCenaNova, abreNovaAba]);

    // ---- Sessão do Painel Roteiro (abrir/carregar/salvar/aprovar/validar) ----
    // Falha de carga vira ERRO explícito, não lista vazia: "nenhum roteiro cadastrado" quando na verdade a chamada
    // falhou é uma afirmação falsa sobre o estado — justamente o que este sistema existe para não fazer.
    const recarregaListaRoteiros = useCallback(() => {
        setCarregandoRoteiros(true);
        setErroListaRoteiros(null);
        void listaRoteirosEditor3D()
            .then(lista => setRoteirosListados(lista ?? []))
            .catch(() => { setRoteirosListados([]); setErroListaRoteiros('Não foi possível carregar os roteiros.'); })
            .finally(() => setCarregandoRoteiros(false));
    }, []);

    // O painel abre numa cena de projeto vazio: roteiro SEMPRE parte do projeto em branco, e a sessão fica amarrada à aba.
    const abrePainelRoteiros = useCallback(() => {
        // Abrir aqui SUBSTITUI uma sessão viva em outra aba; passos não salvos de lá se perderiam sem aviso.
        if (painelRoteiroAberto && pendenciaRoteiro && !window.confirm('O Painel de Roteiros está aberto em outra aba, com passos não salvos. Abrir aqui descarta esses passos?')) return;
        if (ehInicio) {
            setAbas(atuais => atuais.map(aba => aba.idAba === idAbaAtiva ? { ...aba, nomePadrao: `Roteiros ${aba.idAba}` } : aba));
            aplicaCenaNova(CENA_VAZIA_EDITOR3D);
            setIdAbaRoteiro(idAbaAtiva);
        } else {
            abreNovaAba(CENA_VAZIA_EDITOR3D);
            // abreNovaAba incrementa o contador sincronamente: o valor atual É o id da aba recém-criada.
            setIdAbaRoteiro(contadorAbaRef.current);
        }
        setPainelRoteiroAberto(true);
        setRoteiroAtivo(null);
        setPassosRoteiro([]);
        setPosicaoRoteiro(0);
        setPendenciaRoteiro(false);
        setResultadoValidacaoRoteiro(null);
        setAvisoGravacaoRoteiro(null);
        recarregaListaRoteiros();
    }, [ehInicio, idAbaAtiva, aplicaCenaNova, abreNovaAba, painelRoteiroAberto, pendenciaRoteiro, recarregaListaRoteiros]);

    const carregaRoteiroNoPainel = useCallback(async (idRoteiro: number) => {
        const persistido = await consultaRoteiroEditor3D(idRoteiro);
        if (!persistido) return;
        setRoteiroAtivo(persistido);
        setPassosRoteiro(persistido.passos);
        // Sem golden ainda = veio pra montar; com golden = veio pra conferir/validar.
        setModoRoteiro(persistido.golden === null ? 'MONTAGEM' : 'VISUALIZACAO');
        setPendenciaRoteiro(false);
        setResultadoValidacaoRoteiro(null);
        setAvisoGravacaoRoteiro(null);
        const execucao = executaPassosRoteiroEditor3D(persistido.passos);
        setPosicaoRoteiro(execucao.estados.length);
        aplicaEstadoRoteiroNoEditor(execucao.estados.length === 0 ? ESTADO_INICIAL_ROTEIRO_EDITOR3D : execucao.estados[execucao.estados.length - 1], false);
    }, [aplicaEstadoRoteiroNoEditor]);

    // Fechar com roteiro aberto volta pra lista (recarregada — os selos podem ter mudado); sem roteiro, fecha o painel.
    const fechaRoteiroOuPainel = useCallback(() => {
        if (roteiroAtivo !== null) {
            if (pendenciaRoteiro && !window.confirm('Há passos não salvos. Fechar o roteiro mesmo assim?')) return;
            setRoteiroAtivo(null);
            setPassosRoteiro([]);
            setPosicaoRoteiro(0);
            setPendenciaRoteiro(false);
            setResultadoValidacaoRoteiro(null);
            setAvisoGravacaoRoteiro(null);
            recarregaListaRoteiros();
            return;
        }
        setPainelRoteiroAberto(false);
        setIdAbaRoteiro(null);
    }, [roteiroAtivo, pendenciaRoteiro, recarregaListaRoteiros]);

    const trocaModoRoteiro = useCallback((modoNovo: ModoRoteiroEditor3D) => {
        setModoRoteiro(modoNovo);
        setAvisoGravacaoRoteiro(null);
    }, []);

    const mudaComentarioPassoRoteiro = useCallback((indice: number, comentario: string) => {
        const texto = comentario.trim();
        setPassosRoteiro(atuais => atuais.map((passo, posicao) => posicao === indice ? (texto.length === 0 ? { operacao: passo.operacao } : { ...passo, comentario: texto }) : passo));
        setPendenciaRoteiro(true);
    }, []);

    // Save falho NÃO limpa a pendência (o selo continua até o servidor confirmar). O que passa a valer localmente é o que
    // o SERVIDOR gravou (ele normaliza os passos) — assim o painel nunca mostra uma sequência diferente da persistida.
    const salvaPassosRoteiro = useCallback(async () => {
        if (roteiroAtivo === null) return;
        setSalvandoRoteiro(true);
        try {
            const atualizado = await atualizaPassosRoteiroEditor3D(roteiroAtivo.id, passosRoteiro);
            if (!atualizado) return;
            setRoteiroAtivo(atualizado);
            setPassosRoteiro(atualizado.passos);
            setPendenciaRoteiro(false);
        } finally { setSalvandoRoteiro(false); }
    }, [roteiroAtivo, passosRoteiro]);

    // Aprovar = salvar os passos (se pendentes) + reexecutar do zero na camada pura + gravar o golden (estados por passo).
    const aprovaRoteiroAtual = useCallback(async () => {
        if (roteiroAtivo === null) return;
        const montagem = montaGoldenRoteiroEditor3D(passosRoteiro);
        if (!montagem.ok) { setAvisoGravacaoRoteiro(`Não dá para aprovar: o passo ${montagem.indicePasso + 1} não executa (${montagem.motivo}).`); return; }
        setSalvandoRoteiro(true);
        try {
            const comPassos = pendenciaRoteiro ? await atualizaPassosRoteiroEditor3D(roteiroAtivo.id, passosRoteiro) : roteiroAtivo;
            if (!comPassos) return;
            const aprovado = await aprovaRoteiroEditor3D(comPassos.id, montagem.golden);
            if (!aprovado) return;
            setRoteiroAtivo(aprovado);
            setPassosRoteiro(aprovado.passos);
            setPendenciaRoteiro(false);
            // NÃO afirmamos "válido": validamos de verdade o que o servidor gravou. Se o backend normalizar um passo de
            // um jeito que o golden não previa, o desfecho aparece aqui — em vez de mentir verde até a próxima validação.
            setResultadoValidacaoRoteiro(aprovado.golden === null ? null : validaRoteiroContraGoldenEditor3D(aprovado.passos, aprovado.golden));
        } finally { setSalvandoRoteiro(false); }
    }, [roteiroAtivo, passosRoteiro, pendenciaRoteiro]);

    // Validar RECARREGA antes de comparar: o desfecho é sobre o que está no servidor AGORA, não sobre o que foi lido ao
    // abrir o painel. Compara passos PERSISTIDOS com golden PERSISTIDO — pendência local não participa (nem existe aqui:
    // o modo Visualização é bloqueado enquanto houver passos não salvos).
    const validaRoteiroAtual = useCallback(async () => {
        if (roteiroAtivo === null) return;
        setSalvandoRoteiro(true);
        try {
            const persistido = await consultaRoteiroEditor3D(roteiroAtivo.id);
            if (!persistido || persistido.golden === null) return;
            setRoteiroAtivo(persistido);
            setPassosRoteiro(persistido.passos);
            setResultadoValidacaoRoteiro(validaRoteiroContraGoldenEditor3D(persistido.passos, persistido.golden));
        } finally { setSalvandoRoteiro(false); }
    }, [roteiroAtivo]);

    // Bloqueio = "a ferramenta ainda não permite completar este roteiro" (backlog visível). Não mexe em passos/golden.
    const defineBloqueioRoteiro = useCallback(async (motivo: string | null): Promise<void> => {
        if (roteiroAtivo === null) return;
        const atualizado = await bloqueiaRoteiroEditor3D(roteiroAtivo.id, motivo);
        if (!atualizado) return;
        setRoteiroAtivo(atualizado);
    }, [roteiroAtivo]);

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
        const cena: CenaArmazenadaEditor3D = { objetos: montaObjetosCarregados(desserializaCenaCanonicaEditor3D(persistido.cenaCanonica)), colecoes: [], pecas: pecasDaCena(persistido.cenaCanonica), corpoPersonagem: corpoPersonagemDaCena(persistido.cenaCanonica), idSelecionado: null, projetoAberto: { id: persistido.id, nome: persistido.nome }, alterado: false, ehInicio: false, tipoProjeto: tipoProjetoDaCena(persistido.cenaCanonica), camera: cameraDaCena(persistido.cenaCanonica), capaArte: capaArteDaCena(persistido.cenaCanonica), luzes: camadaJogoDoProjeto(persistido.camadaJogoMapa).fontesDeLuz, idLuzSelecionada: null, comandos: camadaJogoDoProjeto(persistido.camadaJogoMapa).comandos };
        if (ehInicio) aplicaCenaNova(cena);
        else abreNovaAba(cena);
    }, [projetoAberto, abas, ehInicio, trocaAba, aplicaCenaNova, abreNovaAba, montaObjetosCarregados]);

    const comandoDesabilitado = useCallback((comando: ComandoMenuEditor3D): boolean => {
        if (salvando) return true;
        // O Painel de Roteiros abre de qualquer lugar (do Início ele já cria a cena vazia); só não reabre por cima de SI
        // MESMO — se a sessão vive em OUTRA aba, o painel está invisível aqui e o comando precisa continuar disponível,
        // senão trocar de aba tranca o menu e a operadora fica sem caminho de volta.
        if (comando === 'ABRIR_ROTEIROS') return sessaoRoteiroNaAba;
        if (ehInicio) return comando !== 'NOVO_PROJETO' && comando !== 'ABRIR_PROJETO' && comando !== 'CRIAR_CAPA_ARTE' && comando !== 'CRIAR_PERSONAGEM' && comando !== 'CRIAR_MAPA';
        if (comando === 'SALVAR_PROJETO_ATUAL' || comando === 'SALVAR_NOVO_PROJETO') return objetos.length === 0 && tipoProjeto !== 'CAPA_ARTE' && tipoProjeto !== 'PERSONAGEM';
        if (comando === 'CAPTURAR_ARTE_CAPA') return objetos.length === 0 && tipoProjeto !== 'PERSONAGEM';
        // A coleção ativa é uma LENTE de domínio: comando de menu fora dela (geometria na Iluminação, luz/fiação no Cenário) desabilita.
        if (!colecaoPermiteComandoMenu(colecaoSistema, comando)) return true;
        // Iluminação é domínio do MAPA: em qualquer outro tipo de projeto a Fonte de Luz nem é oferecida (e o backend recusaria).
        if (comando === 'ADD_LUZ') return tipoProjeto !== 'MAPA';
        return false;
    }, [salvando, ehInicio, objetos.length, tipoProjeto, sessaoRoteiroNaAba, colecaoSistema]);

    const aoComando = useCallback((comando: ComandoMenuEditor3D) => {
        if (comando === 'ADD_CUBO') adicionaObjeto('CUBO');
        else if (comando === 'ADD_CILINDRO') adicionaObjeto('CILINDRO');
        else if (comando === 'ADD_ESFERA') adicionaObjeto('ESFERA');
        else if (comando === 'ADD_LUZ') adicionaLuz();
        else if (comando === 'NOVO_MESH') abreCriacaoMalha();
        else if (comando === 'NOVO_PROJETO') iniciaProjetoVazio();
        else if (comando === 'CRIAR_CAPA_ARTE') iniciaCapaArte();
        else if (comando === 'CRIAR_PERSONAGEM') iniciaPersonagem();
        else if (comando === 'CRIAR_MAPA') iniciaMapa();
        else if (comando === 'SALVAR_PROJETO_ATUAL') salvarProjetoAtual();
        else if (comando === 'SALVAR_NOVO_PROJETO') setModalSalvarAberto(true);
        else if (comando === 'ABRIR_PROJETO') void abrirModalAbrirProjeto();
        else if (comando === 'CAPTURAR_ARTE_CAPA') iniciaCaptura();
        else if (comando === 'ABRIR_ROTEIROS') abrePainelRoteiros();
    }, [adicionaObjeto, adicionaLuz, abreCriacaoMalha, iniciaProjetoVazio, iniciaCapaArte, iniciaPersonagem, iniciaMapa, salvarProjetoAtual, abrirModalAbrirProjeto, iniciaCaptura, abrePainelRoteiros]);

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
        };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [idSelecionado]);

    // Modos de transform (Mover/Rotacionar/Escalar) SÓ existem com algo selecionado — transformar "o quê" sem seleção não
    // faz sentido. MOVER vale para objeto (mesh) OU Fonte de Luz PONTO (o mesmo "grab": G + arrastar o corpo/marcador);
    // Rotacionar/Escalar são só de objeto — luz não tem rotação nem escala. Q/Esc (voltar a Selecionar) valem sempre.
    const temObjetoSelecionado = idSelecionado !== null && idSelecionado > 0;
    const temLuzPontoSelecionada = luzSelecionada !== null && luzSelecionada.tipo === 'PONTO';
    useEffect(() => {
        function aoTeclar(evento: KeyboardEvent): void {
            if (alvoEhCampoEditavelEditor3D(evento.target)) return;
            if (evento.key === 'g' || evento.key === 'G') { if (temObjetoSelecionado || temLuzPontoSelecionada) setModo('translate'); }
            else if (evento.key === 'r' || evento.key === 'R') { if (temObjetoSelecionado) setModo('rotate'); }
            else if (evento.key === 's' || evento.key === 'S') { if (temObjetoSelecionado) setModo('scale'); }
            else if (evento.key === 'q' || evento.key === 'Q' || evento.key === 'Escape') setModo('select');
            // X/Y/Z = ATALHO do toggle de trava do painel (clicar no rótulo segue sendo a porta visível): alterna a linha
            // correspondente, só dentro de um modo e só no grupo que o modo edita (Mover→Posição, R→Rotação, S→Escala).
            else if (evento.key === 'x' || evento.key === 'X' || evento.key === 'y' || evento.key === 'Y' || evento.key === 'z' || evento.key === 'Z') {
                const campo = CAMPO_DO_MODO_TRANSFORM_EDITOR3D[modo];
                if (campo === null) return;
                const tecla = evento.key.toLowerCase();
                alternaTravaTransform(campo, tecla === 'x' ? 0 : tecla === 'y' ? 1 : 2);
            }
        };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [temObjetoSelecionado, temLuzPontoSelecionada, modo, alternaTravaTransform]);

    // Perdeu a seleção (deselecionou, excluiu, ou selecionou câmera/corpo/título) estando num modo de transform → cai p/
    // Selecionar. Luz PONTO sustenta apenas o Mover.
    useEffect(() => {
        if (modo === 'select') return;
        if (temObjetoSelecionado) return;
        if (modo === 'translate' && temLuzPontoSelecionada) return;
        setModo('select');
    }, [temObjetoSelecionado, temLuzPontoSelecionada, modo]);

    useEffect(() => { setVerticesSelecionados([]); setFacesSelecionadas([]); setModoSelecaoEdicao('VERTICE'); }, [modoOperacao, idSelecionado]);

    useEffect(() => { setVerticesSelecionados([]); setFacesSelecionadas([]); }, [modoSelecaoEdicao]);

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

    const objetosResumo = useMemo<ObjetoResumoEditor3D[]>(() => objetos.map(objeto => ({ id: objeto.id, nome: objeto.nome, icone: objeto.idPeca !== null ? '🧥' : iconeTipoPrimitivaEditor3D(objeto.tipo), tipoRotulo: objeto.idPeca !== null ? 'Peça' : rotuloTipoPrimitivaEditor3D(objeto.tipo), visivel: objeto.visivel, ehPeca: objeto.idPeca !== null })), [objetos]);

    const objetoSelecionadoResumo = useMemo(() => {
        if (idSelecionado === null || idSelecionado < 0) return null;
        const objeto = objetos.find(item => item.id === idSelecionado);
        if (!objeto) return null;
        const pecaDoObjeto = objeto.idPeca !== null ? (pecas.find(peca => peca.idPeca === objeto.idPeca) ?? null) : null;
        return { nome: objeto.nome, cor: objeto.cor, materiaisExtras: objeto.materiaisExtras, tipoRotulo: objeto.idPeca !== null ? 'Peça' : rotuloTipoPrimitivaEditor3D(objeto.tipo), subdivisao: objeto.subdivisao, espessura: objeto.espessura, peca: pecaDoObjeto !== null ? { idPeca: pecaDoObjeto.idPeca, nome: pecaDoObjeto.nome } : null };
    }, [objetos, pecas, idSelecionado]);

    // Base do campo Dimensões: caixa envolvente LOCAL da gaiola do objeto selecionado (dimensão exibida = base × escala viva da mesh).
    const dimensoesBaseSelecionado = useMemo<Vetor3Malha | null>(() => {
        if (idSelecionado === null || idSelecionado < 0) return null;
        const objeto = objetos.find(item => item.id === idSelecionado);
        return objeto ? dimensoesDaMalha(objeto.malha) : null;
    }, [objetos, idSelecionado]);

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
                <HomeEditor3D aoProjetoVazio={iniciaProjetoVazio} aoCapaArte={iniciaCapaArte} aoPersonagem={iniciaPersonagem} aoMapa={iniciaMapa} aoAbrirProjeto={abreProjetoEmAba} aoAbrirModal={() => void abrirModalAbrirProjeto()} />
            ) : (
                <div className={styles.area_editor}>
                <div className={styles.viewport} style={{ cursor: definindoInterruptor ? 'crosshair' : CURSOR_MODO_TRANSFORM_EDITOR3D[modo] }}>
                    <IndicadorModoEditor3D modo={modo} />
                    {definindoInterruptor && luzSelecionada !== null && <div className={styles.aviso_definindo_interruptor}>Definindo interruptor de {luzSelecionada.nome}: clique no objeto do cenário · ESC cancela</div>}
                    {modoOperacao === 'EDICAO' && <BarraEdicaoMalhaEditor3D modoSelecao={modoSelecaoEdicao} xRayAtivo={xRayAtivo} aoAlternarXRay={() => setXRayAtivo(atual => !atual)} podeExtrudar={modoSelecaoEdicao === 'FACE' && facesSelecionadas.length === 1} podeChanfrar={modoSelecaoEdicao === 'ARESTA' && verticesSelecionados.length === 2} podeCortarAnel={modoSelecaoEdicao === 'ARESTA' && verticesSelecionados.length === 2} podeInsetar={modoSelecaoEdicao === 'FACE' && facesSelecionadas.length > 0} podeExcluir={(modoSelecaoEdicao === 'FACE' && facesSelecionadas.length > 0) || (modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length > 0)} podeFundir={modoSelecaoEdicao === 'VERTICE' && verticesSelecionados.length >= 2} quantidadeBevel={quantidadeBevel} distanciaInset={distanciaInset} aoTrocarModoSelecao={setModoSelecaoEdicao} aoExtrudar={extrudaFaceSelecionada} aoChanfrar={chanframaArestaSelecionada} aoCortarAnel={cortaAnelSelecionado} aoInsetar={insetaFacesSelecionadas} aoExcluir={excluiSelecaoEdicao} aoFundir={fundeVerticesSelecionadosEdicao} aoMudarQuantidadeBevel={setQuantidadeBevel} aoMudarDistanciaInset={setDistanciaInset} />}
                    <BotaoComandoEditor3D />

                    {sessaoRoteiroNaAba && <PainelRoteiroEditor3D roteiros={roteirosListados} carregandoLista={carregandoRoteiros} erroLista={erroListaRoteiros} roteiro={roteiroAtivo} passos={passosRoteiro} rotulos={rotulosPassosRoteiro} posicao={posicaoRoteiro} modo={modoRoteiro} pendenciaSalvar={pendenciaRoteiro} salvando={salvandoRoteiro} avisoGravacao={avisoGravacaoRoteiro} falhaExecucao={execucaoRoteiro.falha} resultadoValidacao={resultadoValidacaoRoteiro} aoFechar={fechaRoteiroOuPainel} aoCarregarRoteiro={idRoteiro => void carregaRoteiroNoPainel(idRoteiro)} aoTrocarModo={trocaModoRoteiro} aoIrPara={irParaPosicaoRoteiro} aoMudarComentario={mudaComentarioPassoRoteiro} aoSalvarPassos={() => void salvaPassosRoteiro()} aoAprovar={() => void aprovaRoteiroAtual()} aoValidar={() => void validaRoteiroAtual()} aoDefinirBloqueio={motivo => void defineBloqueioRoteiro(motivo)} />}

                    <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} resize={{ offsetSize: true }} camera={{ position: [6, -6, 5], up: [0, 0, 1], fov: 38, near: 0.1, far: 200 }} onPointerMissed={evento => { if (arrastoObjetoAtivoRef.current) return; if (evento.shiftKey) return; if (definindoInterruptor) { setDefinindoInterruptor(false); return; } if (modoOperacao === 'EDICAO') { setVerticesSelecionados([]); setFacesSelecionadas([]); } else { setIdSelecionado(null); setRegiaoCorpoSelecionada(null); setIdLuzSelecionada(null); setIdComandoSelecionado(null); setModo('select'); } }}>
                        {/* Iluminação de jogo: o estúdio SAI e o fundo vira preto — o autor vê a sala como o jogo mostra, sem
                            precisar abrir uma Partida. Fora dela, o estúdio garante que dá pra modelar mesmo com a sala apagada. */}
                        <color attach="background" args={[iluminacaoDeJogoAtiva ? '#000000' : '#0e0c14']} />
                        {!iluminacaoDeJogoAtiva && (
                            <>
                                <ambientLight intensity={0.6} color="#eef2f6" />
                                <hemisphereLight intensity={0.5} color="#f4f7fb" groundColor="#9aa1ad" position={[0, 0, 1]} />
                                <directionalLight castShadow position={[8, 6, 12]} intensity={1.1} color="#fff4e2" />
                            </>
                        )}

                        {/* O grid é chão que o jogo não tem: na visualização de jogo ele vazaria "existe piso aqui" onde não existe. */}
                        {!capturando && !iluminacaoDeJogoAtiva && <ChaoEditor3D />}

                        {tipoProjeto === 'PERSONAGEM' && corpoPersonagem && <CorpoPersonagemViewportEditor3D corpo={corpoPersonagem} selecionado={idSelecionado === SELECAO_CORPO_PERSONAGEM_EDITOR3D} aoSelecionar={() => selecionaCorpo(null)} />}

                        {objetos.map(objeto => <ObjetoEditavelEditor3D key={objeto.id} objeto={objeto} visivelEfetivo={objeto.visivel && !colecaoOcultaPorObjeto.has(objeto.id)} selecionado={objeto.id === idSelecionado} demarcadoInterruptor={colecaoSistema === 'ILUMINACAO' && idsElementosInterruptores.has(objeto.id)} interruptorSelecionado={colecaoSistema === 'ILUMINACAO' && comandoSelecionado !== null && comandoSelecionado.idElementoCena === String(objeto.id)} destacaHover={definindoInterruptor} edicaoAtiva={modoOperacao === 'EDICAO' && objeto.id === idSelecionado} modoSelecaoEdicao={modoSelecaoEdicao} verticesSelecionados={verticesSelecionados} facesSelecionadas={facesSelecionadas} xRayAtivo={xRayAtivo} modo={modo} travas={travasTransform} ocultarGizmo={capturando} aoSelecionar={aoSelecionarObjetoViewport} aoSelecionarSubElemento={selecionaSubElemento} aoMoverVertices={moveVerticesSelecionados} aoIniciarArrasto={registraHistoricoArrasto} aoIniciarArrastoObjeto={iniciaArrastoObjeto} aoConfirmarArrastoObjeto={confirmaArrastoObjeto} aoCancelarArrastoObjeto={cancelaArrastoObjeto} arrastoAtivoRef={arrastoObjetoAtivoRef} registraMeshSelecionada={registraMeshSelecionada} registraMesh={registraMesh} aoTransformar={sincronizaTransformSelecionado} assentaNaCamada={assentaMeshNaCamada} aoSairDoModo={() => setModo('select')} />)}

                        {paramsCriacao && <PreviewMalhaEditor3D params={paramsCriacao} />}

                        {/* Fontes de Luz do MAPA: a luz REAL da cena autorada — o autor vê o que está acendendo, não um ícone. */}
                        {tipoProjeto === 'MAPA' && <LuzesViewportEditor3D luzes={luzes} idLuzSelecionada={idLuzSelecionada} modoMover={modo === 'translate'} idsApagadas={idsLuzesApagadasPreview} aoSelecionar={selecionaLuz} aoMover={moveLuz} />}
                        {/* Esquema elétrico: na Iluminação, a seleção mostra o SEU lado da fiação — luz ou interruptor. */}
                        {colecaoMostraFiacao(colecaoSistema) && (luzSelecionada !== null || comandoSelecionado !== null) && <EsquemaEletricoEditor3D fontesDeLuz={fontesDoEsquema} comandos={comandosDoEsquema} obtemPosicaoElemento={obtemPosicaoElemento} />}

                        {tipoProjeto === 'CAPA_ARTE' && camera && <CameraCapaArteEditor3D camera={camera} selecionada={idSelecionado === SELECAO_CAMERA_EDITOR3D} ocultarGizmo={capturando} povAtiva={camPovAtiva} aoSelecionarCamera={() => setIdSelecionado(SELECAO_CAMERA_EDITOR3D)} aoMoverPosicao={moveCameraPosicao} aoMoverAlvo={moveCameraAlvo} />}
                        {tipoProjeto === 'CAPA_ARTE' && camera && <TituloCapaArteEditor3D camera={camera} titulo={capaArte.titulo} mostrarGizmo={idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D && !camPovAtiva && !capturando} aoSelecionar={() => setIdSelecionado(SELECAO_TITULO_CAPA_ARTE_EDITOR3D)} aoMover={moveTituloPosicao} />}
                        {tipoProjeto === 'CAPA_ARTE' && camera && <PreviewVivoCapaArteEditor3D camera={camera} ativo={idSelecionado === SELECAO_CAMERA_EDITOR3D || idSelecionado === SELECAO_TITULO_CAPA_ARTE_EDITOR3D} refCanvas={refCanvasPreviewCapa} />}
                        <RenderizadorCapaArteEditor3D aoRegistrar={registraRenderCapa} />

                        <CapturadorArteDeCapa capturando={capturando} aoCapturar={aoCapturar} />
                        {camPovAtiva && camera ? (
                            <CameraPovEditor3D camera={camera} permitePan={!alvoTravado} aoNavegar={navegaCameraPov} />
                        ) : (
                            <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0, 0, 0.5]} minDistance={2} maxDistance={60} />
                        )}
                        {!capturando && <GizmoNavegacaoEditor3D />}
                    </Canvas>

                    {paramsCriacao && <PainelParametrizacaoMeshEditor3D params={paramsCriacao} aoMudarTipo={mudaTipoCriacao} aoMudarSegmentos={mudaSegmentosCriacao} aoMudarVetor={mudaVetorCriacao} aoConfirmar={confirmaCriacaoMalha} aoCancelar={cancelaCriacaoMalha} />}

                    {camPovAtiva && (
                        <div className={styles.overlay_pov_camera}>
                            <div className={styles.guia_enquadramento_pov} />
                            <span className={styles.aviso_pov_camera}>Controlando a câmera · navegue para enquadrar · ESC para sair</span>
                        </div>
                    )}
                </div>

                <PainelLateralEditor3D objetosRaiz={objetosRaizResumo} colecoes={colecoesArvore} tipoProjeto={tipoProjeto} colecaoSistema={colecaoSistema} aoSelecionarColecaoSistema={selecionaColecaoSistema} totalColecao={totalColecao} idSelecionado={idSelecionado} objetoSelecionado={objetoSelecionadoResumo} aoRenomearObjeto={renomeiaObjeto} aoMudarCorObjeto={cor => idSelecionado !== null && mudaCorObjeto(idSelecionado, cor)} aoMudarSubdivisaoObjeto={subdivisao => idSelecionado !== null && mudaSubdivisaoObjeto(idSelecionado, subdivisao)} aoMudarEspessuraObjeto={espessura => idSelecionado !== null && mudaEspessuraObjeto(idSelecionado, espessura)} temFacesSelecionadas={modoOperacao === 'EDICAO' && modoSelecaoEdicao === 'FACE' && facesSelecionadas.length > 0} aoAdicionarMaterialObjeto={() => idSelecionado !== null && adicionaMaterialObjeto(idSelecionado)} aoMudarCorMaterialObjeto={(slot, cor) => idSelecionado !== null && mudaCorMaterialObjeto(idSelecionado, slot, cor)} aoRenomearMaterialObjeto={(slot, nome) => idSelecionado !== null && renomeiaMaterialObjeto(idSelecionado, slot, nome)} aoAtribuirMaterialObjeto={atribuiMaterialAsFacesSelecionadas} aoEspelharObjetoX={espelhaObjetoSelecionadoX} aoAplicarTransformacoesObjeto={aplicaTransformacoesObjetoSelecionado} aoDuplicarObjeto={duplicaObjeto} aoExcluirObjeto={removeObjeto} corpoPersonagem={corpoPersonagem} regioesCorpo={regioesCorpo} regiaoCorpoSelecionada={regiaoCorpoSelecionada} rotuloRegiaoSelecionada={regiaoCorpoSelecionada !== null ? ROTULO_REGIAO_CORPO_EDITOR3D[regiaoCorpoSelecionada] : 'Corpo'} pecasDaRegiao={pecasDaRegiaoSelecionada} aoSelecionarCorpo={selecionaCorpo} aoAtualizarParametroCorpo={atualizaParametroCorpo} aoMudarCorCorpo={mudaCorCorpo} aoAnexarPeca={() => void abrirModalAnexarPeca()} aoRemoverPeca={removePeca} transformSelecionado={transformSelecionado} dimensoesBaseSelecionado={dimensoesBaseSelecionado} modoTransform={modo} travasTransform={travasTransform} aoAlternarTravaTransform={alternaTravaTransform} camera={camera} capaArte={capaArte} refPreviewCamera={refCanvasPreviewCapa} povCameraAtiva={camPovAtiva} alvoTravado={alvoTravado} capturando={capturando} capaSalva={capaSalva} aoSelecionar={id => { setRegiaoCorpoSelecionada(null); setIdSelecionado(id === SELECAO_CAMERA_EDITOR3D || id === SELECAO_TITULO_CAPA_ARTE_EDITOR3D ? id : id < 0 ? null : id); }} aoAlternarVisibilidade={alternaVisibilidade} aoAtualizarTransform={atualizaTransformObjeto} aoAssentarObjetoNoChao={assentaObjetoSelecionadoNoChao} aoAtualizarCameraVetor={atualizaCameraVetor} aoAtualizarCameraFov={atualizaCameraFov} aoAtualizarTituloTexto={atualizaTituloTexto} aoAtualizarTituloTransform={atualizaTituloTransform} aoAtualizarTituloCor={atualizaTituloCor} aoAlternarPovCamera={alternaPovCamera} aoAlternarAlvoTravado={alternaAlvoTravado} aoCapturar={iniciaCaptura} aoCriarColecao={criaColecao} aoAlternarVisibilidadeColecao={alternaVisibilidadeColecao} aoRenomearColecao={renomeiaColecao} aoRemoverColecao={removeColecao} aoMoverObjeto={moveObjetoParaColecao} luzes={luzes} luzesArvore={luzesArvore} luzSelecionada={luzSelecionada} aoSelecionarLuz={selecionaLuz} aoRenomearLuz={renomeiaLuz} aoExcluirLuz={excluiLuz} aoMudarTipoLuz={mudaTipoLuz} aoMudarCorLuz={mudaCorLuz} aoMudarCampoLuz={mudaCampoLuz} aoMudarPosicaoLuz={mudaPosicaoLuz} comandosArvore={comandosArvore} comandoSelecionado={comandoSelecionado} nomeElementoVinculadoComando={nomeElementoVinculadoComando} interruptoresDaLuz={comandosDaLuzSelecionada} definindoInterruptor={definindoInterruptor} aoAlternarInterruptorDaLuz={alternaInterruptorDaLuz} aoAlternarDefinicaoInterruptor={() => setDefinindoInterruptor(atual => !atual)} aoSelecionarComando={selecionaComando} aoRenomearComando={renomeiaComando} aoExcluirComando={excluiComando} aoMudarDescricaoComando={mudaDescricaoComando} aoMudarAlcanceComando={mudaAlcanceComando} aoAcionarInterruptor={acionaInterruptorPreview} />
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
    // Objeto que É interruptor, visto pela Coleção de Iluminação: contorno de arestas na COR DA FIAÇÃO (a linguagem do
    // esquema elétrico, "energizado") — próprio, para nunca se confundir com o preenchimento dourado da SELEÇÃO; e com
    // luz própria, para não sumir no breu do modo de jogo.
    readonly demarcadoInterruptor: boolean;
    // O INTERRUPTOR deste objeto está selecionado: o corpo recebe o preenchimento de seleção (além do contorno) — o
    // clique que seleciona o interruptor precisa acender o elemento como qualquer seleção.
    readonly interruptorSelecionado: boolean;
    // Modo armado de fiação: passar o mouse destaca o objeto sob o cursor — no breu é difícil saber onde há elemento.
    readonly destacaHover: boolean;
    readonly edicaoAtiva: boolean;
    readonly modoSelecaoEdicao: ModoSelecaoEdicaoEditor3D;
    readonly verticesSelecionados: readonly number[];
    readonly facesSelecionadas: readonly string[];
    readonly xRayAtivo: boolean;
    readonly modo: ModoTransformEditor3D;
    readonly travas: TravasTransformEditor3D;
    readonly ocultarGizmo: boolean;
    readonly aoSelecionar: (id: number) => void;
    readonly aoSelecionarSubElemento: (vertices: readonly number[], faceId: string | null, aditivo: boolean) => void;
    readonly aoMoverVertices: (delta: [number, number, number]) => void;
    readonly aoIniciarArrasto: () => void;
    readonly aoIniciarArrastoObjeto: () => void;
    readonly aoConfirmarArrastoObjeto: () => void;
    readonly aoCancelarArrastoObjeto: () => void;
    readonly arrastoAtivoRef: { current: boolean };
    readonly registraMeshSelecionada: (mesh: Mesh | null) => void;
    readonly registraMesh: (id: number, mesh: Mesh | null) => void;
    readonly aoTransformar: () => void;
    readonly assentaNaCamada: (mesh: Mesh) => boolean;
    readonly aoSairDoModo: () => void;
};

function ObjetoEditavelEditor3D({ objeto, visivelEfetivo, selecionado, demarcadoInterruptor, interruptorSelecionado, destacaHover, edicaoAtiva, modoSelecaoEdicao, verticesSelecionados, facesSelecionadas, xRayAtivo, modo, travas, ocultarGizmo, aoSelecionar, aoSelecionarSubElemento, aoMoverVertices, aoIniciarArrasto, aoIniciarArrastoObjeto, aoConfirmarArrastoObjeto, aoCancelarArrastoObjeto, arrastoAtivoRef, registraMeshSelecionada, registraMesh, aoTransformar, assentaNaCamada, aoSairDoModo }: ObjetoEditavelEditor3DProps) {
    const meshRef = useRef<Mesh>(null);
    const camera = useThree((estado) => estado.camera);
    const gl = useThree((estado) => estado.gl);
    const controles = useThree((estado) => estado.controls);
    // SESSÃO modal do modo (Mover/Rotacionar/Escalar): dura do entrar no modo até commit/revert. O gesto SÓ aplica com o
    // botão seguro no corpo (`arrastando`); solto, o mouse anda livre (dá pra travar eixos no painel entre arrastos).
    // `posIni/rotIni/escIni` = transform na ENTRADA da sessão (alvo do revert); `rotBase/escBase` = bases do ARRASTO atual
    // (arrastos sucessivos acumulam); `escala` = fator do ConteinerEscalavel.
    const arrasteRef = useRef<{ modo: ModoTransformEditor3D; arrastando: boolean; plano: Plane; raycaster: Raycaster; ndc: Vector2; ultimoPlano: Vector3; iniClientX: number; iniClientY: number; pivotClientX: number; pivotClientY: number; distIniPivot: number; escala: number; moveu: boolean; posIni: [number, number, number]; rotIni: [number, number, number]; escIni: [number, number, number]; rotBase: [number, number, number]; escBase: [number, number, number] } | null>(null);
    // pointerdown no PRÓPRIO corpo = início de arrasto — o aoDecidir da janela (mesmo evento, borbulhando) não deve tratá-lo como clique decisório.
    const descendoNoMeshRef = useRef(false);
    // Handlers de janela ativos no transform (guardados p/ remover na finalização, sem depender circular entre os useCallback).
    const listenersArrasteRef = useRef<{ mover: (e: PointerEvent) => void; soltar: (e: PointerEvent) => void; decidir: (e: PointerEvent) => void; teclar: (e: KeyboardEvent) => void; menu: (e: Event) => void } | null>(null);
    // Refs p/ ler as últimas callbacks dentro dos listeners de janela estáveis (as callbacks de histórico mudam de identidade).
    const aoTransformarRef = useRef(aoTransformar);
    aoTransformarRef.current = aoTransformar;
    const aoIniciarArrastoObjetoRef = useRef(aoIniciarArrastoObjeto);
    aoIniciarArrastoObjetoRef.current = aoIniciarArrastoObjeto;
    const aoConfirmarArrastoObjetoRef = useRef(aoConfirmarArrastoObjeto);
    aoConfirmarArrastoObjetoRef.current = aoConfirmarArrastoObjeto;
    const aoSairDoModoRef = useRef(aoSairDoModo);
    aoSairDoModoRef.current = aoSairDoModo;
    const aoCancelarArrastoObjetoRef = useRef(aoCancelarArrastoObjeto);
    aoCancelarArrastoObjetoRef.current = aoCancelarArrastoObjeto;
    // Travas de eixo lidas via ref nos listeners de janela (estáveis): trancar/destrancar no MEIO do gesto já vale no próximo movimento.
    const travasRef = useRef(travas);
    travasRef.current = travas;
    // Sincronização do painel numérico coalescida por frame (throttle): o mesh é mutado no caminho quente e RENDERIZA sozinho
    // (frameloop "always"); o setState p/ o inspetor roda no máximo 1×/frame, não a cada pointermove. Fica no grão do R3F.
    const rafSyncPainelRef = useRef<number | null>(null);
    // A geometria de EXIBIÇÃO aplica subdivisão Catmull-Clark e depois a espessura (Solidify) sobre a gaiola; os handles de edição seguem na gaiola (objeto.malha).
    const geometria = useMemo(() => {
        const malhaSubdividida = objeto.subdivisao > 0 ? subdivideMalhaCatmullClark(objeto.malha, objeto.subdivisao) : objeto.malha;
        const malhaExibicao = objeto.espessura > 0 ? solidificaMalha(malhaSubdividida, objeto.espessura) : malhaSubdividida;
        return criaGeometriaDeMalha(malhaExibicao, 1 + objeto.materiaisExtras.length);
    }, [objeto.malha, objeto.subdivisao, objeto.espessura, objeto.materiaisExtras.length]);

    // Hover do modo armado de fiação: estado LOCAL (não sobe ao pai) — só o objeto sob o cursor re-renderiza.
    const [hoverFiacao, setHoverFiacao] = useState(false);

    // Contorno "energizado" do interruptor: as arestas da geometria de exibição na cor da fiação do esquema elétrico.
    const geometriaArestasInterruptor = useMemo(() => (demarcadoInterruptor ? new EdgesGeometry(geometria, 15) : null), [demarcadoInterruptor, geometria]);
    useEffect(() => () => { geometriaArestasInterruptor?.dispose(); }, [geometriaArestasInterruptor]);

    // Materiais por slot (0 = base, 1.. = extras): o mesh recebe o ARRAY e os groups da geometria escolhem o slot por face.
    const materiais = useMemo(() => {
        const emXRay = edicaoAtiva && xRayAtivo;
        const slots = [{ nome: 'Base', cor: objeto.cor }, ...objeto.materiaisExtras];
        // Seleção acende o corpo — vale para a seleção da GEOMETRIA e para a do INTERRUPTOR do objeto; o hover do modo
        // armado de fiação usa um brilho mais suave (emissive não depende de luz — funciona no breu).
        const selecaoAtiva = selecionado || interruptorSelecionado;
        const destacado = selecaoAtiva || (destacaHover && hoverFiacao);
        return slots.map(slot => new MeshStandardMaterial({ color: new Color(slot.cor), emissive: new Color(destacado ? '#e8c074' : '#000000'), emissiveIntensity: selecaoAtiva ? 0.35 : destacado ? 0.2 : 0, roughness: 0.55, metalness: 0.1, flatShading: objeto.subdivisao === 0, transparent: emXRay, opacity: emXRay ? 0.45 : 1, depthWrite: !emXRay }));
    }, [objeto.cor, objeto.materiaisExtras, objeto.subdivisao, selecionado, interruptorSelecionado, destacaHover, hoverFiacao, edicaoAtiva, xRayAtivo]);

    useEffect(() => () => { for (const material of materiais) material.dispose(); }, [materiais]);
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

    // ASSENTAMENTO no ciclo de vida: sempre que o transform aplicado OU a geometria de exibição mudarem (criação, abrir
    // projeto legado afundado/flutuante, undo/redo, importar peça, subdivisão/espessura, edição de vértices), o objeto
    // re-assenta na camada de apoio (outro objeto abaixo, ou o chão y=0).
    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        if (assentaNaCamada(mesh)) aoTransformar();
    }, [objeto.transformInicial, geometria, aoTransformar, assentaNaCamada]);

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

    // Manipulação DIRETA no corpo do mesh (fora da edição): arrastar transforma o objeto no modo atual, sem gizmo.
    // Os listeners ficam na JANELA (não no onPointerMove do R3F): quando o mesh se move sob o ponteiro parado, o R3F
    // RE-DISPARA o onPointerMove p/ atualizar hover, realimentando o setState → "Maximum update depth". A janela só dispara com movimento REAL.
    const agendaSyncPainel = useCallback((): void => {
        if (rafSyncPainelRef.current !== null) return;
        rafSyncPainelRef.current = requestAnimationFrame(() => { rafSyncPainelRef.current = null; aoTransformarRef.current(); });
    }, []);
    const aoMoverJanela = useCallback((evento: PointerEvent): void => {
        const arraste = arrasteRef.current;
        const mesh = meshRef.current;
        if (!arraste || !mesh) return;
        // Botão solto = mouse LIVRE (nada acompanha): a sessão só aplica durante um arrasto seguro no corpo.
        if (!arraste.arrastando) return;
        // Histórico só no 1º movimento real da SESSÃO (mesh ainda no estado de entrada); COMMITADO no clique fora, descartado no revert.
        if (!arraste.moveu) { arraste.moveu = true; aoIniciarArrastoObjetoRef.current(); }
        // Travas de eixo (lock do painel Transform): eixo travado NÃO muda no gesto — o delta é zerado (translate) ou o
        // valor pré-arrasto é mantido (rotate/scale). Os destrancados seguem o comportamento de sempre.
        if (arraste.modo === 'translate') {
            const rect = gl.domElement.getBoundingClientRect();
            arraste.ndc.set(((evento.clientX - rect.left) / rect.width) * 2 - 1, -((evento.clientY - rect.top) / rect.height) * 2 + 1);
            arraste.raycaster.setFromCamera(arraste.ndc, camera);
            const atual = new Vector3();
            if (arraste.raycaster.ray.intersectPlane(arraste.plano, atual)) {
                const travasPosicao = travasRef.current.posicao;
                const delta = atual.clone().sub(arraste.ultimoPlano);
                if (travasPosicao[0]) delta.x = 0;
                if (travasPosicao[1]) delta.y = 0;
                if (travasPosicao[2]) delta.z = 0;
                mesh.position.add(delta);
                arraste.ultimoPlano.copy(atual);
            }
        } else if (arraste.modo === 'rotate') {
            const dx = (evento.clientX - arraste.iniClientX) / arraste.escala;
            const dy = (evento.clientY - arraste.iniClientY) / arraste.escala;
            const travasRotacao = travasRef.current.rotacao;
            mesh.rotation.set(travasRotacao[0] ? arraste.rotBase[0] : arraste.rotBase[0] + dy * 0.01, travasRotacao[1] ? arraste.rotBase[1] : arraste.rotBase[1] + dx * 0.01, arraste.rotBase[2]);
        } else if (arraste.modo === 'scale') {
            // Afastar o cursor do pivô CRESCE, aproximar ENCOLHE (razão de distâncias, estilo Blender) — a varredura
            // vertical antiga invertia a relação dependendo da direção do movimento (relato §5.2 da modeladora).
            const distAtual = Math.hypot(evento.clientX - arraste.pivotClientX, evento.clientY - arraste.pivotClientY);
            const fator = Math.max(0.05, distAtual / arraste.distIniPivot);
            const travasEscala = travasRef.current.escala;
            mesh.scale.set(travasEscala[0] ? arraste.escBase[0] : arraste.escBase[0] * fator, travasEscala[1] ? arraste.escBase[1] : arraste.escBase[1] * fator, travasEscala[2] ? arraste.escBase[2] : arraste.escBase[2] * fator);
        }
        mesh.updateMatrix();
        agendaSyncPainel();
    }, [gl, camera, agendaSyncPainel]);
    // Finalização comum (confirmar OU cancelar): limpa o estado do transform, religa o OrbitControls, avisa o pai (arrastoAtivoRef) e remove os listeners de janela.
    const finalizaArrasto = useCallback((): void => {
        arrasteRef.current = null;
        arrastoAtivoRef.current = false;
        if (controles) (controles as ControleOrbitaEditor3D).enabled = true;
        if (rafSyncPainelRef.current !== null) { cancelAnimationFrame(rafSyncPainelRef.current); rafSyncPainelRef.current = null; }
        const l = listenersArrasteRef.current;
        if (l) { window.removeEventListener('pointermove', l.mover); window.removeEventListener('pointerup', l.soltar); window.removeEventListener('pointerdown', l.decidir); window.removeEventListener('keydown', l.teclar); window.removeEventListener('contextmenu', l.menu); listenersArrasteRef.current = null; }
    }, [controles, arrastoAtivoRef]);
    // CONFIRMAR (clique esquerdo/Enter): aplica o transform (sync final), empilha o histórico pré-transform (no-op se nada moveu) e SAI do modo.
    const confirmaArrasto = useCallback((): void => {
        if (!arrasteRef.current) return;
        finalizaArrasto();
        const mesh = meshRef.current;
        if (mesh) assentaNaCamada(mesh);
        aoTransformarRef.current();
        aoConfirmarArrastoObjetoRef.current();
        aoSairDoModoRef.current();
    }, [finalizaArrasto, assentaNaCamada]);
    // CANCELAR (clique direito/Esc): restaura o transform PRÉ-mudança, DESCARTA o snapshot (nada entra no Desfazer — NÃO é undo) e SAI do modo.
    const cancelaArrasto = useCallback((): void => {
        const arraste = arrasteRef.current;
        const mesh = meshRef.current;
        if (!arraste || !mesh) return;
        mesh.position.set(arraste.posIni[0], arraste.posIni[1], arraste.posIni[2]);
        mesh.rotation.set(arraste.rotIni[0], arraste.rotIni[1], arraste.rotIni[2]);
        mesh.scale.set(arraste.escIni[0], arraste.escIni[1], arraste.escIni[2]);
        mesh.updateMatrix();
        finalizaArrasto();
        aoTransformarRef.current();
        aoCancelarArrastoObjetoRef.current();
        aoSairDoModoRef.current();
    }, [finalizaArrasto]);
    // Soltar o botão ENCERRA o arrasto atual mas MANTÉM a sessão do modo: dá pra travar/destravar eixos no painel e
    // arrastar de novo (arrastos acumulam); commit/revert ficam pro clique decisório.
    const aoSoltarDrag = useCallback((): void => {
        const arraste = arrasteRef.current;
        if (arraste) arraste.arrastando = false;
    }, []);
    // Clique DECISÓRIO da sessão (janela): esquerdo FORA do corpo (no viewport) COMITA; direito REVERTE. Cliques na UI
    // (painel/travas/menus — target fora do canvas) não decidem nada; pointerdown no PRÓPRIO corpo é início de arrasto
    // (flag descendoNoMesh, setada pelo handler do mesh que roda antes nesta mesma borbulha) e também não decide.
    const aoDecidir = useCallback((evento: PointerEvent): void => {
        const arraste = arrasteRef.current;
        if (!arraste) return;
        if (descendoNoMeshRef.current) { descendoNoMeshRef.current = false; return; }
        if (evento.target !== gl.domElement) return;
        evento.preventDefault();
        if (evento.button === 2) cancelaArrasto();
        else if (evento.button === 0) confirmaArrasto();
    }, [gl, cancelaArrasto, confirmaArrasto]);
    const aoTeclar = useCallback((evento: KeyboardEvent): void => {
        if (!arrasteRef.current) return;
        if (evento.key === 'Escape') { evento.preventDefault(); cancelaArrasto(); }
        else if (evento.key === 'Enter') { evento.preventDefault(); confirmaArrasto(); }
    }, [cancelaArrasto, confirmaArrasto]);
    // Só no canvas: o direito ali é o revert da sessão; na UI (painel/menus) o menu de contexto segue normal.
    const suprimeMenu = useCallback((evento: Event): void => { if (arrasteRef.current && evento.target === gl.domElement) evento.preventDefault(); }, [gl]);
    useEffect(() => finalizaArrasto, [finalizaArrasto]);

    // Entrar num modo (Mover/Rotacionar/Escalar) abre a SESSÃO modal do selecionado — SEM acompanhar o mouse: o gesto só
    // aplica clicando E SEGURANDO no corpo (dá pra travar/destravar eixos no painel entre arrastos, com o botão solto).
    // Esquerdo fora do corpo/Enter COMITA a sessão inteira; direito no viewport/Esc REVERTE ao estado de entrada; ambos
    // saem do modo. Trocar de modo no MEIO da sessão não reinicia nada — só muda o que o PRÓXIMO arrasto faz (o revert
    // continua mirando a entrada da sessão). Se o modo cair por fora (tecla Q, deseleção, entrar na edição), reverte.
    useEffect(() => {
        if (modo === 'select' || !selecionado || edicaoAtiva) {
            if (arrasteRef.current) cancelaArrasto();
            return;
        }
        if (arrasteRef.current) return;
        const mesh = meshRef.current;
        if (!mesh) return;
        if (controles) (controles as ControleOrbitaEditor3D).enabled = false;
        arrastoAtivoRef.current = true;
        const escala = gl.domElement.getBoundingClientRect().width / gl.domElement.offsetWidth || 1;
        arrasteRef.current = { modo, arrastando: false, plano: new Plane(), raycaster: new Raycaster(), ndc: new Vector2(), ultimoPlano: new Vector3(), iniClientX: 0, iniClientY: 0, pivotClientX: 0, pivotClientY: 0, distIniPivot: 1, escala, moveu: false, posIni: [mesh.position.x, mesh.position.y, mesh.position.z], rotIni: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], escIni: [mesh.scale.x, mesh.scale.y, mesh.scale.z], rotBase: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], escBase: [mesh.scale.x, mesh.scale.y, mesh.scale.z] };
        listenersArrasteRef.current = { mover: aoMoverJanela, soltar: aoSoltarDrag, decidir: aoDecidir, teclar: aoTeclar, menu: suprimeMenu };
        window.addEventListener('pointermove', aoMoverJanela);
        window.addEventListener('pointerup', aoSoltarDrag);
        window.addEventListener('pointerdown', aoDecidir);
        window.addEventListener('keydown', aoTeclar);
        window.addEventListener('contextmenu', suprimeMenu);
    }, [modo, selecionado, edicaoAtiva, controles, gl, aoMoverJanela, aoSoltarDrag, aoDecidir, aoTeclar, suprimeMenu, cancelaArrasto, arrastoAtivoRef]);
    // Pointerdown no CORPO durante a sessão: inicia um ARRASTO (aplica enquanto o botão estiver seguro; soltar encerra o
    // arrasto e a sessão continua). Ancora o plano/refs no ponto do clique; bases de rotação/escala = valores ATUAIS, pra
    // arrastos sucessivos acumularem. Clique em objeto NÃO-selecionado não trata nada aqui — borbulha pro aoDecidir (commit).
    function aoDescerParaTransformar(evento: ThreeEvent<PointerEvent>): void {
        if (edicaoAtiva || modo === 'select') return;
        const arraste = arrasteRef.current;
        if (!arraste || !selecionado) return;
        if (evento.nativeEvent.button !== 0) return;
        evento.stopPropagation();
        const mesh = meshRef.current;
        if (!mesh) return;
        // O aoDecidir da janela vê este MESMO pointerdown borbulhando — a flag o marca como início de arrasto, não decisão.
        descendoNoMeshRef.current = true;
        const normal = new Vector3();
        camera.getWorldDirection(normal);
        arraste.plano.setFromNormalAndCoplanarPoint(normal, mesh.position.clone());
        evento.ray.intersectPlane(arraste.plano, arraste.ultimoPlano);
        arraste.modo = modo;
        arraste.iniClientX = evento.nativeEvent.clientX;
        arraste.iniClientY = evento.nativeEvent.clientY;
        // Escala efetiva do ConteinerEscalavel (rect pós-transform / layout): compensa deltas de tela em rotate/scale (regra da skill).
        arraste.escala = gl.domElement.getBoundingClientRect().width / gl.domElement.offsetWidth || 1;
        // Pivô do ESCALAR projetado na tela (câmera parada durante o arrasto — projeção vale a sessão do arrasto inteira):
        // o fator é a RAZÃO distâncias cursor→pivô (afastar cresce, aproximar encolhe, estilo Blender). Razão é adimensional
        // (a escala do Conteiner cancela); o clamp evita explosão quando o clique cai em cima do pivô.
        const rectPivot = gl.domElement.getBoundingClientRect();
        const ndcPivot = mesh.position.clone().project(camera);
        arraste.pivotClientX = rectPivot.left + ((ndcPivot.x + 1) / 2) * rectPivot.width;
        arraste.pivotClientY = rectPivot.top + ((1 - ndcPivot.y) / 2) * rectPivot.height;
        arraste.distIniPivot = Math.max(24 * arraste.escala, Math.hypot(evento.nativeEvent.clientX - arraste.pivotClientX, evento.nativeEvent.clientY - arraste.pivotClientY));
        arraste.rotBase = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
        arraste.escBase = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
        arraste.arrastando = true;
    };

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
            {/* X-Ray (na edição): malha translúcida e SEM raycast — o clique atravessa e alcança os handles atrás da geometria. Fora do X-Ray o raycast PADRÃO do Mesh é reposto explicitamente (passar undefined apagaria o método). O material é um ARRAY (slots) casando com os groups da geometria. */}
            <mesh ref={meshRef} geometry={geometria} material={materiais.length === 1 ? materiais[0] : materiais} visible={visivelEfetivo} castShadow receiveShadow raycast={edicaoAtiva && xRayAtivo ? raycastNuloEditor3D : Mesh.prototype.raycast} onClick={aoClicar} onPointerDown={aoDescerParaTransformar} onPointerOver={destacaHover ? evento => { evento.stopPropagation(); setHoverFiacao(true); } : undefined} onPointerOut={destacaHover ? () => setHoverFiacao(false) : undefined}>
                {geometriaArestasInterruptor !== null && (
                    <lineSegments geometry={geometriaArestasInterruptor} raycast={raycastNuloEditor3D} userData={{ naoExibirNaCapa: true }}>
                        <lineBasicMaterial color="#ffcf6e" toneMapped={false} />
                    </lineSegments>
                )}
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
                        <meshBasicMaterial color={facesSelecionadas.includes(face.id) ? '#ff8a3d' : '#7bdc8a'} depthTest={false} />
                    </mesh>
                ))}
                {edicaoAtiva && geometriaArestasGaiola && (
                    <lineSegments geometry={geometriaArestasGaiola} raycast={() => null}>
                        <lineBasicMaterial color="#f0d28a" transparent opacity={0.5} depthTest={false} />
                    </lineSegments>
                )}
                {temSelecaoVertices && <primitive object={proxyVertices} />}
            </mesh>
            {/* Transform de objeto é por manipulação DIRETA (arrastar o corpo no modo atual); o gizmo de eixos foi removido por interceptar o arrasto. A edição de vértices mantém o próprio gizmo. */}
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

    // O gerador produz o corpo (malha + mãos ancoradas) no seu frame Y-up calibrado; orientamos o BLOCO todo para Z-up (Blender) com uma
    // rotação de +90° em X no grupo consumidor — feet-no-chão vai para z=0, frente do corpo para -Y. O gerador e as âncoras ficam intocados.
    return (
        <group rotation={[Math.PI / 2, 0, 0]}>
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
            <mesh position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#16131d" roughness={0.9} metalness={0.05} />
            </mesh>
            <Grid rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.002]} args={[40, 40]} cellSize={1} cellThickness={0.6} cellColor="#3a3550" sectionSize={5} sectionThickness={1.1} sectionColor="#6c5f8f" fadeDistance={60} fadeStrength={1} followCamera={false} infiniteGrid={false} />
        </group>
    );
};
