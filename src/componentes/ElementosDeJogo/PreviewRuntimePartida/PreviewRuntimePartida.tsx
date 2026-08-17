'use client';

import styles from './PreviewRuntimePartida.module.css';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ConfiguracaoPartida } from 'types-nora-api';

import { MapaProjetoR3F, useAlturaApoioNoMapa } from 'Componentes/ElementosDeJogo/TelaDeJogo/MapaProjetoR3F';
import { FiguraSerR3F } from 'Componentes/ElementosDeJogo/TelaDeJogo/FiguraSerR3F';
import { mundoX, mundoY, useReforcaRedimensionamentoCanvas } from 'Componentes/ElementosDeJogo/TelaDeJogo/cenaSalaJogo.helpers';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';

type Interagivel = ConfiguracaoPartida['interagiveis'][number];

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
            <Canvas className={styles.cena} shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [0.5 + distancia * 0.62, 0.5 - distancia * 0.62, distancia * 0.8], up: [0, 0, 1], fov: 38, near: 0.1, far: distancia * 8 }}>
                <color attach="background" args={['#0e0c14']} />
                <ambientLight intensity={0.65} color="#eef2f6" />
                <hemisphereLight intensity={0.45} color="#f4f7fb" groundColor="#9aa1ad" position={[0, 0, 1]} />
                <directionalLight castShadow position={[8, 6, 12]} intensity={1.0} color="#fff4e2" />

                {/* O mapa traz as próprias Fontes de Luz autoradas; a iluminação neutra acima é só o estúdio de autoria do preview. */}
                <MapaProjetoR3F cena={cenaMapa} largura={largura} altura={altura} />

                {configuracao.interagiveis.map(interagivel => <InteragivelPreviewR3F key={interagivel.chave} interagivel={interagivel} largura={largura} altura={altura} />)}

                <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0.5, 0.5, 0.6]} minDistance={1.5} maxDistance={distancia * 4} />
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
    const y = mundoY(posicao.y, altura);
    const alturaApoio = useAlturaApoioNoMapa(x, y);

    if (interagivel.tipo === 'ser') return <FiguraSerR3F position={[x, y, alturaApoio]} corPrimaria={interagivel.controlador.tipo === 'jogador' ? '#2f6f86' : '#7484b4'} corPele="#d8b48c" />;

    // Objeto vindo do MAPA: o corpo já está desenhado pela malha do próprio mapa — nada a acrescentar no preview.
    if (interagivel.idElementoMapa != null) return null;

    const dimLargura = (interagivel.larguraMilimetros ?? 800) / 1000;
    const dimAltura = (interagivel.alturaMilimetros ?? 900) / 1000;
    const dimProfundidade = (interagivel.profundidadeMilimetros ?? 800) / 1000;

    // Z-up: altura no eixo Z; caixa com dimensões [X=largura, Y=profundidade, Z=altura].
    return (
        <mesh castShadow position={[x, y, alturaApoio + dimAltura / 2]}>
            <boxGeometry args={[dimLargura, dimProfundidade, dimAltura]} />
            <meshStandardMaterial color="#8aa0d0" roughness={0.5} metalness={0.1} />
        </mesh>
    );
};
