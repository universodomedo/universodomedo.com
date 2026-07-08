import styles from './styles.module.css';

import classNames from 'classnames';
import { pluralize } from 'types-nora-api';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContexto__PaginaAdminGestaoMenu__Listagem, type ResumoMenuGestao } from 'Contextos/Contexto__PaginaAdminGestaoMenu__Listagem/contexto';
import type { RegistroMenuGestao } from 'Contextos/Contexto__PaginaAdminGestaoMenu/contexto';

export default function SPA__PaginaAdminGestaoMenu__Listagem() {
    const { listagemMenus, resumoPorMenuId, estaEmCriacaoMenu, selecionarMenu, iniciarCriacaoMenu } = useContexto__PaginaAdminGestaoMenu__Listagem();

    return (
        <ListagemComposta
            listagem={listagemMenus}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={menu => menu.id}
            renderizarItem={menu => <CardMenu menu={menu} resumo={resumoPorMenuId.get(menu.id) ?? null} aoSelecionar={selecionarMenu} />}
            novoRegistro={{ estaEmProcessoCriacao: estaEmCriacaoMenu, aoIniciarCriacao: iniciarCriacaoMenu, textoBotao: 'Novo Menu' }}
        />
    );
};

function CardMenu({ menu, resumo, aoSelecionar }: { menu: RegistroMenuGestao; resumo: ResumoMenuGestao | null; aoSelecionar: (idMenu: number) => void; }) {
    const inativo = resumo !== null && !resumo.ativo;
    return (
        <DivClicavel className={classNames(styles.card_menu, { [styles.inativo]: inativo })} onClick={() => aoSelecionar(menu.id)}>
            <span className={styles.cabecalho_card}>
                <span className={styles.badge_tipo} data-principal={menu.tipo === 'principal'}>{menu.tipo}</span>
                {inativo && <span className={styles.badge_inativo}>inativo</span>}
            </span>
            <strong className={styles.chave}>{menu.chave}</strong>
            {menu.descricao !== null && menu.descricao.length > 0 && <span className={styles.descricao}>{menu.descricao}</span>}
            {resumo !== null && <span className={styles.resumo}>{resumo.itens} {pluralize(resumo.itens, 'item', 'itens')} · {resumo.grupos} {pluralize(resumo.grupos, 'grupo')}</span>}
        </DivClicavel>
    );
};
