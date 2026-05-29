'use client';

import { type PalcoParticipanteDto } from 'types-nora-api';

import styles from './styles.module.css';
import { useContexto__PaginaPalcoEntrar } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';
import CartaoParticipantePalco from 'Componentes/ElementosDePalco/CartaoParticipantePalco/CartaoParticipantePalco';

export default function SPA__PaginaPalco__Participante() {
    const { entrando, conectado, meuPapel, estado } = useContexto__PaginaPalcoEntrar();
    const palcoAtivo = estado?.ativo ?? false;
    const emEspera = !conectado || meuPapel === 'aguardando' || entrando;
    const falantes: PalcoParticipanteDto[] = estado?.participantes.filter(p => p.papel === 'falante') ?? [];
    const ouvintes: PalcoParticipanteDto[] = estado?.participantes.filter(p => p.papel === 'ouvinte') ?? [];

    return (
        <main className={styles.pagina}>
            {!palcoAtivo && <p className={styles.mensagem}>O Palco não está aberto agora.</p>}
            {palcoAtivo && emEspera && <p className={styles.mensagem}>Aguardando entrar no Palco...</p>}
            {palcoAtivo && !emEspera && (
                <>
                    {meuPapel && <p className={styles.meu_papel}>{meuPapel === 'falante' ? 'Você está participando — fala e ouve' : 'Você está assistindo — apenas ouve'}</p>}
                    <div className={styles.secoes}>
                        <section className={styles.secao}>
                            <div className={styles.secao_cabecalho}>
                                <h2 className={styles.secao_titulo}>Participando</h2>
                                <span className={styles.secao_contador}>({falantes.length})</span>
                            </div>
                            {falantes.length === 0
                                ? <p className={styles.vazio}>Ninguém participando no momento.</p>
                                : <div className={styles.participantes}>{falantes.map(p => <CartaoParticipantePalco key={p.idUsuario} participante={p} />)}</div>
                            }
                        </section>
                        <section className={styles.secao}>
                            <div className={styles.secao_cabecalho}>
                                <h2 className={styles.secao_titulo}>Assistindo</h2>
                                <span className={styles.secao_contador}>({ouvintes.length})</span>
                            </div>
                            {ouvintes.length === 0
                                ? <p className={styles.vazio}>Ninguém assistindo no momento.</p>
                                : <div className={styles.participantes}>{ouvintes.map(p => <CartaoParticipantePalco key={p.idUsuario} participante={p} />)}</div>
                            }
                        </section>
                    </div>
                </>
            )}
        </main>
    );
};