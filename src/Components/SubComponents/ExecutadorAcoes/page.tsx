// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { pluralize, ItemComponente } from 'Types/classes.tsx';
import { acaoEmExecucao } from "Redux/slices/executadorAcaoHelperSlice";

import { FichaHelper } from "Types/classes_estaticas.tsx";

import { useDispatch } from 'react-redux';
import { limparExecucaoAcao } from "Redux/slices/executadorAcaoHelperSlice.ts";
// #endregion

const page = () => {
    const acaoRequisitada = useSelector(acaoEmExecucao).executadorAcao;
    const dispatch = useDispatch();

    const [valoresSelecionados, setValoresSelecionados] = useState<{ [key: number]: number | undefined }>({});

    const handleSelectChange = (index: number, value: number) => {
        setValoresSelecionados((prevState) => ({
            ...prevState,
            [index]: value,
        }));
    };

    useEffect(() => {
        if (acaoRequisitada) {
            const valoresIniciais: { [key: number]: number | undefined } = {};
            acaoRequisitada.opcoesExecucao.forEach((opcao, index) => {
                const opcoesDisponiveis = opcao.opcoes();
                if (opcoesDisponiveis.length > 0) {
                    valoresIniciais[index] = opcoesDisponiveis[0].key;
                }
            });
            
            setValoresSelecionados(valoresIniciais);
        }
    }, [acaoRequisitada]);

    const executar = () => {
        acaoRequisitada?.executaComOpcoes(valoresSelecionados);
        dispatch(limparExecucaoAcao());
        setValoresSelecionados({});
    }

    return (
        <>
            {acaoRequisitada && (
                <div className={style.acao_emexecucao}>
                    {acaoRequisitada.opcoesExecucao.map((opcao, index) => {
                        return (
                            <select key={index} value={valoresSelecionados[index] || ''} onChange={(e) => handleSelectChange(index, Number(e.target.value))}>{opcao.opcoes().map(opcao => (<option key={opcao.key} value={opcao.key}>{opcao.value}</option>))}</select>
                        );
                    })}

                    <div>
                        <button onClick={executar}>Executar</button>
                        <button onClick={() => { dispatch(limparExecucaoAcao()) }}>Cancelar</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default page;