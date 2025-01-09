// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { ArgsItem } from 'Types/classes/index.ts';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const [patente, setPatente] = useState({ value: 0, text: '' });

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const patentes: Record<number, { nome: string; categoria: number; valor: number; }> = {
        1: { nome: 'Simples', categoria: 1, valor: 3, },
        2: { nome: 'Complexa', categoria: 2, valor: 6, },
        3: { nome: 'Especial', categoria: 3, valor: 10, },
    };

    const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        const text = e.target.options[selectedIndex].text;
        setPatente({ value: Number(e.target.value), text });
    };

    const adicionar = () => {
        const argsItem: ArgsItem = {
            args: { idTipoItem: 2, nome: [`Mochila ${patente.text}`], peso: 0, categoria: patentes[patente.value].categoria, },
            dadosComportamentos: {
                dadosComportamentoEmpunhavel: [true, 1],
                dadosComportamentoVestivel: [true]
            },
            modificadores: [
                {
                    props: {
                        nome: `Ferramentas ${patente.text}`,
                        idDuracao: 3,
                        quantidadeDuracaoMaxima: 1,
                        dadosEfeitos: [
                            {
                                idLinhaEfeito: 52,
                                idTipoEfeito: 1,
                                dadosValoresEfeitos: { valorBonusAdicional: patentes[patente.value].valor },
                            },
                        ],
                        dadosComportamentos: { dadosComportamentoPassivo: [false, true] },
                    }
                }
            ],
        };

        adicionarItem(argsItem);
    }
    
    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Mochilas</h2>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Patente'}>
                    <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> {Object.entries(patentes).map(([id, data]) => ( <option key={id} value={id}>{data.nome}</option> ))} </select>
                </InputComRotulo>
            </div>

            <div className={style.descricao_item}>
                <div>
                    <p>Mochilas são Itens que aumentam o Valor de Capacidade de Carga</p>
                    <p>A Mochila precisa estar sendo Vestida para aplicar seus Bônus</p>
                </div>
                {patente.value > 0 && (
                    <div>
                        <p>{`Um Mochila ${patentes[patente.value].nome} oferece ${patentes[patente.value].valor} de Capacidade de Carga Extra`}</p>
                        <p>{`Tem Categoria ${patentes[patente.value].categoria}`}</p>
                    </div>
                )}
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                <button onClick={adicionar} disabled={patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;