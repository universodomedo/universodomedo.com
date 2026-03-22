import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import LinkInterno from '../LinkInterno/LinkInterno';
import RecipienteAviso from 'Componentes/ElementosVisuais/RecipienteAviso/RecipienteAviso';

export function AvisosDePersonagensEFichas({ naoRenderizaAvisoFichaTemporaria, naoRenderizaAvisoPersonagem, naoRenderizaLinkFicha }: { naoRenderizaAvisoFichaTemporaria?: true; naoRenderizaAvisoPersonagem?: true; naoRenderizaLinkFicha?: true }) {
    return (
        <div className={styles.recipiente_chaves_criacao_personagem}>
            {!naoRenderizaAvisoFichaTemporaria && <ConteudoAvisoFichaTemporaria naoRenderizaLink={naoRenderizaLinkFicha} />}
            {!naoRenderizaAvisoPersonagem && <ConteudoAvisoPersonagemTemporario />}
        </div>
    );
};

function ConteudoAvisoFichaTemporaria({ naoRenderizaLink }: { naoRenderizaLink?: true }) {
    return (
        <RecipienteAviso tipo={'positivo'}>
            {!naoRenderizaLink && <LinkInterno destino={PAGINAS.fichas}><h2>Fichas Temporárias</h2></LinkInterno>}

            <p>Usando os Rituais e Habilidades que você desbloqueou, crie sua Ficha para participar de Missões Individuais e Sessões Únicas!</p>
        </RecipienteAviso>
    )
};

function ConteudoAvisoPersonagemTemporario() {
    return (
        <RecipienteAviso tipo={'negativo'}>
            <LinkInterno destino={PAGINAS.minhasPaginas.jogador.criar.personagem}><h2>Criando Personagem</h2></LinkInterno>

            <p>Nenhuma Chave de Criação Disponível!</p>
            <p>Quando você for convidado para uma Aventura, você receberá uma Chave de Criação de Personagem</p>
        </RecipienteAviso>
    );
};