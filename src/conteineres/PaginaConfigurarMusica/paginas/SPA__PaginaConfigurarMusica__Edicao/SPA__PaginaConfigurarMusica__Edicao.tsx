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
