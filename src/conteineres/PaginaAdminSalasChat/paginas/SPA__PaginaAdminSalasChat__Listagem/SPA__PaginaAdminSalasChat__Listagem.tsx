import styles from './styles.module.css';

import classNames from 'classnames';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContexto__PaginaAdminSalasChat__Listagem } from 'Contextos/Contexto__PaginaAdminSalasChat__Listagem/contexto';
import type { RegistroSalaChat } from 'Contextos/Contexto__PaginaAdminSalasChat/contexto';

export default function SPA__PaginaAdminSalasChat__Listagem() {
    const ctx = useContexto__PaginaAdminSalasChat__Listagem();

    return (
        <div className={styles.recipiente}>
            <ListagemComposta
                listagem={ctx.listagemSalas}
                modoExibicao={ListagemCompostaModoExibicao.GRADE}
                itensPorLinha={4}
                obterIdRegistro={sala => sala.id}
                renderizarItem={sala => <CartaoSala sala={sala} aoEditar={ctx.editarSala} />}
                novoRegistro={{ estaEmProcessoCriacao: ctx.estaEmCriacaoSala, aoIniciarCriacao: ctx.iniciarCriacaoSala, textoBotao: 'Nova Sala' }}
            />
        </div>
    );
};

function CartaoSala({ sala, aoEditar }: { sala: RegistroSalaChat; aoEditar: (sala: RegistroSalaChat) => void; }) {
    return (
        <DivClicavel className={classNames(styles.cartao, { [styles.trancada]: sala.estado === 'TRANCADA' })} onClick={() => aoEditar(sala)}>
            <strong className={styles.nome}>{sala.nome}</strong>
            <span className={styles.detalhe}>{descrevePoliticas(sala)}</span>
            <span className={styles.badge}>{sala.estado === 'TRANCADA' ? 'Trancada' : 'Aberta'}</span>
        </DivClicavel>
    );
};

function descrevePoliticas(sala: RegistroSalaChat): string {
    if (sala.escritaPublica) return 'Leitura e escrita públicas';
    if (sala.leituraPublica) return 'Leitura pública, escrita restrita';
    return 'Acesso restrito';
};
