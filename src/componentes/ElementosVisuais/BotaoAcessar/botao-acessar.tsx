import styles from './styles.module.css';

import { PAGINAS, UsuarioDto } from 'types-nora-api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import useLogout from 'Hooks/useLogout';
import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import PersonagemEmVisualizacaoDeSessao from '../ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function ComponenteBotaoAcessar() {
    const { usuarioLogado, estaAutenticado } = useContextoAutenticacao();

    return (
        <div className={styles.recipiente_svg_botao_acesso}>
            {estaAutenticado ? <ComponenteBotaoAcessar_Autenticado usuario={usuarioLogado!} /> : <ComponenteBotaoAcessar_NaoAutenticado />}
        </div>
    );
};

function ComponenteBotaoAcessar_Autenticado({ usuario }: { usuario: UsuarioDto }) {
    const { logout } = useLogout();

    return (
        <>
            <ElementoSVG className={styles.camada_1} src={"/imagensFigma/luiz/Entalhe.svg"} />
            <div className={styles.avatar_usuario_logado}>
                <PersonagemEmVisualizacaoDeSessao tipo={'mestre'} usuario={usuario} />
            </div>
            <DivClicavel className={styles.recepiente_icone_desconectar} onClick={logout}>
                <FontAwesomeIcon className={styles.botao_acesso_discord} icon={faDoorOpen}/>
            </DivClicavel>
        </>
    );
};

function ComponenteBotaoAcessar_NaoAutenticado() {
    const { estaAutenticado } = useContextoAutenticacao();

    return (
        <>
            <ElementoSVG className={styles.camada_1} src={"/imagensFigma/luiz/Entalhe.svg"} />
            <LinkInterno className={styles.link_botao_acesso} destino={estaAutenticado ? PAGINAS.minhaPagina : PAGINAS.acessar}>
                <ElementoSVG className={styles.camada_2} src={"/imagensFigma/luiz/botao_acessar.svg"} />
            </LinkInterno>
            <ElementoSVG className={styles.camada_3} src={"/imagensFigma/luiz/acessar.svg"} />
        </>
    );
};