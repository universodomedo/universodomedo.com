'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

import { alcanceEfetivoMetrosFonteEditor3D, type FonteDeLuzEditor3D } from './editor3D.camadaJogo';

// Interruptor já RESOLVIDO para o esquema: o corpo e as luzes do circuito dele (derivado no Editor3D — aqui só se desenha).
export type InterruptorEsquemaEditor3D = {
    readonly idLocal: string;
    readonly idElementoCena: string;
    readonly idsFontesDeLuz: readonly string[];
};

// Esquema elétrico do mapa: o que cada fonte ALCANÇA e o que cada interruptor ACIONA — as duas perguntas que hoje só se
// responde entrando numa Partida. É diagnóstico de autoria (não é o que o jogador vê), por isso vive num toggle próprio,
// independente da fidelidade de iluminação.
interface EsquemaEletricoEditor3DProps {
    readonly fontesDeLuz: readonly FonteDeLuzEditor3D[];
    readonly interruptores: readonly InterruptorEsquemaEditor3D[];
    // Posição VIVA do objeto na cena (lida das meshes), para a linha da fiação acompanhar o gizmo enquanto o autor arrasta.
    readonly obtemPosicaoElemento: (idElementoCena: string) => [number, number, number] | null;
};

const OPACIDADE_ALCANCE = 0.08;
const OPACIDADE_ALCANCE_EFETIVO = 0.16;
const COR_ALCANCE_EFETIVO = '#ff8a3d';
const COR_FIACAO = '#ffcf6e';

export function EsquemaEletricoEditor3D({ fontesDeLuz, interruptores, obtemPosicaoElemento }: EsquemaEletricoEditor3DProps) {
    const fontesPorId = useMemo(() => new Map(fontesDeLuz.map(fonte => [fonte.idLocal, fonte])), [fontesDeLuz]);

    // Um segmento por par (interruptor, luz do circuito). Fonte AMBIENTE não tem posição: a linha até a origem do corpo
    // seria mentira, então ela é omitida — o painel já conta as luzes do circuito.
    // SEM memo de propósito: a origem sai da MESH viva, que muda sem alterar nenhuma prop — memoizar deixava a fiação
    // parada enquanto o autor arrastava o interruptor. O custo é desprezível (poucos segmentos por mapa).
    const ligacoes: { readonly chave: string; readonly de: Vector3; readonly para: Vector3 }[] = [];
    for (const interruptor of interruptores) {
        const origem = obtemPosicaoElemento(interruptor.idElementoCena);
        if (origem === null) continue;
        for (const idFonte of interruptor.idsFontesDeLuz) {
            const fonte = fontesPorId.get(idFonte);
            if (fonte === undefined || fonte.tipo !== 'PONTO') continue;
            ligacoes.push({ chave: `${interruptor.idLocal}:${idFonte}`, de: new Vector3(origem[0], origem[1], origem[2]), para: new Vector3(fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]) });
        }
    }

    return (
        <group userData={{ naoExibirNaCapa: true }}>
            {/* DUAS esferas por fonte, nenhuma mente: a da COR DA FONTE é o Alcance autorado (o corte — o teto do campo é
                o raio da intensidade MÁXIMA); a LARANJA é até onde a intensidade ATUAL ilumina de fato. Com intensidade
                em 100% as duas coincidem — o anel entre elas é o quanto a iluminação ainda pode crescer. Intensidade e
                Alcance mexidos no painel refletem aqui na hora. */}
            {fontesDeLuz.filter(fonte => fonte.tipo === 'PONTO' && fonte.alcanceMetros > 0).map(fonte => (
                <group key={fonte.idLocal} position={[fonte.posicao[0], fonte.posicao[1], fonte.posicao[2]]}>
                    <mesh>
                        <sphereGeometry args={[fonte.alcanceMetros, 24, 16]} />
                        <meshBasicMaterial color={fonte.cor} wireframe transparent opacity={OPACIDADE_ALCANCE} depthWrite={false} />
                    </mesh>
                    {alcanceEfetivoMetrosFonteEditor3D(fonte) > 0 && (
                        <mesh>
                            <sphereGeometry args={[alcanceEfetivoMetrosFonteEditor3D(fonte), 24, 16]} />
                            <meshBasicMaterial color={COR_ALCANCE_EFETIVO} wireframe transparent opacity={OPACIDADE_ALCANCE_EFETIVO} depthWrite={false} />
                        </mesh>
                    )}
                </group>
            ))}

            {/* Fiação: comando → cada fonte do circuito. Tracejado para não se confundir com geometria da cena. */}
            {ligacoes.map(ligacao => <Line key={ligacao.chave} points={[ligacao.de, ligacao.para]} color={COR_FIACAO} lineWidth={1.4} dashed dashSize={0.25} gapSize={0.15} depthTest={false} />)}
        </group>
    );
};