'use client';

import styles from './MiniaturaMapa3D.module.css';

import { Canvas } from '@react-three/fiber';

import { MapaProjetoR3F } from 'Componentes/ElementosDeJogo/TelaDeJogo/MapaProjetoR3F';
import { useReforcaRedimensionamentoCanvas } from 'Componentes/ElementosDeJogo/TelaDeJogo/cenaSalaJogo.helpers';
import { dimensoesMapaDaCena } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';

// Miniatura 3D REAL de um Mapa (Projeto 3D tipo MAPA), pra viver DENTRO de um card de listagem: câmera fixa, sem controles
// (o clique atravessa e continua selecionando o card) e frameloop="demand" (renderiza uma vez — N cards não viram N render-loops).
// Só consulta o Projeto 3D (cache do useProjetoMapa); nada de Partida/servidor.
export function MiniaturaMapa3D({ idProjeto }: { idProjeto: number }) {
    useReforcaRedimensionamentoCanvas();
    const { projetoMapa, carregandoMapa } = useProjetoMapa(idProjeto);
    const cenaMapa = projetoMapa?.cenaCanonica ?? null;
    const dimensoes = cenaMapa !== null ? dimensoesMapaDaCena(cenaMapa) : null;

    if (cenaMapa === null || dimensoes === null) return <span className={styles.aviso}>{carregandoMapa ? '…' : 'Mapa indisponível'}</span>;

    const largura = dimensoes.larguraMilimetros;
    const altura = dimensoes.alturaMilimetros;
    const extensao = Math.max(largura, altura, 1) / 1000;
    const distancia = Math.max(8, extensao * 1.4);

    return (
        <Canvas className={styles.cena} frameloop="demand" dpr={[1, 1.5]} resize={{ offsetSize: true }} camera={{ position: [0.5 + distancia * 0.62, distancia * 0.8, 0.5 + distancia * 0.62], fov: 38, near: 0.1, far: distancia * 8 }}>
            <color attach="background" args={['#0e0c14']} />
            <ambientLight intensity={0.65} color="#eef2f6" />
            <hemisphereLight intensity={0.45} color="#f4f7fb" groundColor="#9aa1ad" />
            <directionalLight position={[8, 12, 6]} intensity={1.0} color="#fff4e2" />

            <MapaProjetoR3F cena={cenaMapa} largura={largura} altura={altura} />
        </Canvas>
    );
};
