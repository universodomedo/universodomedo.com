// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { GanhoIndividualNex, GanhosNex, RLJ_Ficha2, ValoresGanhoETroca } from 'Types/classes/index.ts';

import EditaAtributos from 'Pages/EditaFicha/Componentes/EditaAtributos/page.tsx';
import EditaPericias from 'Pages/EditaFicha/Componentes/EditaPericias/page.tsx';

import { FichaProvider, useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import Modal from "Components/Modal/page.tsx";
// #endregion

const page = () => {
    const [ganhosNex, setGanhosNex] = useState<GanhosNex | null>(null);
    const [_, setState] = useState({});
    const atualizarFicha = () => setState({});

    const closeModal = () => {
        console.log('fechando');
    };

    useEffect(() => {
        const fichaInicial: RLJ_Ficha2 = {
            detalhes: { idClasse: 1, idNivel: 1, nome: 'Ficha Editavel' },
            estatisticasDanificaveis: [{ id: 1, valorMaximo: 6, valor: 6 }, { id: 2, valorMaximo: 5, valor: 5 }, { id: 3, valorMaximo: 1, valor: 1 }],
            estatisticasBuffaveis: [],
            atributos: [{ id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 }],
            periciasPatentes: [{ idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 }],
        };

        setGanhosNex(new GanhosNex(fichaInicial, [
            {
                idTipoGanhoNex: 1,
                opcoes: {
                    valoresGanhoETroca: new ValoresGanhoETroca(2, 1)
                }
            },
            {
                idTipoGanhoNex: 2, 
                opcoes: { 
                    valoresGanhoETroca: { 
                        veteranas: new ValoresGanhoETroca(1),
                        treinadas: new ValoresGanhoETroca(2),
                        // experts: new ValoresGanhoETroca(3) // ele não está dando erro com nome errado
                    } 
                }
            }
        ]));
    }, [])

    const proximo = () => {
        ganhosNex?.avancaEtapa();
        atualizarFicha();
    };

    const volta = () => {
        ganhosNex?.retrocedeEtapa();
        atualizarFicha();
    };

    return (
        <>
            {ganhosNex && (
                <FichaProvider ganhosNex={ganhosNex} atualizarFicha={atualizarFicha}>
                    <div className={style.editando_ficha}>
                        <h1>Criando Ficha - NEX 0%</h1>

                        {ganhosNex?.finalizando && (
                            <>
                            <Modal isOpen={true} onClose={closeModal}>
                                <h1>Teste</h1>
                            </Modal>
                            </>
                        )}

                        <div className={style.area_edicao}>
                            {ganhosNex.etapa.id === 1 && (
                                <EditaAtributos />
                            )}
                            {ganhosNex.etapa.id === 2 && (
                                <EditaPericias />
                            )}
                        </div>

                        <div className={style.botoes}>
                            <button onClick={volta} disabled={!ganhosNex.podeRetrocederEtapa} className={style.prosseguir}>Voltar</button>
                            <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa} className={style.prosseguir}>{ganhosNex.textoBotaoProximo}</button>
                        </div>
                    </div>
                </FichaProvider>
            )}
        </>
    );
}

export default page;