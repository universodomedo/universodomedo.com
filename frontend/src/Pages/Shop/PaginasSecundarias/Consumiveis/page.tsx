// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { ArgsItem } from 'Types/classes/index.ts';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
import InputNumerico from 'Recursos/ElementosComponentizados/InputNumerico/page.tsx';
// #endregion

const page = () => {
    const [item, setItem] = useState(0);
    const [quantidade, setQuantidade] = useState(1);

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const itens: Record<number, {
        dados: ArgsItem, listaDescricoes: string[]; }> = {
        1: {
            dados: {
                args: { nome: [`Bálsamo de Arnica`], idTipoItem: 3, peso: 1, categoria: 0, },
                dadosAcoes: [
                    {
                        args: { nome: 'Consumir', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 3, },
                        dadosComportamentos: {
                            dadosComportamentoConsomeUso: [1],
                        },
                        custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                        buffs: [ {
                            idBuff: 33,
                            nome: `Bálsamo de Arnica`,
                            valor: 2,
                            dadosComportamentos: {
                                dadosComportamentoAtivo: [],
                            },
                            duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 2,
                        } ],
                        requisitos: [2],
                    }
                ],
                dadosComportamentos: {
                    dadosComportamentoEmpunhavel: [true, 1],
                    dadosComportamentoUtilizavel: [1],
                },
            },
            listaDescricoes: ['O Bálsamo de Arnica aumenta em 2 sua Resistência Mundana para o próximo Ataque Mundano', `Tem Categoria 0, Peso 1 e 1 Uso`],
        },
        2: {
            dados: {
                args: { nome: [`Gel de Babosa`], idTipoItem: 3, peso: 1, categoria: 0, },
                dadosAcoes: [
                    {
                        args: { nome: 'Consumir', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 3, },
                        dadosComportamentos: {
                            dadosComportamentoConsomeUso: [1],
                        },
                        custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                        buffs: [ {
                            idBuff: 37,
                            nome: `Gel de Babosa`,
                            valor: 2,
                            dadosComportamentos: {
                                dadosComportamentoAtivo: [],
                            },
                            duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 2,
                        } ],
                        requisitos: [2],
                    }
                ],
                dadosComportamentos: {
                    dadosComportamentoEmpunhavel: [true, 1],
                    dadosComportamentoUtilizavel: [1],
                },
            },
            listaDescricoes: ['O Gel de Babosa aumenta em 2 sua Resistência Natural para o próximo Ataque Natural', `Tem Categoria 0, Peso 1 e 1 Uso`],
        },
        3: {
            dados: {
                args: { nome: [`Ácido Hialurônico Injetável`], idTipoItem: 3, peso: 1, categoria: 1, },
                dadosAcoes: [
                    {
                        args: { nome: 'Injetar', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 6, },
                        dadosComportamentos: {
                            dadosComportamentoAcao: ['Cura', 4, 7],
                            dadosComportamentoConsomeUso: [1],
                        },
                        custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                        requisitos: [2],
                    }
                ],
                dadosComportamentos: {
                    dadosComportamentoEmpunhavel: [true, 1],
                    dadosComportamentoUtilizavel: [1],
                },
            },
            listaDescricoes: ['O Bálsamo de Arnica recupera 4-7 P.V. do Alvo', `Tem Categoria 1, Peso 1 e 1 Uso`],
        }
    }

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItem(Number(e.target.value));
    };

    const adicionar = () => {
        const argsItem: ArgsItem = {
            args: itens[item].dados.args,
            dadosComportamentos: itens[item].dados.dadosComportamentos,
            dadosAcoes: itens[item].dados.dadosAcoes,
        };

        adicionarItem(argsItem, quantidade);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Consumível</h2>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Consumível'}>
                    <select value={item} onChange={handleItemChange}> <option value="0" disabled >Selecionar Consumível</option> {Object.entries(itens).map(([id, data]) => ( <option key={id} value={id}>{data.dados.args.nome}</option> ))} </select>
                </InputComRotulo>
            </div>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Quantidade'}>
                    <InputNumerico min={1} step={1} value={quantidade} onChange={setQuantidade} />
                </InputComRotulo>
            </div>

            <div className={style.descricao_item}>
                <div>
                    <p>Consumíveis são Itens que podem ser utilizados ofensivamente ou defensivamente</p>
                </div>
                {item > 0 && (
                    <div>
                        {itens[item].listaDescricoes.map((descricao, index) => (
                            <p key={index}>{descricao}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                <button onClick={adicionar} disabled={item === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;