'use client';

import { useRef, useState, type DragEvent } from 'react';
import cn from 'classnames';
import { type PalcoParticipanteDto, type PalcoParticipantePapel } from 'types-nora-api';

import styles from './styles.module.css';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaPalcoEntrar } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';
import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';
import FluxoDeMusica from 'Componentes/ElementosDeMusica/FluxoDeMusica/FluxoDeMusica';
import CartaoParticipantePalco from 'Componentes/ElementosDePalco/CartaoParticipantePalco/CartaoParticipantePalco';
import PainelTranscricaoPalco from 'Componentes/ElementosDePalco/PainelTranscricaoPalco/PainelTranscricaoPalco';
import PainelDiagnosticoAudio from './PainelDiagnosticoAudio';

type SecaoAlvo = PalcoParticipantePapel | null;

const ROTULOS: Record<PalcoParticipantePapel, string> = {
    falante: 'Participando',
    ouvinte: 'Assistindo',
    aguardando: 'Em Espera',
};

const DESCRICOES: Record<PalcoParticipantePapel, string> = {
    falante: 'Falam e ouvem',
    ouvinte: 'Ouvem apenas',
    aguardando: 'Aguardando entrada',
};

const ORDEM_SECOES: PalcoParticipantePapel[] = ['falante', 'ouvinte', 'aguardando'];

// Painel de quem COMANDA o palco (dono ou responsável): arrasta participantes entre papéis, finaliza e acompanha diagnóstico/transcrição.
export default function SPA__PaginaPalco__Admin() {
    const { estado, fluxoMusica, diagnostico, transcricao, processando, erroComando, handleDefinirPapel, handleFinalizar, compartilharLinkPalco, handleFluxoAdicionarMusica, handleFluxoRemoverMusica, handleFluxoMoverMusica, handleFluxoCriarLigacao, handleFluxoAlternarLigacao, handleFluxoMoverPulso, handleFluxoSilenciar } = useContexto__PaginaPalcoEntrar();
    const idArrastando = useRef<number | null>(null);
    const [secaoAlvo, setSecaoAlvo] = useState<SecaoAlvo>(null);
    const [selecionandoMusica, setSelecionandoMusica] = useState(false);
    const palcoAtivo = estado?.ativo ?? false;

    const participantesPorPapel = (papel: PalcoParticipantePapel): PalcoParticipanteDto[] => estado?.participantes.filter(p => p.papel === papel) ?? [];
    const handleDragStart = (idUsuario: number): void => { idArrastando.current = idUsuario; };
    const handleDragEnd = (): void => { idArrastando.current = null; setSecaoAlvo(null); };
    const handleDragOver = (e: DragEvent, papel: PalcoParticipantePapel): void => { e.preventDefault(); setSecaoAlvo(papel); };
    const handleDragLeave = (): void => { setSecaoAlvo(null); };
    const handleDrop = (e: DragEvent, papelDestino: PalcoParticipantePapel): void => {
        e.preventDefault();
        setSecaoAlvo(null);
        const id = idArrastando.current;
        if (id === null) return;
        idArrastando.current = null;
        handleDefinirPapel(id, papelDestino);
    };

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.pagina}>
                    <div className={styles.cabecalho}>
                        <h1 className={styles.titulo}>Comando do Palco{estado ? ` · ${estado.nome || estado.nomeDono}` : ''}</h1>
                        <span className={cn(styles.indicador_status, palcoAtivo && styles.indicador_status_ativo)}>{palcoAtivo ? '● Palco Ativo' : '○ Palco Finalizado'}</span>
                    </div>
                    {erroComando && <p className={styles.erro}>{erroComando}</p>}
                    {palcoAtivo && (
                        <div className={styles.secoes}>
                            {ORDEM_SECOES.map(papel => {
                                const participantes = participantesPorPapel(papel);
                                return (
                                    <section key={papel} onDragOver={e => { handleDragOver(e, papel); }} onDragLeave={handleDragLeave} onDrop={e => { handleDrop(e, papel); }} className={cn(styles.secao, secaoAlvo === papel && styles.secao_alvo)}>
                                        <div className={styles.secao_cabecalho}>
                                            <h2 className={styles.secao_titulo}>{ROTULOS[papel]}</h2>
                                            <span className={styles.secao_contador}>({participantes.length})</span>
                                            <span className={styles.secao_descricao}>— {DESCRICOES[papel]}</span>
                                        </div>
                                        {participantes.length === 0
                                            ? <p className={styles.vazio}>Ninguém aqui</p>
                                            : <div className={styles.participantes}>{participantes.map(p => <CartaoParticipantePalco key={p.idUsuario} participante={p} processando={processando} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />)}</div>
                                        }
                                    </section>
                                );
                            })}
                        </div>
                    )}
                    {!palcoAtivo && <p className={styles.palco_fechado}>Este palco foi finalizado. O histórico do chat segue disponível no painel de chat.</p>}
                    {palcoAtivo && (
                        <section className={cn(styles.secao, styles.secao_musica)}>
                            <div className={styles.secao_cabecalho}>
                                <h2 className={styles.secao_titulo}>Fluxo de Música</h2>
                                <span className={styles.secao_descricao}>— o pulso mostra o que todos estão ouvindo; ligações decidem o caminho</span>
                            </div>
                            {selecionandoMusica
                                ? <div className={styles.selecionador_musica}><Componente_Selecionador__MusicaDeFundo aoConfirmar={idMusica => { handleFluxoAdicionarMusica(idMusica, 60 + fluxoMusica.musicas.length * 90, 40 + fluxoMusica.musicas.length * 60); setSelecionandoMusica(false); }} aoCancelar={() => { setSelecionandoMusica(false); }} /></div>
                                : <FluxoDeMusica fluxo={fluxoMusica} processando={processando} aoTrazerMusica={() => { setSelecionandoMusica(true); }} aoRemoverMusica={handleFluxoRemoverMusica} aoMoverMusica={handleFluxoMoverMusica} aoCriarLigacao={handleFluxoCriarLigacao} aoAlternarLigacao={handleFluxoAlternarLigacao} aoMoverPulso={handleFluxoMoverPulso} aoSilenciar={handleFluxoSilenciar} />
                            }
                        </section>
                    )}
                    {palcoAtivo && <div className={styles.transcricao}><PainelTranscricaoPalco utterances={transcricao} /></div>}
                    {palcoAtivo && <PainelDiagnosticoAudio diagnostico={diagnostico} />}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                {palcoAtivo && <button type="button" data-variante="secundario" onClick={compartilharLinkPalco}>Compartilhar link do palco</button>}
                <button type="button" data-variante="perigo" onClick={handleFinalizar} disabled={processando || !palcoAtivo}>{processando ? 'Aguarde...' : 'Finalizar Palco'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};