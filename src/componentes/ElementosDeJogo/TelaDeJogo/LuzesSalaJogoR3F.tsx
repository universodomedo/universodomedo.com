import type { LuzSalaJogoWsDto } from 'types-nora-api';

import { mundoX, mundoZ, paraUnidadeCena } from './cenaSalaJogo.helpers';

// Altura fixa (unidade de cena) da fonte de luz — perto do teto (parede = 3.6). Formato/altura autoravel e futuro.
const ALTURA_LUZ = 2.6;

interface LuzesSalaJogoR3FProps { luzes: readonly LuzSalaJogoWsDto[]; largura: number; altura: number; };

// Fontes de luz OBJETIVAS do cenario: cada uma vira um pointLight (com sombra, logo ocluida por paredes/objetos) + um marcador emissivo (a lampada). A visao do Ser (mascara + dependencia) decide o que ele ve do que estas iluminam.
export function LuzesSalaJogoR3F({ luzes, largura, altura }: LuzesSalaJogoR3FProps) {
    return (
        <>
            {luzes.map(luz => <LuzR3F key={luz.key} luz={luz} largura={largura} altura={altura} />)}
        </>
    );
};

interface LuzR3FProps { luz: LuzSalaJogoWsDto; largura: number; altura: number; };

function LuzR3F({ luz, largura, altura }: LuzR3FProps) {
    if (luz.posicao === null) return null;

    const x = mundoX(luz.posicao.x, largura);
    const z = mundoZ(luz.posicao.y, altura);
    const distancia = paraUnidadeCena(luz.alcanceMilimetros);

    return (
        <group position={[x, ALTURA_LUZ, z]}>
            <pointLight intensity={luz.intensidade} distance={distancia} decay={2} color="#ffe8c0" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0008} shadow-radius={5} shadow-camera-near={0.1} shadow-camera-far={distancia} />
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#fff2d6" emissive="#ffdca0" emissiveIntensity={1.1} toneMapped={false} />
            </mesh>
        </group>
    );
};
