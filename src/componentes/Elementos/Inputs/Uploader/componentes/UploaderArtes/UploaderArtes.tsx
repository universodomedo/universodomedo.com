'use client';

import styles from '../../styles.module.css';

import cn from 'classnames';
import { CAPACIDADES } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

import Uploader from '../../Uploader';

export default function UploaderArtes() {
    const { verificarCapacidade } = useContextoAutenticacao();

    const precisa_aprovar = !verificarCapacidade(CAPACIDADES.ARTISTA__CRIACAO__NAO_PRECISA_APROVACAO);

    return (
        <>
            <Uploader />

            <div className={cn(styles.caixa_aviso, precisa_aprovar ? styles.caixa_aviso_negativa : styles.caixa_aviso_positiva)}>
                <h2>ATENÇÃO</h2>

                <p>
                    {precisa_aprovar
                        ? 'Sua imagem vai precisar ser aprovada por um moderador'
                        : 'Sua imagem será aprovada automaticamente, então confira seu trabalho com atenção'
                    }
                </p>
            </div>
        </>
    );
};