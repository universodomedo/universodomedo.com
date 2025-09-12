import styles from '../styles.module.css';

import cn from 'classnames';
import { MensagemChatRecebida, SOCKET_UsuarioExistente } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function AgrupamentoMensagensChat({ usuario, grupo }: { usuario: SOCKET_UsuarioExistente; grupo: MensagemChatRecebida[] }) {
    const { usuarioLogado } = useContextoAutenticacao();

    return (
        <div className={cn(styles.agrupamento_mensagens, usuario.id === usuarioLogado?.id && styles.agrupamento_mensagem_sua)}>
            <div className={styles.container_avatar_agrupamento_mensagem}>
                <div className={styles.recipiente_avatar_agrupamento_mensagem}>
                    <RecipienteImagem src={usuario.avatar} />
                </div>
            </div>
            <div className={styles.recipiente_lista_mensagens_agrupadas}>
                {grupo.map((msg, indexMensagemNoAgrupamento) => (
                    <div key={indexMensagemNoAgrupamento} className={styles.item_mensagens_agrupadas}>
                        {indexMensagemNoAgrupamento === 0 && (
                            <h4>{usuario.username}</h4>
                        )}
                        <div>
                            <p>{msg.conteudo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};