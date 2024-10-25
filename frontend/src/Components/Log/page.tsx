// #region Imports
import style from "./style.module.css";
import { useState, useEffect, useRef } from 'react';
import { MensagemLog } from "Types/classes.tsx";
import { LoggerHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const Log = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [logMensagens, setLogMensagens] = useState<MensagemLog[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const atualizaScrollParaBaixo = () => {
        if (isExpanded && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }

    const toggleExpand = () => {
        setIsExpanded(prevState => !prevState);
    };

    useEffect(() => {
        const logger = LoggerHelper.getInstance();
        const atualizaMensagens = (messages: MensagemLog[]) => { setLogMensagens([...messages]); };
        logger.addListener(atualizaMensagens);

        return () => { logger.removeListener(atualizaMensagens); };
    }, []);

    useEffect(() => {
        atualizaScrollParaBaixo();
    }, [isExpanded, logMensagens]);

    return (
        <div className={`${style.collapsible_log} ${isExpanded ? style.expanded : style.collapsed}`}>
            <div className={style.toolbar} onClick={toggleExpand}>
                {isExpanded ? 'Fechar Histórico' : 'Abrir Histórico'}
            </div>

            {isExpanded && (
                <div ref={logContainerRef} className={style.conteudo_log}>
                    {logMensagens.length > 0 ? (
                        <>
                            {logMensagens.slice().reverse().map((logMensagem, logIndex) => (
                                <ComponenteMensagemLog key={logIndex} mensagemLog={logMensagem} nivel={0} />
                            ))}
                        </>
                    ) : (
                        'Nenhuma Mensagem'
                    )}
                </div>
            )}
        </div>
    );
};

const ComponenteMensagemLog: React.FC<{ mensagemLog: string | MensagemLog, nivel: number }> = ({ mensagemLog, nivel }) => {
    const indentStyle = { marginLeft: `${nivel * 4}%`, };

    return (
        <div className={style.conteudo_mensagem_log} style={indentStyle}>
            {typeof mensagemLog === 'string' ? (
                <span>{mensagemLog}</span>
            ) : mensagemLog.mensagens && mensagemLog.mensagens.length > 0 ? (
                <details>
                    <summary>{mensagemLog.titulo}</summary>
                    <ul>
                        {mensagemLog.mensagens.map((mensagem, index) => (
                            <li key={index}>
                                <ComponenteMensagemLog mensagemLog={mensagem} nivel={nivel + 1} />
                            </li>
                        ))}
                    </ul>
                </details>
            ) : (
                <span>{mensagemLog.titulo}</span>
            )}
        </div>
    );
};

export default Log;