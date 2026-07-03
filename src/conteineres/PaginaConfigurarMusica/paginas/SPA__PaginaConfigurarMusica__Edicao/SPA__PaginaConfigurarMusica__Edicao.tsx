'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { useContexto__PaginaConfigurarMusica__Edicao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';
import { useContexto__PaginaConfigurarMusica__Edicao__Abas, type AbaEdicao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao__Abas/contexto';
import { Conteiner__PaginaConfigurarMusica__Edicao__Abas } from './Conteiner__PaginaConfigurarMusica__Edicao__Abas';

const ABAS: { id: AbaEdicao; rotulo: string }[] = [{ id: 'MONTAGEM', rotulo: 'Montagem' }, { id: 'CLIMA', rotulo: 'Clima' }];

export default function SPA__PaginaConfigurarMusica__Edicao() {
    const ctx = useContexto__PaginaConfigurarMusica__Edicao();
    const abas = useContexto__PaginaConfigurarMusica__Edicao__Abas();

    return (
        <section className={styles.editor}>
            {ctx.analiseAudio && (
                <div className={styles.analiseAudio}>
                    <span className={styles.medida}>Loudness <b>{ctx.analiseAudio.loudnessLufs.toFixed(1)}</b> LUFS</span>
                    <span className={styles.medida}>Dinâmica <b>{ctx.analiseAudio.lraLu !== null ? ctx.analiseAudio.lraLu.toFixed(1) : '—'}</b> LU</span>
                    <span className={styles.medida}>Pico <b>{ctx.analiseAudio.picoDbfs.toFixed(1)}</b> dBFS</span>
                    <span className={styles.medida}>Ganho <b>{ctx.analiseAudio.ganhoDb >= 0 ? '+' : ''}{ctx.analiseAudio.ganhoDb.toFixed(1)}</b> dB</span>
                    {ctx.analiseAudio.travadoAntiClip && <span className={styles.sinal}>ganho travado (anti-clip)</span>}
                </div>
            )}

            <nav className={styles.abas}>
                {ABAS.map(aba => (
                    <button key={aba.id} type="button" className={`${styles.aba} ${abas.abaAtual === aba.id ? styles.abaAtiva : ''}`} onClick={() => abas.navegarPara(aba.id)}>{aba.rotulo}</button>
                ))}
            </nav>

            <div className={styles.conteudoAba}>
                <Conteiner__PaginaConfigurarMusica__Edicao__Abas />
            </div>

            <div className={styles.acaoSalvar}>
                {ctx.erroSalvar ? <span className={styles.erro}>{ctx.erroSalvar}</span> : null}
                <button className={styles.botaoSalvar} disabled={!ctx.podeSalvar} onClick={ctx.salvar}>
                    <FontAwesomeIcon icon={faFloppyDisk} /> {ctx.salvando ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </section>
    );
};
