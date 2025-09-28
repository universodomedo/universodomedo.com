'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import Link from 'next/link';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { GrupoAventuraDto } from 'types-nora-api';
import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';

export function AventurasMestre_ConteudoGeral() {
    const { gruposAventurasListadas } = useContextoMestreAventuras();

    return (
        <div id={styles.recipiente_aventuras_mestre}>
            {gruposAventurasListadas!.map(grupo => (
                <Link key={grupo.id} className={styles.recipiente_item_imagem_aventura_mestre} href={`/minhas-paginas/mestre/aventura/${grupo.id}`}>
                    <div className={styles.recipiente_imagem_aventura_mestre}>
                        <RecipienteImagem src={grupo.aventura.imagemCapa?.fullPath} />
                    </div>
                    <h4>{grupo.nomeUnicoGrupoAventura}</h4>
                </Link>
            ))}
        </div>
    );
};