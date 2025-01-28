// #region Imports
import style from './style.module.css';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';

import { InfoCircledIcon } from '@radix-ui/react-icons'
// #endregion

const JanelaNotificacao = forwardRef((props, ref) => {
    const { ganhosNex } = useContextoNexUp();
    const [isOpen, setIsOpen] = useState(false);
    const toggleConsole = () => setIsOpen(!isOpen);

    const openConsole = () => setIsOpen(true);

    useImperativeHandle(ref, () => ({
        openConsole,
    }));

    return (
        <div className={`${style.janela_avisos} ${!isOpen ? style.fechado : ''}`}>
            <button onClick={toggleConsole} className={`${style.janela_avisos_botao} ${!ganhosNex.podeAvancarEtapa ? style.janela_avisos_botao_vermelho : ''}`}>
                <InfoCircledIcon />
            </button>
            <div className={style.janela_avisos_conteudo}>
                <h1>{ganhosNex.etapa.tituloEtapa}</h1>
                {ganhosNex.etapa.avisoGanhoNex.length > 0 && (
                    <div className={style.mensagens_janela_avisos}>
                        {ganhosNex.etapa.avisoGanhoNex.map((msg, index) => (
                            <div key={index} className={style.mensagem_notificacao}>
                                <div className={style.icone_notificacao}>{msg.icone}</div>
                                <p>{`${msg.mensagem}`}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default JanelaNotificacao;