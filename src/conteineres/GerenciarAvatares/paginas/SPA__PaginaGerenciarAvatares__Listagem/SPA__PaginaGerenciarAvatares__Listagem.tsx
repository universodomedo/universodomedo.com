import styles from './styles.module.css';

import { PathTokenPadrao, pluralize, VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { useContextoGerenciarAvatares__Listagem } from 'Contextos/ContextoGerenciarAvatares__Listagem/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function SPA__PaginaGerenciarAvatares__Listagem() {
    const { personagens } = useContextoGerenciarAvatares__Listagem();

    return (
        <div className={styles.recipiente_listagem_personagens_e_seus_avatares}>
            {personagens.map(personagem => <RegistroPersonagemESeusAvatares key={personagem.id} personagem={personagem} />)}
        </div>
    );
};

function RegistroPersonagemESeusAvatares({ personagem }: { personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto }) {
    const { selecionaPersonagem } = useContextoGerenciarAvatares__Listagem();
    
    return (
        <DivClicavel className={styles.recipiente_registro_personagem_e_seus_avatares} onClick={() => selecionaPersonagem(personagem.id)}>
            <div className={styles.recipiente_imagem_avatar}>
                <RecipienteImagem src={personagem.avatares.caminhosAvatares.length > 1 ? personagem.avatares.caminhosAvatares.at(-1) : PathTokenPadrao} />
            </div>

            <h4>{personagem.nome}</h4>
            <h5>{`${personagem.avatares.caminhosAvatares.length} ${pluralize(personagem.avatares.caminhosAvatares.length, 'avatar', 'avatares')}`}</h5>
        </DivClicavel>
    );
};