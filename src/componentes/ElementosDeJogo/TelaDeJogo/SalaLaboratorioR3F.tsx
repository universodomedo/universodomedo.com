import type { PortaMapaSalaJogoWsDto } from 'types-nora-api';

import { ALTURA_PAREDE, ESPESSURA_PAREDE, mundoX, mundoZ, paraUnidadeCena } from './cenaSalaJogo.helpers';

interface SalaLaboratorioProps { largura: number; altura: number; portas: readonly PortaMapaSalaJogoWsDto[]; };

// Abertura numa parede: centro ao longo da parede (unidade de cena, mundo*) + largura + altura (unidade de cena).
type AberturaParede = { centro: number; largura: number; altura: number; };
function ehPortaHorizontal(porta: PortaMapaSalaJogoWsDto): boolean { return Math.abs(((porta.orientacaoGraus % 180) + 180) % 180) < 45; };

// Cenario da Sala. Recebe largura/altura em MILIMETROS (dado bruto) e desenha TUDO em unidade de cena via paraUnidadeCena — chao, paredes, paineis e reforcos na mesma escala das figuras e da camera.
export function SalaLaboratorioR3F({ largura, altura, portas }: SalaLaboratorioProps) {
    const larguraCena = paraUnidadeCena(largura);
    const alturaCena = paraUnidadeCena(altura);
    const meioParede = ALTURA_PAREDE / 2;
    const recuoPainel = ESPESSURA_PAREDE * 0.6;
    const alturaPainel = ALTURA_PAREDE * 0.74;

    // Aberturas por parede: N/S (horizontal, ao longo de X, centro = mundoX) — o lado é dado por posicao.y; L/O (vertical, ao longo de Z, centro = mundoZ) — lado por posicao.x.
    const aberturaDe = (porta: PortaMapaSalaJogoWsDto, horizontal: boolean): AberturaParede => ({ centro: horizontal ? mundoX(porta.posicao.x, largura) : mundoZ(porta.posicao.y, altura), largura: paraUnidadeCena(porta.larguraMilimetros), altura: paraUnidadeCena(porta.alturaMilimetros) });
    const aberturasNorte = portas.filter(porta => ehPortaHorizontal(porta) && porta.posicao.y <= altura / 2).map(porta => aberturaDe(porta, true));
    const aberturasSul = portas.filter(porta => ehPortaHorizontal(porta) && porta.posicao.y > altura / 2).map(porta => aberturaDe(porta, true));
    const aberturasOeste = portas.filter(porta => !ehPortaHorizontal(porta) && porta.posicao.x <= largura / 2).map(porta => aberturaDe(porta, false));
    const aberturasLeste = portas.filter(porta => !ehPortaHorizontal(porta) && porta.posicao.x > largura / 2).map(porta => aberturaDe(porta, false));

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[larguraCena, alturaCena]} />
                <meshStandardMaterial color="#cdd4db" roughness={0.55} metalness={0.12} />
            </mesh>

            <ParedeComAberturas eixo="x" posFixa={-alturaCena / 2} inicio={-larguraCena / 2} fim={larguraCena / 2} aberturas={aberturasNorte} />
            <ParedeComAberturas eixo="x" posFixa={alturaCena / 2} inicio={-larguraCena / 2} fim={larguraCena / 2} aberturas={aberturasSul} />
            <ParedeComAberturas eixo="z" posFixa={larguraCena / 2} inicio={-alturaCena / 2} fim={alturaCena / 2} aberturas={aberturasLeste} />
            <ParedeComAberturas eixo="z" posFixa={-larguraCena / 2} inicio={-alturaCena / 2} fim={alturaCena / 2} aberturas={aberturasOeste} />

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

// Parede com aberturas passantes: segmentos cheios ENTRE as aberturas + verga (padieira) acima de cada uma, deixando o vão livre embaixo. eixo 'x' = parede horizontal (varia X, z fixo em posFixa); 'z' = vertical (varia Z, x fixo).
function ParedeComAberturas({ eixo, posFixa, inicio, fim, aberturas }: { eixo: 'x' | 'z'; posFixa: number; inicio: number; fim: number; aberturas: readonly AberturaParede[]; }) {
    const meioParede = ALTURA_PAREDE / 2;
    const pecas: ParedeProps[] = [];
    const segmento = (de: number, ate: number): void => {
        const comprimento = ate - de;
        if (comprimento <= 0.001) return;
        const centro = (de + ate) / 2;
        pecas.push(eixo === 'x' ? { position: [centro, meioParede, posFixa], args: [comprimento, ALTURA_PAREDE, ESPESSURA_PAREDE] } : { position: [posFixa, meioParede, centro], args: [ESPESSURA_PAREDE, ALTURA_PAREDE, comprimento] });
    };
    const verga = (de: number, ate: number, alturaAbertura: number): void => {
        const alturaVerga = ALTURA_PAREDE - alturaAbertura;
        if (alturaVerga <= 0.001) return;
        const comprimento = ate - de;
        const centro = (de + ate) / 2;
        const yCentro = alturaAbertura + alturaVerga / 2;
        pecas.push(eixo === 'x' ? { position: [centro, yCentro, posFixa], args: [comprimento, alturaVerga, ESPESSURA_PAREDE] } : { position: [posFixa, yCentro, centro], args: [ESPESSURA_PAREDE, alturaVerga, comprimento] });
    };
    let cursor = inicio;
    for (const abertura of [...aberturas].sort((a, b) => a.centro - b.centro)) {
        const esquerda = Math.max(inicio, abertura.centro - abertura.largura / 2);
        const direita = Math.min(fim, abertura.centro + abertura.largura / 2);
        segmento(cursor, esquerda);
        verga(esquerda, direita, abertura.altura);
        cursor = Math.max(cursor, direita);
    }
    segmento(cursor, fim);
    return <>{pecas.map((peca, indice) => <Parede key={indice} position={peca.position} args={peca.args} />)}</>;
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
            <meshStandardMaterial color="#d6dbe2" emissive="#c9d4e6" emissiveIntensity={0.25} roughness={0.45} />
        </mesh>
    );
};
