import styles from './styles.module.css';

import { FichaEmClient } from 'types-nora-api';

export default function VisualizacaoFichaDeJogo({ fichaDeJogo }: { fichaDeJogo: FichaEmClient; }) {
    return (
        <div className={styles.recipiente_abas_fichas}>
            <div className={styles.recipiente_provisorio_atributos}>
                {fichaDeJogo.atributos.map(atributoFicha => (
                    <p key={atributoFicha.atributo.id}>{atributoFicha.atributo.nomeAbreviado}: {atributoFicha.valor}</p>
                ))}
            </div>
            <div className={styles.recipiente_provisorio_atributos}>
                {fichaDeJogo.pericias.sort((a, b) => a.pericia.nome.localeCompare(b.pericia.nome)).map(periciaFicha => (
                    <p key={periciaFicha.pericia.id}>{periciaFicha.pericia.nomeAbreviado}: <strong style={{ color: periciaFicha.patentePericia.cor }}>{periciaFicha.patentePericia.nome}</strong></p>
                ))}
            </div>
            <div className={styles.recipiente_provisorio_atributos}>
                {fichaDeJogo.estatisticasDanificaveis.map(estatisticasDanificaveisFicha => (
                    <p key={estatisticasDanificaveisFicha.estatisticaDanificavel.id}>{estatisticasDanificaveisFicha.estatisticaDanificavel.nomeAbreviado}: {estatisticasDanificaveisFicha.valorMaximo}</p>
                ))}
            </div>
        </div>
    );
};