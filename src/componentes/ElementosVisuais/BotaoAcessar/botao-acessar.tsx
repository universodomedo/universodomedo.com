import styles from './styles.module.css';

import { PAGINAS, UsuarioParaObjetoAutenticacaoDto } from 'types-nora-api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import useLogout from 'Hooks/useLogout';
import PersonagemEmVisualizacaoDeSessao from '../ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

export default function ComponenteBotaoAcessar() {
    const { usuarioLogado, estaAutenticado } = useContextoAutenticacao();

    return (
        <div className={styles.recipiente_svg_botao_acesso}>
            <RecipienteArquivoInterno arquivo={"PAGINA_ATERRISSAGEM__BOTAO_ACESSAR__BORDA"} className={styles.camada_1} />
            {estaAutenticado ? <ComponenteBotaoAcessar_Autenticado usuario={usuarioLogado!} /> : <ComponenteBotaoAcessar_NaoAutenticado />}
        </div>
    );
};

function ComponenteBotaoAcessar_Autenticado({ usuario }: { usuario: UsuarioParaObjetoAutenticacaoDto }) {
    const { logout } = useLogout();

    return (
        <>
            <div className={styles.avatar_usuario_logado}>
                <PersonagemEmVisualizacaoDeSessao tipo={'mestre'} usuario={usuario} />
            </div>
            <DivClicavel className={styles.recepiente_icone_desconectar} onClick={logout}>
                <FontAwesomeIcon className={styles.botao_acesso_discord} icon={faDoorOpen} />
            </DivClicavel>
        </>
    );
};

function ComponenteBotaoAcessar_NaoAutenticado() {
    const { estaAutenticado } = useContextoAutenticacao();

    return (
        <>
            <LinkInterno className={styles.link_botao_acesso} destino={estaAutenticado ? PAGINAS.minhaPagina : PAGINAS.acessar}>
                <RecipienteArquivoInterno arquivo={"PAGINA_ATERRISSAGEM__BOTAO_ACESSAR__FUNDO"} className={styles.camada_2} />
            </LinkInterno>
            <RecipienteArquivoInterno arquivo={"PAGINA_ATERRISSAGEM__BOTAO_ACESSAR__TEXTO"} className={styles.camada_3} />
        </>
    );
};