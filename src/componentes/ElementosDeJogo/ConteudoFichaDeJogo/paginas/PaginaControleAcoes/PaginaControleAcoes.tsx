import styles from './styles.module.css';

import { AcaoDisponivel } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoControleAcoesRuntime } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';

export default function PaginaControleAcoes() {
    const { acoes, desativarAcoes } = useContextoFichaDePersonagem();
    const { executaAcao } = useContextoControleAcoesRuntime();

    return (
        <div className={styles.lista_acoes}>
            {acoes.map(acao => <AcaoEmFicha key={acao.key} acao={acao} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />)}
        </div>
    );
};

function AcaoEmFicha({ acao, desativarAcoes, executaAcao }: { acao: AcaoDisponivel; desativarAcoes: boolean; executaAcao: (keyAcao: string) => void; }) {
    return (
        <button className={`${styles.acao} ${desativarAcoes ? styles.blocked : ''}`} disabled={desativarAcoes} onClick={() => { executaAcao(acao.key); }}>
            {acao.nome}
        </button>
    );
};
