'use client';

import styles from './styles.module.css';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { MouseEvent } from 'react';
import type { TipoMalhaEditor3D } from '../editor/editor3D.tipos';

function obtemIconeObjeto(tipo: TipoMalhaEditor3D): string {
    if (tipo === 'VERTICE') return '•';
    if (tipo === 'PLANO_2D') return '▭';
    if (tipo === 'CIRCULO_2D') return '○';
    if (tipo === 'CUBO_3D') return '□';
    if (tipo === 'CILINDRO_3D') return '◉';

    return '●';
};

function obtemTipoObjeto(tipo: TipoMalhaEditor3D): string {
    if (tipo === 'VERTICE') return 'Vertex';
    if (tipo === 'PLANO_2D') return 'Plane';
    if (tipo === 'CIRCULO_2D') return 'Circle';
    if (tipo === 'CUBO_3D') return 'Cube';
    if (tipo === 'CILINDRO_3D') return 'Cylinder';

    return 'Sphere';
};

export function PainelCenaColecaoEditor3D() {
    const { estado, acoes } = useEditor3DContexto();

    function selecionaObjeto(event: MouseEvent<HTMLButtonElement>, idObjeto: string): void { acoes.selecionaObjeto(idObjeto, event.shiftKey); };

    return (
        <PainelColapsavelEditor3D titulo="Scene Collection" valor={String(estado.objetos.length)}>
            <div className={styles.arvoreCena}>
                <button className={styles.linhaColecao} type="button" onClick={() => acoes.selecionaObjeto(null)}>
                    <span className={styles.indicadorArvore}>▾</span>
                    <span className={styles.iconeColecao}>▣</span>
                    <strong>Collection</strong>
                </button>

                <button className={styles.linhaObjetoCena} type="button" onClick={() => acoes.selecionaObjeto(null)}>
                    <span className={styles.espacoArvore} />
                    <span className={styles.iconeOrigem}>◎</span>
                    <span className={styles.nomeObjetoCena}>Origin</span>
                    <strong>0, 0, 0</strong>
                </button>

                {estado.objetos.length === 0 && <div className={styles.linhaObjetoVazio}><span className={styles.espacoArvore} /><span className={styles.iconeObjetoVazio}>∅</span><span>Nenhum objeto na cena</span></div>}

                {estado.objetos.map(objeto => (
                    <button key={objeto.id} className={`${styles.linhaObjetoCena} ${estado.idsObjetosSelecionados.includes(objeto.id) ? styles.linhaObjetoCenaSelecionado : ''}`} type="button" onClick={event => selecionaObjeto(event, objeto.id)} aria-pressed={estado.idsObjetosSelecionados.includes(objeto.id)}>
                        <span className={styles.espacoArvore} />
                        <span className={styles.iconeObjetoCena}>{obtemIconeObjeto(objeto.tipo)}</span>
                        <span className={styles.nomeObjetoCena}>{objeto.nome}</span>
                        <strong>{obtemTipoObjeto(objeto.tipo)}</strong>
                    </button>
                ))}
            </div>

            <div className={styles.linhaBotoes}>
                <button className={styles.botaoControle} type="button" onClick={acoes.limpaCena}>Clear Scene</button>
            </div>
        </PainelColapsavelEditor3D>
    );
};