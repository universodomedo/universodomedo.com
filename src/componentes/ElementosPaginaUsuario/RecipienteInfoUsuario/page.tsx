'use client';

import DescricaoPerfilUsuario from '../DescricaoPerfilUsuario/page';
import styles from './styles.module.css';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';

export default function RecipienteInfoUsuario() {

    const { usuarioLogado } = useContextoAutenticacao();

    if (!usuarioLogado) return;

    return (
        <>
            <div className={styles.recipiente_informacoes_usuario}>

                <h1>{usuarioLogado.username}</h1>
                <div className={styles.divisoria_usuario} />
                
                <DescricaoPerfilUsuario />
            
            </div>

            <div className={styles.recipiente_status_usuario}>

                <div className={styles.historico_usuario}>
                    <div className={styles.celula_desde}>
                        <p>Desde:</p>
                        <p style={{ color: '#ABA9A1' }}>12 de Março de 2023</p>
                    </div>

                    <div className={styles.celula_ultimo_acesso}>
                        <p>Último Acesso:</p>
                        <div className={styles.status_usuario}>
                            <div className={styles.status_icone}>
                            </div>
                            <p style={{ color: '#97CD61' }}>Online</p>
                        </div>
                    </div>

                    <div className={styles.celula_regiao}>
                        <p>Região</p>
                        <p style={{ color: '#ABA9A1' }}>Rio de Janeiro</p>
                    </div>
                </div>

                <div className={styles.sobre_usuario}>
                    <div className={styles.celula_sobre}>
                        <p>Sobre</p>
                    </div>
                    <div className={styles.celula_sobre_info}>
                        <p style={{ color: '#ABA9A1' }}>Este delícia jogou com você em alguma aventura que já não lembro.</p>
                    </div>
                </div>

            </div>
        </>
    );
}