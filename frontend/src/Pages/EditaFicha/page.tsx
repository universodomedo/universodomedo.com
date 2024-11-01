// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { GanhoIndividualNex, GanhosNex, RLJ_Ficha2, ValoresGanhoETroca } from 'Types/classes/index.ts';

import EditaAtributos from 'Pages/EditaFicha/Componentes/EditaAtributos/page.tsx';
import EditaPericias from 'Pages/EditaFicha/Componentes/EditaPericias/page.tsx';

import { FichaProvider, useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
// #endregion

const page = () => {
    const [ganhosNex, setGanhosNex] = useState<GanhosNex | null>(null);
    const [_, setState] = useState({});
    const atualizarFicha = () => setState({});

    useEffect(() => {
        const fichaInicial: RLJ_Ficha2 = {
            detalhes: { idClasse: 1, idNivel: 1, nome: 'Ficha Editavel' },
            estatisticasDanificaveis: [{ id: 1, valorMaximo: 6, valor: 6 }, { id: 2, valorMaximo: 5, valor: 5 }, { id: 3, valorMaximo: 1, valor: 1 }],
            estatisticasBuffaveis: [],
            atributos: [{ id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 }],
            periciasPatentes: [{ idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 }],
        };
        // setGanhosNex(new GanhosNex(fichaInicial, [{ idTipoGanhoNex: 1, opcoes: { valoresGanhoETroca: [new ValoresGanhoETroca(2, 1)] } }]));
        setGanhosNex(new GanhosNex(fichaInicial, [{ idTipoGanhoNex: 2, opcoes: { valoresGanhoETroca: [new ValoresGanhoETroca(1, 0)] } }]));

        // [
        //     new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanhoT), new ValorUtilizavel(valorDeTrocaT)),
        //     new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanhoV), new ValorUtilizavel(valorDeTrocaV)),
        //     new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanhoE), new ValorUtilizavel(valorDeTrocaE)),
        //     new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanhoL), new ValorUtilizavel(valorDeTrocaL)),
        // ];
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
                            {ganhosNex.etapa === 2 && (
                                <EditaPericias />
                            )}
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