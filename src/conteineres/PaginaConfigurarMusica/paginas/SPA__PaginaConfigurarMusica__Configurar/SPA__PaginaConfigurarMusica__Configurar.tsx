'use client';

import { useState } from 'react';

import { type Contexto__PaginaConfigurarMusica__Props } from 'Contextos/Contexto__PaginaConfigurarMusica/contexto';
import styles from './styles.module.css';

export default function SPA__PaginaConfigurarMusica__Configurar({ musicas, fontes, configuradas, criar }: Contexto__PaginaConfigurarMusica__Props) {
    const [idMusica, setIdMusica] = useState('');
    const [nome, setNome] = useState('');
    const [fonteTexto, setFonteTexto] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const podeSalvar = idMusica !== '' && nome.trim().length > 0 && fonteTexto.trim().length > 0 && !salvando;

    async function salvar() {
        if (!podeSalvar) return;
        setSalvando(true);
        setErro(null);
        try {
            const fonteExistente = fontes.find(fonte => fonte.nome.trim().toLowerCase() === fonteTexto.trim().toLowerCase());
            await criar({ idArquivoTipadoMusica: Number(idMusica), nome: nome.trim(), idFonteMusica: fonteExistente ? fonteExistente.id : null, nomeFonteNova: fonteExistente ? null : fonteTexto.trim() });
            setIdMusica('');
            setNome('');
            setFonteTexto('');
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Falha ao salvar a configuração.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <section className={styles.pagina}>
            <div className={styles.formulario}>
                <label className={styles.campo}>
                    <span>Arquivo de música</span>
                    <select value={idMusica} onChange={evento => setIdMusica(evento.target.value)} disabled={salvando}>
                        <option value="">Selecione...</option>
                        {musicas.map(musica => <option key={musica.id} value={musica.id}>#{musica.id} — {musica.arquivo.caminhoArquivo}</option>)}
                    </select>
                </label>

                <label className={styles.campo}>
                    <span>Nome da música</span>
                    <input value={nome} onChange={evento => setNome(evento.target.value)} disabled={salvando} placeholder="Ex: Tema de Investigação" />
                </label>

                <label className={styles.campo}>
                    <span>Fonte (selecione ou digite uma nova)</span>
                    <input list="lista-fontes-musica" value={fonteTexto} onChange={evento => setFonteTexto(evento.target.value)} disabled={salvando} placeholder="Ex: Persona 5" />
                    <datalist id="lista-fontes-musica">
                        {fontes.map(fonte => <option key={fonte.id} value={fonte.nome} />)}
                    </datalist>
                </label>

                <button className={styles.botaoSalvar} onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar configuração'}</button>
                {erro ? <p className={styles.erro}>{erro}</p> : null}
            </div>

            <div className={styles.listaConfiguradas}>
                <h3>Músicas configuradas</h3>
                {configuradas.length < 1 ? <p className={styles.vazio}>Nenhuma música configurada ainda.</p> : (
                    <ul className={styles.lista}>
                        {configuradas.map(configurada => <li key={configurada.id}><strong>{configurada.nome}</strong> — {configurada.fonteMusica.nome} <span className={styles.idTag}>id {configurada.id}</span></li>)}
                    </ul>
                )}
            </div>
        </section>
    );
};
