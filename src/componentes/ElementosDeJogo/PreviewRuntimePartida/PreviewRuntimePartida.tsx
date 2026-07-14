'use client';

import styles from './PreviewRuntimePartida.module.css';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ConfiguracaoPartida } from 'types-nora-api';

import { MapaProjetoR3F, useAlturaApoioNoMapa } from 'Componentes/ElementosDeJogo/TelaDeJogo/MapaProjetoR3F';
import { FiguraSerR3F } from 'Componentes/ElementosDeJogo/TelaDeJogo/FiguraSerR3F';
import { mundoX, mundoZ, useReforcaRedimensionamentoCanvas } from 'Componentes/ElementosDeJogo/TelaDeJogo/cenaSalaJogo.helpers';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';

type Interagivel = ConfiguracaoPartida['interagiveis'][number];
type Luz = NonNullable<ConfiguracaoPartida['luzes']>[number];

// Preview do Runtime 100% CLIENTE: carrega o mapa autorado e monta os interagíveis da CONFIG em seus lugares — sem
// iniciar Partida, sem sala, sem Ser/ficha, sem nada de servidor (a única consulta é o Projeto 3D do mapa, com cache).
// Câmera livre (orbitar/zoom/pan) para inspecionar a autoria como ela vai nascer em jogo.
export function PreviewRuntimePartida({ configuracao }: { configuracao: ConfiguracaoPartida }) {
    useReforcaRedimensionamentoCanvas();
    const largura = configuracao.cenario.mapaLogico.larguraMilimetros;
    const altura = configuracao.cenario.mapaLogico.alturaMilimetros;
    const { projetoMapa, carregandoMapa } = useProjetoMapa(configuracao.cenario.mapaLogico.idProjetoMapa ?? null);
    const cenaMapa = projetoMapa?.cenaCanonica ?? null;
    const extensao = Math.max(largura, altura, 1) / 1000;
    const distancia = Math.max(8, extensao * 1.15);

    if (cenaMapa === null) {
        return <p className={styles.aviso}>{carregandoMapa ? 'Carregando o mapa…' : 'A configuração não aponta um Mapa — selecione um no Runtime para visualizar o preview.'}</p>;
    }

    return (
        <div className={styles.preview}>
            <Canvas className={styles.cena} shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [0.5 + distancia * 0.62, distancia * 0.8, 0.5 + distancia * 0.62], fov: 38, near: 0.1, far: distancia * 8 }}>
                <color attach="background" args={['#0e0c14']} />
                <ambientLight intensity={0.65} color="#eef2f6" />
                <hemisphereLight intensity={0.45} color="#f4f7fb" groundColor="#9aa1ad" />
                <directionalLight castShadow position={[8, 12, 6]} intensity={1.0} color="#fff4e2" />

                <MapaProjetoR3F cena={cenaMapa} largura={largura} altura={altura} />

                {configuracao.interagiveis.map(interagivel => <InteragivelPreviewR3F key={interagivel.chave} interagivel={interagivel} largura={largura} altura={altura} />)}
                {(configuracao.luzes ?? []).map(luz => <MarcadorLuzPreviewR3F key={luz.chave} luz={luz} largura={largura} altura={altura} />)}

                <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0.5, 0.6, 0.5]} minDistance={1.5} maxDistance={distancia * 4} />
            </Canvas>
            <p className={styles.leitura}>Preview local do Runtime — mapa e interagíveis nas posições configuradas, sem iniciar Partida. Câmera livre (orbitar/zoom/pan).</p>
        </div>
    );
};

// Interagível da CONFIG (não do servidor): Ser = figura procedural local (jogador azul, sistema roxo); objeto = caixa nas
// dimensões autoradas. Todos ASSENTADOS na superfície do mapa no seu XZ (camadas — Ser sobre o piso, não na espessura).
function InteragivelPreviewR3F({ interagivel, largura, altura }: { interagivel: Interagivel; largura: number; altura: number }) {
    const posicao = interagivel.posicao ?? { x: 0, y: 0 };
    const x = mundoX(posicao.x, largura);
    const z = mundoZ(posicao.y, altura);
    const alturaApoio = useAlturaApoioNoMapa(x, z);

    if (interagivel.tipo === 'ser') return <FiguraSerR3F position={[x, alturaApoio, z]} corPrimaria={interagivel.controlador.tipo === 'jogador' ? '#2f6f86' : '#7484b4'} corPele="#d8b48c" />;

    // Objeto vindo do MAPA: o corpo já está desenhado pela malha do próprio mapa — nada a acrescentar no preview.
    if (interagivel.idElementoMapa != null) return null;

    const dimLargura = (interagivel.larguraMilimetros ?? 800) / 1000;
    const dimAltura = (interagivel.alturaMilimetros ?? 900) / 1000;
    const dimProfundidade = (interagivel.profundidadeMilimetros ?? 800) / 1000;

    return (
        <mesh castShadow position={[x, alturaApoio + dimAltura / 2, z]}>
            <boxGeometry args={[dimLargura, dimAltura, dimProfundidade]} />
            <meshStandardMaterial color="#8aa0d0" roughness={0.5} metalness={0.1} />
        </mesh>
    );
};

// Luz da config como MARCADOR (esfera âmbar emissiva) — o preview usa iluminação neutra de autoria, não a iluminação do jogo.
function MarcadorLuzPreviewR3F({ luz, largura, altura }: { luz: Luz; largura: number; altura: number }) {
    const x = mundoX(luz.posicao?.x ?? 0, largura);
    const z = mundoZ(luz.posicao?.y ?? 0, altura);
    const alturaApoio = useAlturaApoioNoMapa(x, z);
    if (luz.posicao === null) return null;

    return (
        <mesh position={[x, alturaApoio + 0.35, z]}>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#ffd98a" emissive="#ffb347" emissiveIntensity={0.9} roughness={0.35} />
        </mesh>
    );
};
