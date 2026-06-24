'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';

import { useDefinirMusicaPagina } from 'Hooks/useDefinirMusicaPagina';

// Caso 2: cada "subpágina" (item da lista) define a sua própria música. idMusica = id de uma MusicaConfigurada (null = silêncio).
// Só a #1 (Stray Sheep) está configurada hoje; configure outras pra ouvir a troca completa.
type ItemMenu = { id: string; rotulo: string; idMusica: number | null };

const ITENS: ItemMenu[] = [
    { id: 'investigacao', rotulo: 'Sala de Investigação', idMusica: 1 },
    { id: 'caverna', rotulo: 'Caverna das Dicas', idMusica: 2 },
    { id: 'silencio', rotulo: 'Sala Silenciosa', idMusica: null },
];

export default function PagePrototipo() {
    const definirMusicaPagina = useDefinirMusicaPagina();
    const [selecionado, setSelecionado] = useState<ItemMenu | null>(null);

    // Ao entrar (e ao sair) nada toca; quem toca é o item selecionado.
    useEffect(() => {
        definirMusicaPagina(null, null);
        return () => definirMusicaPagina(null, null);
    }, [definirMusicaPagina]);

    function abrir(item: ItemMenu) {
        setSelecionado(item);
        definirMusicaPagina(item.idMusica, item.rotulo);
    };

    return (
        <div className={styles.prototipo}>
            <header className={styles.cabecalho}>
                <h1>Caso 2 — música por item (SPA)</h1>
                <p>Ao entrar, nada toca. Clique num item para abrir a subpágina e iniciar a música dela; trocar de item faz o crossfade e abre a Central de Áudio. O único código aqui é o disparo — o resto é a base reagindo ao SSOT.</p>
            </header>

            <div className={styles.corpo}>
                <nav className={styles.menu}>
                    {ITENS.map(item => (
                        <button key={item.id} className={`${styles.item} ${selecionado?.id === item.id ? styles.itemAtivo : ''}`} onClick={() => abrir(item)}>{item.rotulo}</button>
                    ))}
                </nav>

                <section className={styles.conteudo}>
                    {selecionado ? (
                        <p>Você abriu <strong>{selecionado.rotulo}</strong> · {selecionado.idMusica != null ? `música #${selecionado.idMusica}` : 'sem música'}.</p>
                    ) : (
                        <p className={styles.vazio}>Selecione um item à esquerda.</p>
                    )}
                </section>
            </div>
        </div>
    );
};
