import styles from './styles.module.css';

import Image from "next/image";

export default function Contato() {
// export default function Contato({ PropsContato }: { PropsContato: { nomeUsuario: string, descricao: string, caminhoImagem: string } }) {
    return (
        <div className={styles.recipiente_contato}>
            <div className={styles.recipiente_imagem_contato}>
                <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>Usuário n2</h2>
                <span>Em Sessão</span>
            </div>
        </div>
    );
};