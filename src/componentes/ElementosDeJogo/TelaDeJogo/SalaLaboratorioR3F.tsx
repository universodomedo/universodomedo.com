import { ALTURA_PAREDE, ESPESSURA_PAREDE, paraUnidadeCena } from './cenaSalaJogo.helpers';

interface SalaLaboratorioProps { largura: number; altura: number; };

// Cenario da Sala. Recebe largura/altura em MILIMETROS (dado bruto) e desenha TUDO em unidade de cena via paraUnidadeCena — chao, paredes, paineis e reforcos na mesma escala das figuras e da camera.
export function SalaLaboratorioR3F({ largura, altura }: SalaLaboratorioProps) {
    const larguraCena = paraUnidadeCena(largura);
    const alturaCena = paraUnidadeCena(altura);
    const meioParede = ALTURA_PAREDE / 2;
    const recuoPainel = ESPESSURA_PAREDE * 0.6;
    const alturaPainel = ALTURA_PAREDE * 0.74;

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[larguraCena, alturaCena]} />
                <meshStandardMaterial color="#cdd4db" roughness={0.55} metalness={0.12} />
            </mesh>

            <Parede position={[0, meioParede, -alturaCena / 2]} args={[larguraCena, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[0, meioParede, alturaCena / 2]} args={[larguraCena, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[larguraCena / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, alturaCena]} />
            <Parede position={[-larguraCena / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, alturaCena]} />

            <PainelLuz position={[0, alturaPainel, -alturaCena / 2 + recuoPainel]} args={[larguraCena * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[0, alturaPainel, alturaCena / 2 - recuoPainel]} args={[larguraCena * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[larguraCena / 2 - recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, alturaCena * 0.55]} />
            <PainelLuz position={[-larguraCena / 2 + recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, alturaCena * 0.55]} />

            <Reforco position={[-larguraCena / 2, meioParede, -alturaCena / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[larguraCena / 2, meioParede, -alturaCena / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[-larguraCena / 2, meioParede, alturaCena / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[larguraCena / 2, meioParede, alturaCena / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />

            <Reforco position={[0, 0.12, -alturaCena / 2]} args={[larguraCena + 0.1, 0.24, 0.4]} />
            <Reforco position={[0, 0.12, alturaCena / 2]} args={[larguraCena + 0.1, 0.24, 0.4]} />
            <Reforco position={[larguraCena / 2, 0.12, 0]} args={[0.4, 0.24, alturaCena + 0.1]} />
            <Reforco position={[-larguraCena / 2, 0.12, 0]} args={[0.4, 0.24, alturaCena + 0.1]} />

            <Reforco position={[0, ALTURA_PAREDE - 0.1, -alturaCena / 2]} args={[larguraCena + 0.1, 0.2, 0.42]} />
            <Reforco position={[0, ALTURA_PAREDE - 0.1, alturaCena / 2]} args={[larguraCena + 0.1, 0.2, 0.42]} />
            <Reforco position={[larguraCena / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, alturaCena + 0.1]} />
            <Reforco position={[-larguraCena / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, alturaCena + 0.1]} />
        </group>
    );
};

interface ParedeProps { position: [number, number, number]; args: [number, number, number]; };

function Parede({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#d7dde3" roughness={0.7} metalness={0.05} />
        </mesh>
    );
};

function Reforco({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#8d96a1" roughness={0.4} metalness={0.65} />
        </mesh>
    );
};

function PainelLuz({ position, args }: ParedeProps) {
    return (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#eef4ff" emissive="#dfeaff" emissiveIntensity={0.9} roughness={0.3} />
        </mesh>
    );
};
