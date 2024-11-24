// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import { InfoCircledIcon, CheckIcon } from '@radix-ui/react-icons'
// #endregion

const JanelaAvisos = () => {
    const { ganhosNex } = useFicha();
    const [isOpen, setIsOpen] = useState(false);
    const toggleConsole = () => setIsOpen(!isOpen);

    return (
        <div className={`${style.janela_avisos} ${!isOpen ? style.fechado : ''}`}>
            <button onClick={toggleConsole} className={style.janela_avisos_botao}>
                <InfoCircledIcon width={'100%'} height={'100%'} />
            </button>
            <div className={style.janela_avisos_conteudo}>
                <h1>{ganhosNex.etapa.tituloEtapa}</h1>
                {ganhosNex.etapa.mensagensEtapa.length > 0 && (
                    <div className={style.mensagens_janela_avisos}>
                        {ganhosNex.etapa.mensagensEtapa.map((msg, index) => (
                            <div className={style.mensagem_notificacao}>
                                <CheckIcon />
                                <p key={index}>{`${msg}`}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JanelaAvisos;