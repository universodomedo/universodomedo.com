import styles from './styles.module.css';

import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo } from 'Contextos/Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo/contexto';
import type { DesafioResumo } from 'types-nora-api';

export default function SPA__PaginaGameDesignerDesafios__DesafiosDoTipo() {
    const { grupo } = useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo();

    // Página de GESTÃO do Desafio: publicar/ordenar na categoria. Nome/descrição vêm da Partida (a criação/edição acontece na Configuração de Partida).
    return (
        <section className={styles.pagina}>
            <ListagemComposta
                listagem={{ registros: grupo.desafios, carregando: null, erro: null, mensagemListaVazia: 'Nenhum Desafio neste tipo.' }}
                modoExibicao={ListagemCompostaModoExibicao.LINHA}
                obterIdRegistro={desafio => desafio.id}
                renderizarItem={desafio => <RegistroDesafio desafio={desafio} />}
            />
        </section>
    );
};

function RegistroDesafio({ desafio }: { desafio: DesafioResumo; }) {
    const { salvando, alternarAtivoDesafio } = useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo();

    return (
        <article className={styles.registro_desafio}>
            <div className={styles.dados_desafio}>
                <strong>{desafio.nome}</strong>
                <span>Ordem {desafio.ordem}</span>
            </div>
            <AlternaOpcao opcao={desafio.ativo} onChange={ativo => void alternarAtivoDesafio(desafio, ativo)} desabilitado={salvando} />
        </article>
    );
};