import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorHabilidadesPericia__Listagem } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__Listagem/contexto';

type RegistroHabilidadePericia = ReturnType<typeof useContexto__PaginaModeradorHabilidadesPericia__Listagem>['listagemHabilidades']['registros'][number];

export default function SPA__PaginaModeradorHabilidadesPericia__Listagem() {
    const { listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade } = useContexto__PaginaModeradorHabilidadesPericia__Listagem();

    return (
        <ListagemComposta
            listagem={listagemHabilidades}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={habilidade => habilidade.id}
            renderizarItem={habilidade => <RenderizaRegistroHabilidade habilidade={habilidade} selecionaHabilidade={selecionaHabilidade} />}
            novoRegistro={{ estaEmProcessoCriacao, aoIniciarCriacao: iniciaCriacao, textoBotao: 'Nova habilidade' }}
        />
    );
};

function RenderizaRegistroHabilidade({ habilidade, selecionaHabilidade }: { habilidade: RegistroHabilidadePericia; selecionaHabilidade: (idHabilidade: number) => void; }) {
    return (
        <button type="button" className={styles.card_habilidade} onClick={() => selecionaHabilidade(habilidade.id)}>
            <strong>{habilidade.habilidade.nome}</strong>
            <span>{habilidade.habilidade.descricao}</span>
            <small>{habilidade.pericia.nome} / {habilidade.patentePericia.nome}</small>
        </button>
    );
};