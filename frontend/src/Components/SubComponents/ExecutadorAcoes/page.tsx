// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { acaoEmExecucao } from "Redux/slices/executadorAcaoHelperSlice";
import { limparExecucaoAcao } from "Redux/slices/executadorAcaoHelperSlice.ts";
// #endregion

const Page = () => {
    const acaoRequisitada = useSelector(acaoEmExecucao).executadorAcao;
    const dispatch = useDispatch();

    const [valoresSelecionados, setValoresSelecionados] = useState<{ [key: string]: number | undefined }>({});

    const handleSelectChange = (key: string, value: number) => {
        setValoresSelecionados((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (acaoRequisitada) {
            const valoresIniciais: { [key: string]: number | undefined } = {};

            acaoRequisitada.opcoesExecucoes.forEach((opcoesExecucao) => {
                const opcoesDisponiveis = opcoesExecucao.opcoes;
                if (opcoesDisponiveis.length > 0) {
                    valoresIniciais[opcoesExecucao.key] = opcoesDisponiveis[0].key;
                }
            });

            setValoresSelecionados(valoresIniciais);
        }
    }, [acaoRequisitada]);

    const executar = () => {
        acaoRequisitada?.executaComOpcoes(valoresSelecionados);
        dispatch(limparExecucaoAcao());
        setValoresSelecionados({});
    };

    return (
        <>
            {acaoRequisitada && (
                <div className={style.acao_emexecucao}>
                    <div className={style.opcoes_acao}>
                        {acaoRequisitada.opcoesExecucoes.map((opcoesExecucao) => {
                            const key = opcoesExecucao.key;

                            return (
                                <div key={key} className={style.opcao_acao}>
                                    <h2>{opcoesExecucao.displayName}</h2>
                                    <select value={valoresSelecionados[key] || ''} onChange={(e) => handleSelectChange(key, Number(e.target.value))}>
                                        {opcoesExecucao.opcoes.map(opcao => (
                                            <option key={opcao.key} value={opcao.key}>{opcao.value}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <button onClick={executar}>Executar</button>
                        <button onClick={() => { dispatch(limparExecucaoAcao()) }}>Cancelar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
