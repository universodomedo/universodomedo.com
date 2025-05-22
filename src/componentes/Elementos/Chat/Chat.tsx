import styles from './styles.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

export default function Chat() {
    return (
        <div id={styles.recipiente_chat}>
            <div id={styles.recipiente_icone_chat}>
                <FontAwesomeIcon icon={faMessage} />
            </div>
            <div id={styles.recipiente_campo_texto_chat}>
                <input placeholder={'Enviar mensagem..'} autoComplete={'off'} />
            </div>
        </div>
    );
};