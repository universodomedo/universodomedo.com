import styles from './styles.module.css';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto.tsx';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

import { InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link';

const JanelaNotificacao = forwardRef((props, ref) => {
    const { ganhos } = useContextoEdicaoFicha();
    const [isOpen, setIsOpen] = useState(false);
    const { scrollableProps } = useScrollable();
    const toggleConsole = () => setIsOpen(!isOpen);

    const openConsole = () => setIsOpen(true);

    useImperativeHandle(ref, () => ({
        openConsole,
    }));

    if (!ganhos.etapaAtual) return;

    return (
        <div className={`${styles.janela_avisos} ${!isOpen ? styles.fechado : ''}`}>
            <button onClick={toggleConsole} className={`${styles.janela_avisos_botao} ${!ganhos.podeAvancarEtapa ? styles.janela_avisos_botao_vermelho : ''}`}>
                <InfoCircledIcon />
            </button>
            <div className={styles.janela_avisos_conteudo}>
                {ganhos.etapaAtual.hrefDefinicaoEtapa ? (
                    <Link href={ganhos.etapaAtual.hrefDefinicaoEtapa} target={'_blank'}><h1>{ganhos.etapaAtual.tituloEtapa}</h1></Link>
                ) : (
                    <h1>{ganhos.etapaAtual.tituloEtapa}</h1>
                )}
                {ganhos.etapaAtual.avisosGanhoEvolucao.length > 0 && (
                    <div className={styles.mensagens_janela_avisos} {...scrollableProps}>
                        {ganhos.etapaAtual.avisosGanhoEvolucao.map((msg, index) => (
                            <div key={index} className={styles.mensagem_notificacao}>
                                <div className={styles.icone_notificacao}>{msg.icone}</div>
                                <p className={`${msg.tipo === 'subitem' ? styles.mensagem_notificacao_subitem : ''}`}>{`${msg.mensagem}`}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default JanelaNotificacao;