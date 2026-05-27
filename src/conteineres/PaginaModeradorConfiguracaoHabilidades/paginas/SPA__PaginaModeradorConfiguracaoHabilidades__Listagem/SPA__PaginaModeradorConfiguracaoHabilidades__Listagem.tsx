import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorConfiguracaoHabilidades__Listagem } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem/contexto';

type RegistroHabilidade = ReturnType<typeof useContexto__PaginaModeradorConfiguracaoHabilidades__Listagem>['listagemHabilidades']['registros'][number];

export default function SPA__PaginaModeradorConfiguracaoHabilidades__Listagem() {
    const { listagemHabilidades, selecionaHabilidade } = useContexto__PaginaModeradorConfiguracaoHabilidades__Listagem();

    return (
        <ListagemComposta
            listagem={listagemHabilidades}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={habilidade => habilidade.id}
            renderizarItem={habilidade => <RenderizaRegistroHabilidade habilidade={habilidade} selecionaHabilidade={selecionaHabilidade} />}
        />
    );
};

function RenderizaRegistroHabilidade({ habilidade, selecionaHabilidade }: { habilidade: RegistroHabilidade; selecionaHabilidade: (idHabilidade: number) => void; }) {
    return (
        <button type="button" className={styles.card_habilidade} onClick={() => selecionaHabilidade(habilidade.id)}>
            <strong>{habilidade.nome}</strong>
            <span>{habilidade.descricao}</span>
            <small>{habilidade.tipoHabilidade.nome}</small>
        </button>
    );
};