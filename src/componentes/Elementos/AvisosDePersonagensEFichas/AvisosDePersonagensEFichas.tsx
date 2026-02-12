import { PAGINAS } from 'types-nora-api';
import LinkInterno from '../LinkInterno/LinkInterno';
import styles from './styles.module.css';

import RecipienteAviso from 'Componentes/ElementosVisuais/RecipienteAviso/RecipienteAviso';

export function AvisosDePersonagensEFichas({ naoRenderizaAvisoFichaTemporaria, naoRenderizaAvisoPersonagem }: { naoRenderizaAvisoFichaTemporaria?: boolean; naoRenderizaAvisoPersonagem?: boolean }) {
    return (
        <div className={styles.recipiente_chaves_criacao_personagem}>
            {!naoRenderizaAvisoFichaTemporaria && <ConteudoAvisoFichaTemporaria />}
            {!naoRenderizaAvisoPersonagem && <ConteudoAvisoPersonagemTemporario />}
        </div>
    );
};

function ConteudoAvisoFichaTemporaria() {
    const jaTemFichaTemporario = false;

    if (!jaTemFichaTemporario) return (
        <RecipienteAviso tipo={'positivo'}>
            <h2>Fichas Temporárias</h2>

            <p>Usando Rituais e Habilidades desbloqueadas, crie uma Ficha para participar de Missões Individuais ou guardar rascunhos de Personagens!</p>
            <LinkInterno destino={PAGINAS.minhasPaginas.jogador.criar.ficha}><h2>Criar</h2></LinkInterno>
            {/* <button onClick={() => console.log(`teste`)}>Criar</button> */}
        </RecipienteAviso>
    );

    return (
        <RecipienteAviso tipo={'negativo'}>
            <h2>Fichas Temporárias</h2>

            <p>Crie uma nova Ficha Temporária</p>
            <button onClick={() => console.log(`teste`)}>Criar</button>
        </RecipienteAviso>
    );
};

function ConteudoAvisoPersonagemTemporario() {
    return (
        <RecipienteAviso tipo={'negativo'}>
            <h2>Criando Personagem</h2>

            <p>Nenhuma Chave de Criação Disponível!</p>
            <p>Quando você for convidado para uma Sessão Única ou Aventura, você receberá uma Chave de Criação de Personagem</p>
        </RecipienteAviso>
    );
};