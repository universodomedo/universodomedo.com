'use client';

import Uploader from 'Componentes/Elementos/Inputs/Uploader/Uploader';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

export function PaginaArtista_AdicionarImagem_Contexto() {
    useConfigurarLayoutContextualizado({ titulo: 'Adicionar Imagem' }, 'patch');
    
    return (
        <Uploader />
    );
};