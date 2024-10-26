import React, { useState, useEffect, useRef } from 'react';
import style from "./style.module.css";
import { MensagemLog } from "Types/classes.tsx";
import { LoggerHelper } from 'Types/classes_estaticas.tsx';

const Log = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [logMensagens, setLogMensagens] = useState<MensagemLog[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Estado para armazenar as dimensões redimensionadas
    const [dimensions, setDimensions] = useState({ width: '14vw', height: '30vh' });

    const toggleExpand = () => {
        setIsExpanded(prevState => !prevState);
    };

    const handleResize = (event: React.MouseEvent<HTMLDivElement>, direction: string) => {
        event.preventDefault();
        const initialWidth = logContainerRef.current?.offsetWidth || 0;
        const initialHeight = logContainerRef.current?.offsetHeight || 0;
        const startX = event.clientX;
        const startY = event.clientY;

        const onMouseMove = (moveEvent: MouseEvent) => {
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            // Calcula a nova largura e altura com base na direção do redimensionamento
            if (direction.includes('right')) {
                newWidth = initialWidth + (moveEvent.clientX - startX);
            } else if (direction.includes('left')) {
                newWidth = initialWidth - (moveEvent.clientX - startX);
            }

            if (direction.includes('bottom')) {
                newHeight = initialHeight + (moveEvent.clientY - startY);
            } else if (direction.includes('top')) {
                newHeight = initialHeight - (moveEvent.clientY - startY);
            }

            setDimensions({
                width: `${newWidth}px`,
                height: `${newHeight}px`
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    useEffect(() => {
        const logger = LoggerHelper.getInstance();
        const atualizaMensagens = (messages: MensagemLog[]) => { setLogMensagens([...messages]); };
        logger.addListener(atualizaMensagens);

        return () => { logger.removeListener(atualizaMensagens); };
    }, []);

    return (
        <div className={`${style.collapsible_log} ${isExpanded ? style.expanded : style.collapsed}`} style={{ width: isExpanded ? dimensions.width : '14vw', height: isExpanded ? dimensions.height : 'auto' }} ref={logContainerRef}>
            <div className={`${style.resize_handle} ${style.top_left}`} onMouseDown={(e) => handleResize(e, 'top_left')} />
            <div className={`${style.resize_handle} ${style.top}`} onMouseDown={(e) => handleResize(e, 'top')} />
            <div className={`${style.resize_handle} ${style.top_right}`} onMouseDown={(e) => handleResize(e, 'top_right')} />
            <div className={`${style.resize_handle} ${style.right}`} onMouseDown={(e) => handleResize(e, 'right')} />
            <div className={`${style.resize_handle} ${style.bottom_right}`} onMouseDown={(e) => handleResize(e, 'bottom_right')} />
            <div className={`${style.resize_handle} ${style.bottom}`} onMouseDown={(e) => handleResize(e, 'bottom')} />
            <div className={`${style.resize_handle} ${style.bottom_left}`} onMouseDown={(e) => handleResize(e, 'bottom_left')} />
            <div className={`${style.resize_handle} ${style.left}`} onMouseDown={(e) => handleResize(e, 'left')} />

            <div className={style.toolbar} onClick={toggleExpand}>
                {isExpanded ? 'Fechar Histórico' : 'Abrir Histórico'}
            </div>

            {isExpanded && (
                <div className={style.conteudo_log}>
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