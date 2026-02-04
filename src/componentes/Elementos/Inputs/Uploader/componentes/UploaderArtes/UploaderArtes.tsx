'use client';

import { CAPACIDADES } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

import Uploader from '../../Uploader';
import RecipienteAviso from 'Componentes/ElementosVisuais/RecipienteAviso/RecipienteAviso';

export default function UploaderArtes() {
    const { verificarCapacidade } = useContextoAutenticacao();

    const precisa_aprovar = !verificarCapacidade(CAPACIDADES.ARTISTA__CRIACAO__NAO_PRECISA_APROVACAO);

    return (
        <>
            <Uploader />

            <RecipienteAviso tipo={precisa_aprovar ? 'negativo' : 'positivo'}>
                <h2>ATENÇÃO</h2>

                <p>
                    {precisa_aprovar
                        ? 'Sua imagem vai precisar ser aprovada por um moderador'
                        : 'Sua imagem será aprovada automaticamente, então confira seu trabalho com atenção'
                    }
                </p>
            </RecipienteAviso>
        </>
    );
};