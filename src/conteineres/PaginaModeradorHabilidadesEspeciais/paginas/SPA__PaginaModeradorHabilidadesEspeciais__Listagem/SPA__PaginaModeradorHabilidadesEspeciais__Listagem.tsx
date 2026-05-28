import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaModeradorHabilidadesEspeciais__Listagem } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__Listagem/contexto';

type RegistroHabilidadeEspecial = ReturnType<typeof useContexto__PaginaModeradorHabilidadesEspeciais__Listagem>['listagemHabilidades']['registros'][number];

export default function SPA__PaginaModeradorHabilidadesEspeciais__Listagem() {
    const { listagemHabilidades, estaEmProcessoCriacao, iniciaCriacao, selecionaHabilidade } = useContexto__PaginaModeradorHabilidadesEspeciais__Listagem();

    return (
        <ListagemComposta
            listagem={listagemHabilidades}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={habilidade => habilidade.habilidade.id}
            renderizarItem={habilidade => <RenderizaRegistroHabilidade habilidade={habilidade} selecionaHabilidade={selecionaHabilidade} />}
            novoRegistro={{ estaEmProcessoCriacao, aoIniciarCriacao: iniciaCriacao, textoBotao: 'Nova habilidade' }}
        />
    );
};

function RenderizaRegistroHabilidade({ habilidade, selecionaHabilidade }: { habilidade: RegistroHabilidadeEspecial; selecionaHabilidade: (idHabilidade: number) => void; }) {
    return (
        <button type="button" className={styles.card_habilidade} onClick={() => selecionaHabilidade(habilidade.habilidade.id)}>
            <strong>{habilidade.habilidade.nome}</strong>
            <span>{habilidade.habilidade.descricao}</span>
            <small>{habilidade.custoPontosHabilidadeEspecial} pontos de habilidade especial</small>
        </button>
    );
};
