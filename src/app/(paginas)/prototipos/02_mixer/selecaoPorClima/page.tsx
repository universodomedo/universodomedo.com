'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { GraphqlLeituras } from 'types-nora-api';

import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { useDefinirMusicaPagina } from 'Hooks/useDefinirMusicaPagina';

// Casos 4+5 (mapa de seleção + buscar próximos): constelação navegável sobre o acervo real. Escolhe 2 dimensões
// pros eixos (+ cor) e toca no clique (SSOT de áudio). Clicar também configura a música como "centro": as mais
// próximas no VETOR COMPLETO (todas as dimensões, mesmo fora dos eixos) acendem — o "buscar próximos desse ponto".
const SELECT_MUSICA = { id: true, nome: true, fonteMusica: { nome: true }, clima: { itens: { idDimensao: true, nivel: true } } } as const;
const SELECT_DIMENSAO = { id: true, nome: true } as const;
const QTD_VIZINHOS = 3;

const PX0 = 28, PX1 = 300, PY0 = 16, PY1 = 220;
const px = (nivel: number) => PX0 + (nivel / 10) * (PX1 - PX0);
const py = (nivel: number) => PY1 - (nivel / 10) * (PY1 - PY0);

function cor(nivel: number): string {
    const a = [111, 155, 154], b = [183, 144, 81], c = [168, 50, 50], z = nivel * 10;
    let r: number, g: number, bl: number;
    if (z < 50) { const t = z / 50; r = a[0] + (b[0] - a[0]) * t; g = a[1] + (b[1] - a[1]) * t; bl = a[2] + (b[2] - a[2]) * t; }
    else { const t = (z - 50) / 50; r = b[0] + (c[0] - b[0]) * t; g = b[1] + (c[1] - b[1]) * t; bl = b[2] + (c[2] - b[2]) * t; }
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)})`;
};

export default function PageSelecaoPorClima() {
    const definirMusicaPagina = useDefinirMusicaPagina();
    const consultaMusicas = useNoraGraphQLConsulta(() => GraphqlLeituras.MusicaConfigurada.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_MUSICA }), { valorInicial: [], carregando: 'Carregando músicas', mensagemErro: 'Não foi possível carregar as músicas.', carregamento: NoraApiCarregamento.BARRA });
    const consultaDimensoes = useNoraGraphQLConsulta(() => GraphqlLeituras.DimensaoClima.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_DIMENSAO }), { valorInicial: [], carregando: 'Carregando dimensões', mensagemErro: 'Não foi possível carregar as dimensões.', carregamento: NoraApiCarregamento.BARRA });

    const dimensoes = consultaDimensoes.data;
    const musicas = consultaMusicas.data;
    type MusicaClima = (typeof musicas)[number];

    const [eixoX, setEixoX] = useState<number | null>(null);
    const [eixoY, setEixoY] = useState<number | null>(null);
    const [eixoCor, setEixoCor] = useState<number | null>(null);
    const [centroId, setCentroId] = useState<number | null>(null);
    const [tocando, setTocando] = useState<{ id: number; nome: string } | null>(null);

    const dimX = eixoX ?? dimensoes[0]?.id ?? null;
    const dimY = eixoY ?? dimensoes[1]?.id ?? dimensoes[0]?.id ?? null;
    const dimCor = eixoCor ?? dimensoes[2]?.id ?? dimensoes[0]?.id ?? null;

    const nomeDim = (id: number | null) => dimensoes.find(dimensao => dimensao.id === id)?.nome ?? '—';
    const nivel = (musica: MusicaClima, dimId: number | null) => (dimId == null ? 0 : (musica.clima.itens.find(item => item.idDimensao === dimId)?.nivel ?? 0));

    function distanciaVetorCompleto(a: MusicaClima, b: MusicaClima): number {
        let soma = 0;
        for (const dimensao of dimensoes) { const delta = (nivel(a, dimensao.id) - nivel(b, dimensao.id)) / 10; soma += delta * delta; }
        return Math.sqrt(soma);
    };

    const centro = centroId == null ? null : musicas.find(musica => musica.id === centroId) ?? null;
    const idsVizinhos = new Set<number>(
        centro ? musicas.filter(musica => musica.id !== centro.id).map(musica => ({ id: musica.id, d: distanciaVetorCompleto(centro, musica) })).sort((a, b) => a.d - b.d).slice(0, QTD_VIZINHOS).map(item => item.id) : []
    );

    function aoClicar(musica: MusicaClima) {
        definirMusicaPagina(musica.id, musica.nome);
        setTocando({ id: musica.id, nome: musica.nome });
        setCentroId(musica.id);
    };

    return (
        <div className={styles.pagina}>
            <header className={styles.cabecalho}>
                <h1>Selecione por clima</h1>
                <p>Escolha 2 dimensões pros eixos (+ cor) e clique numa música: ela toca e as mais próximas no vetor inteiro acendem.</p>
            </header>

            <div className={styles.eixos}>
                <label className={styles.eixo}>Eixo X<select value={dimX ?? ''} onChange={evento => setEixoX(Number(evento.target.value))}>{dimensoes.map(dimensao => <option key={dimensao.id} value={dimensao.id}>{dimensao.nome}</option>)}</select></label>
                <label className={styles.eixo}>Eixo Y<select value={dimY ?? ''} onChange={evento => setEixoY(Number(evento.target.value))}>{dimensoes.map(dimensao => <option key={dimensao.id} value={dimensao.id}>{dimensao.nome}</option>)}</select></label>
                <label className={styles.eixo}>Cor<select value={dimCor ?? ''} onChange={evento => setEixoCor(Number(evento.target.value))}>{dimensoes.map(dimensao => <option key={dimensao.id} value={dimensao.id}>{dimensao.nome}</option>)}</select></label>
            </div>

            <svg className={styles.mapa} viewBox="0 0 320 244" aria-label="Constelação de músicas pelas dimensões escolhidas">
                <rect x="28" y="16" width="272" height="204" fill="rgba(255,255,255,0.015)" stroke="rgba(183,144,81,0.22)" strokeWidth="0.5" />
                <text x="164" y="238" fill="#8f8a7e" fontSize="10" textAnchor="middle">{nomeDim(dimX)} →</text>
                <text x="-118" y="12" fill="#8f8a7e" fontSize="10" textAnchor="middle" transform="rotate(-90)">{nomeDim(dimY)} →</text>
                {musicas.map(musica => {
                    const x = px(nivel(musica, dimX));
                    const y = py(nivel(musica, dimY));
                    const ehCentro = centro?.id === musica.id;
                    const ehVizinho = idsVizinhos.has(musica.id);
                    const destacado = ehCentro || ehVizinho;
                    return (
                        <g key={musica.id} className={styles.orbe} onClick={() => aoClicar(musica)}>
                            {ehCentro ? <circle cx={x} cy={y} r={9} fill="none" stroke="#d8b06a" strokeWidth={1.6} /> : null}
                            {ehVizinho ? <circle cx={x} cy={y} r={8} fill="none" stroke="rgba(235,224,201,0.55)" strokeWidth={1} /> : null}
                            <circle cx={x} cy={y} r={destacado ? 6 : 4.5} fill={cor(nivel(musica, dimCor))} opacity={centro && !destacado ? 0.45 : 1} />
                            {destacado ? <text x={x + 10} y={y + 4} fill={ehCentro ? '#d8b06a' : '#EBE0C9'} fontSize="10">{musica.nome}</text> : null}
                            <title>{musica.nome} — {musica.fonteMusica?.nome ?? '—'}</title>
                        </g>
                    );
                })}
            </svg>

            <div className={styles.agora}>
                {tocando ? <span>♪ tocando · {tocando.nome}{centro ? ' — próximos destacados' : ''}</span> : <span>Clique numa música pra tocar e ver as próximas.</span>}
                {centro ? <button type="button" className={styles.limpar} onClick={() => setCentroId(null)}>limpar destaque</button> : null}
            </div>
            {musicas.length === 0 && consultaMusicas.carregando == null ? <p className={styles.vazio}>Nenhuma música configurada ainda.</p> : null}
        </div>
    );
};
