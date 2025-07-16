'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AventurasMestre_Contexto() {
    const { aventurasFiltradas } = useContextoMestreAventuras();

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <>
            <h1>Minhas Aventuras</h1>

            <OpcoesBuscaAventuras />

            <div id={styles.recipiente_aventuras_mestre} {...scrollableProps}>
                {aventurasFiltradas!.map(grupo => (
                    <div key={grupo.id} className={styles.recipiente_item_imagem_aventura_mestre}>
                        <div className={styles.recipiente_imagem_aventura_mestre}>
                            <RecipienteImagem src={grupo.aventura.imagemCapa?.fullPath} />
                        </div>
                        <h4>{grupo.nomeUnicoGrupoAventura}</h4>
                    </div>
                ))}
            </div>
        </>
    );
};

function OpcoesBuscaAventuras() {
    const { atualizarFiltro, opcoesBusca, toggleOrdenacaoData } = useContextoMestreAventuras();
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setInputValue(valor);
        atualizarFiltro(valor);
    };

    const textoBotaoOrdenacao = () => {
        if (!opcoesBusca.ordenacao.direcao) return 'Data Criação';
        return `Data Criação ${opcoesBusca.ordenacao.direcao === 'asc' ? '↑' : '↓'}`;
    };

    return (
        <div id={styles.recipiente_opcoes_busca}>
            <div className={styles.ordenacao_container}>
                <button
                    onClick={toggleOrdenacaoData}
                    className={opcoesBusca.ordenacao.direcao ? styles.ativo : ''}
                >
                    {textoBotaoOrdenacao()}
                </button>
            </div>

            <div className={styles.filtro_container}>
                <input type="text" placeholder="Filtrar por nome..." value={inputValue} onChange={handleChange} />
            </div>
        </div>
    );
};