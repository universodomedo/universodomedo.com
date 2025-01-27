// #region Imports
import style from './style.module.css';

import { GanhoIndividualNexEstatisticaFixa } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';

import Tooltip from 'Componentes/Tooltip/pagina.tsx'
// #endregion

const page = () => {
    const { ganhosNex } = useContextoNexUp();

    const ganhoEstatistica = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEstatisticaFixa)!;

    const CorpoEstatistica = ({ idEstatistica, valorEstatistica }: { idEstatistica: number, valorEstatistica: { valorAtual: number, valorAtualizado: number } }) => {
        const estatistica = SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica => estatistica.id === idEstatistica)!;

        return (
            <div className={style.visualizador_estatistica}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2 className={style.nome_estatistica}>{estatistica?.nomeAbrev}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h1>{estatistica.nome}</h1>
                        <p>{estatistica.descricao}</p>
                        <h2>Ganhos de {estatistica.nome}</h2>
                        {idEstatistica === 1 ? (
                            <p>Ganho Fixo de NEX 5%: +{ganhoEstatistica.pvGanhoIndividual}</p>
                        ) : idEstatistica === 2 ? (
                            <p>Ganho Fixo de NEX 5%: +{ganhoEstatistica.psGanhoIndividual}</p>
                        ) : idEstatistica === 3 ? (
                            <p>Ganho Fixo de NEX 5%: +{ganhoEstatistica.peGanhoIndividual}</p>
                        ) : ''}
                    </Tooltip.Content>
                </Tooltip>
                <h2 className={style.alteracao_valor_estatistica}>{`${Math.floor(valorEstatistica.valorAtual)} → ${Math.floor(valorEstatistica.valorAtualizado)}`}</h2>
            </div>
        );
    }

    return (
        <div className={style.editando_ficha}>
            <div className={style.editando_ficha_estatisticas}>
                <CorpoEstatistica idEstatistica={1} valorEstatistica={ganhosNex.pv} />
                <CorpoEstatistica idEstatistica={2} valorEstatistica={ganhosNex.ps} />
                <CorpoEstatistica idEstatistica={3} valorEstatistica={ganhosNex.pe} />
            </div>
        </div>
    );
}

export default page;