import type { FonteDeLuzMapa } from 'types-nora-api';

import { intensidadeFisicaFonteDeLuzPontoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';

// Fontes de Luz AUTORADAS NO MAPA (Editor 3D, projeto tipo MAPA). Iluminação é domínio do mapa, não da Partida: a mesma sala
// chega iluminada em toda Partida que a usa. Renderiza DENTRO do grupo do mapa — a posição autorada já está no espaço do mapa
// (metros, Z-up), a mesma escala da cena de jogo (1 unidade = 1 m), então não há conversão nenhuma aqui.
// A intensidade do CONTRATO é percentual do alcance — a física (candela) deriva do helper, o mesmo do Editor.
// A luz é OBJETIVA (ilumina o mundo para todos); a visão de cada Ser (máscara + dependência de iluminação) decide o que ELE vê.
export function LuzesMapaR3F({ luzes, luzesApagadas }: { luzes: readonly FonteDeLuzMapa[]; luzesApagadas: readonly string[] }) {
    return (
        <>
            {luzes.filter(luz => luzEstaAcesa(luz, luzesApagadas)).map(luz => luz.tipo === 'AMBIENTE'
                ? <ambientLight key={luz.idLocal} intensity={luz.intensidade} color={corDaLuz(luz)} />
                : (
                    <pointLight
                        key={luz.idLocal}
                        position={[luz.posicao[0], luz.posicao[1], luz.posicao[2]]}
                        intensity={intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade)}
                        distance={luz.alcanceMetros}
                        decay={2}
                        color={corDaLuz(luz)}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-bias={-0.0008}
                        shadow-radius={5}
                        shadow-camera-near={0.1}
                        shadow-camera-far={Math.max(1, luz.alcanceMetros)}
                    />
                ))}
        </>
    );
};

// A cor vem da CenaCanonica como RGB (0..1) — o mesmo formato que o Three aceita em `color` via array.
function corDaLuz(luz: FonteDeLuzMapa): [number, number, number] { return [luz.cor[0], luz.cor[1], luz.cor[2]]; };

// Quem manda sobre PODER apagar é o MAPA (`alternavel`); a Sala só diz QUEM está apagada agora. Luz fixa ignora a lista —
// assim uma ação apontando uma luz que deixou de ser alternável no Editor não apaga nada.
function luzEstaAcesa(luz: FonteDeLuzMapa, luzesApagadas: readonly string[]): boolean {
    return !luz.alternavel || !luzesApagadas.includes(luz.idLocal);
};

// Soma das intensidades FÍSICAS das luzes de ponto ACESAS do mapa — insumo do rebatimento (luz indireta fingida) da cena de jogo.
export function intensidadeTotalLuzesMapa(luzes: readonly FonteDeLuzMapa[], luzesApagadas: readonly string[]): number {
    return luzes.reduce((soma, luz) => soma + (luz.tipo === 'PONTO' && luzEstaAcesa(luz, luzesApagadas) && Number.isFinite(luz.intensidade) ? intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade) : 0), 0);
};