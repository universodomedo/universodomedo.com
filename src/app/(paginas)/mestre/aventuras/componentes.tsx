'use client';

import { useMemo } from 'react';

// import { useAtualizaConteudoGeral } from 'Contextos/ContextoLayoutVisualizacaoPadrao/hooks';
import { AventurasMestre_ConteudoGeral } from './subcomponentes';

export function AventurasMestre_Contexto() {
    return ( <></>
        // <ContextoLayoutVisualizacaoPadraoProvider>
        //     <PaginaAventuras_LayoutVisualizacao />
        // </ContextoLayoutVisualizacaoPadraoProvider>
    );
};

export function PaginaAventuras_LayoutVisualizacao() {
    // useAtualizaConteudoGeral(useMemo(() => <AventurasMestre_ConteudoGeral />, []));

    // return <LayoutContextualizado />;

    return null;

    // return (
    //     <>
    //         <h1>Minhas Aventuras</h1>

    //         <OpcoesBuscaAventuras />

    //         <div id={styles.recipiente_aventuras_mestre} {...scrollableProps}>
    //             {aventurasFiltradas!.map(grupo => (
    //                 <Link key={grupo.id} className={styles.recipiente_item_imagem_aventura_mestre} href={`/mestre/aventura/${grupo.id}`}>
    //                     <div className={styles.recipiente_imagem_aventura_mestre}>
    //                         <RecipienteImagem src={grupo.aventura.imagemCapa?.fullPath} />
    //                     </div>
    //                     <h4>{grupo.nomeUnicoGrupoAventura}</h4>
    //                 </Link>
    //             ))}
    //         </div>
    //     </>
    // );
};