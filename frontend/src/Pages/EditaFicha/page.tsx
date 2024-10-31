// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { GanhoIndividualNex, GanhosNex, TrocaIndividualNex } from 'Types/classes/index.ts';

import EditaAtributos from 'Pages/EditaFicha/Componentes/EditaAtributos/page.tsx';
import EditaPericias from 'Pages/EditaFicha/Componentes/EditaPericias/page.tsx';

import { FichaProvider, useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
// #endregion

const page = () => {
    const [ganhosNex, setGanhosNex] = useState<GanhosNex | null>(null);
    const [_, setState] = useState({});
    const atualizarFicha = () => setState({});

    useEffect(() => {
        // setGanhosNex(new GanhosNex([new GanhoIndividualNex(1, 2), new GanhoIndividualNex(2, 1)], 3, [new TrocaIndividualNex(1, 1)]));
        setGanhosNex(new GanhosNex([{ idTipoGanhoNex: 1, opcoes: { valorGanho: 2, valorTroca: 1, } }]));
    }, [])

    const prosseguir = () => {
        ganhosNex?.proximaEtapa();
        atualizarFicha();
    };

    return (
        <>
            {ganhosNex && (
                <FichaProvider ganhosNex={ganhosNex} atualizarFicha={atualizarFicha}>
                    <div className={style.editando_ficha}>
                        <h1>Criando Ficha - NEX 0%</h1>

                        <div className={style.area_edicao}>
                            {ganhosNex.etapa === 1 && (
                                <EditaAtributos />
                            )}
                            {/* {ganhosNex.etapa === 2 && (
                                <EditaPericias />
                            )} */}
                        </div>

                        <button onClick={prosseguir} disabled={false} className={style.prosseguir}>
                            Prosseguir
                        </button>
                    </div>
                </FichaProvider>
            )}
        </>
    );
}

export default page;