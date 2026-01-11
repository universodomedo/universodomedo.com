import styles from './styles.module.css';

import { type ItemPermissaoDto } from 'types-nora-api';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import PermissoesModoArvore from 'Componentes/ElementosVisuais/Permissoes/ModoArvore/componentes';

export function JanelaArvorePermissoes({ arvore, onFocoItem, getAcessoLeaf }: { arvore: ItemPermissaoDto[]; onFocoItem: (idItem: number) => void; getAcessoLeaf?: (item: ItemPermissaoDto) => boolean; }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div className={styles.recipiente_janela_lista} {...scrollableProps}>
            <div className={styles.janela_lista}>
                <PermissoesModoArvore arvore={arvore} onFocoItem={onFocoItem} getAcessoLeaf={getAcessoLeaf} />
            </div>
        </div>
    );
};