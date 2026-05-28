import styles from './styles.module.css';

import { FichaEmClient, ModificadorRuntime } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import adicionaSinalEmNumeroParaExibicao from 'Uteis/UteisTexto/adicionaSinalEmNumeroParaExibicao';

export default function PaginaControleModificadores() {
    const { ficha, modificadoresAtivos } = useContextoFichaDePersonagem();

    if (modificadoresAtivos.length === 0) return <p className={styles.sem_modificadores}>Nenhum modificador ativo.</p>;

    return (
        <div className={styles.lista_modificadores}>
            {modificadoresAtivos.map(modificador => <ModificadorAtivo key={modificador.key} modificador={modificador} nomeAlvo={obtemNomeAlvo(modificador, ficha)} />)}
        </div>
    );
};

function ModificadorAtivo({ modificador, nomeAlvo }: { modificador: ModificadorRuntime; nomeAlvo: string; }) {
    return (
        <article className={styles.modificador}>
            <header className={styles.cabecalho}>
                <h2 className={styles.nome_modificador}>{modificador.nome}</h2>
                <p className={`${styles.valor} ${modificador.valor >= 0 ? styles.positivo : styles.negativo}`}>{adicionaSinalEmNumeroParaExibicao(modificador.valor)}</p>
            </header>
            <p className={styles.alvo}>{nomeAlvo}</p>
            <p className={styles.origem}>{`${modificador.categoria} - ${modificador.origem.nome}`}</p>
        </article>
    );
};

function obtemNomeAlvo(modificador: ModificadorRuntime, ficha: FichaEmClient): string {
    const alvo = modificador.alvo;

    if (alvo.tipo === 'teste_pericia_valor_maximo') {
        const pericia = ficha.pericias.find(periciaAtual => periciaAtual.pericia.id === alvo.idPericia);
        return `Valor Máximo de ${pericia?.pericia.nomeAbreviado ?? 'Perícia'}`;
    }

    const atributo = ficha.atributos.find(atributoAtual => atributoAtual.atributo.id === alvo.idAtributo);
    return atributo?.atributo.nomeAbreviado ?? 'Atributo';
};
