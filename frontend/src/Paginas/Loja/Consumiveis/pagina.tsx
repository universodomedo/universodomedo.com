// #region Imports
import style from 'Paginas/Loja/style.module.css';
import { useState } from 'react';

import { DadosItemSemIdentificador } from 'Classes/ClassesTipos/index.ts';

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
import InputNumerico from 'Componentes/ElementosComponentizados/InputNumerico/pagina.tsx';
// #endregion

const pagina = () => {
    const [item, setItem] = useState(0);
    const [quantidade, setQuantidade] = useState(1);

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const itens: Record<number, { dadosItem: DadosItemSemIdentificador, listaDescricoes: string[]; }> = {
        1: {
            dadosItem: {
                dadosNomeCustomizado: { nomePadrao: 'Bálsamo de Arnica' },
                idTipoItem: 3,
                peso: 1,
                categoria: 0,
                dadosAcoes: [
                    {
                        nome: 'Consumir',
                        dadosCustos: {
                            dadosPrecoExecucao: [
                                {
                                    idExecucao: 2,
                                    quantidadeExecucoes: 1,
                                },
                            ],
                            dadosPrecoUtilizavel: {
                                nomeUtilizavel: 'Carga de Bálsamo de Arnica',
                                custoCargasUtilizavel: 1,
                            },
                        },
                        dadosModificadores: [
                            {
                                nome: 'Bálsamo de Arnica',
                                idDuracao: 3,
                                quantidadeDuracaoMaxima: 1,
                                quantidadeDuracaoAtual: 1,
                                tipoModificador: { tipo: 'Ativo' },
                                dadosEfeitos: [
                                    {
                                        idLinhaEfeito: 33,
                                        idTipoEfeito: 2,
                                        dadosValorEfeito: { valorBonusAdicional: 2 },
                                    },
                                ],
                            },
                        ],
                        dadosRequisitosParaExecutarAcao: {
                            empunharItem: true,
                        },
                    },
                ],
                dadosComportamentoEmpunhavel: {
                    dadosCustoEmpunhar: [
                        {
                            idExecucao: 3,
                            quantidadeExecucoes: 1,
                        },
                    ],
                    extremidadesNecessarias: 1,
                },
                dadosComportamentoUtilizavel: {
                    dadosUtilizaveis: [
                        {
                            nomeUtilizavel: 'Carga de Bálsamo de Arnica',
                            usosMaximos: 1,
                            usosAtuais: 1,
                        },
                    ],
                },
            },
            listaDescricoes: ['O Bálsamo de Arnica aumenta em 2 sua Resistência Mundana para o próximo Ataque Mundano', `Tem Categoria 0, Peso 1 e 1 Uso`],
        },
        2: {
            dadosItem: {
                dadosNomeCustomizado: { nomePadrao: 'Gel de Babosa' },
                idTipoItem: 3,
                peso: 1,
                categoria: 0,
                dadosAcoes: [
                    {
                        nome: 'Consumir',
                        dadosCustos: {
                            dadosPrecoExecucao: [
                                {
                                    idExecucao: 2,
                                    quantidadeExecucoes: 1,
                                },
                            ],
                            dadosPrecoUtilizavel: {
                                nomeUtilizavel: 'Carga de Gel de Babosa',
                                custoCargasUtilizavel: 1,
                            },
                        },
                        dadosModificadores: [
                            {
                                nome: 'Gel de Babosa',
                                idDuracao: 3,
                                quantidadeDuracaoMaxima: 1,
                                quantidadeDuracaoAtual: 1,
                                tipoModificador: { tipo: 'Ativo' },
                                dadosEfeitos: [
                                    {
                                        idLinhaEfeito: 37,
                                        idTipoEfeito: 2,
                                        dadosValorEfeito: { valorBonusAdicional: 2 },
                                    },
                                ],
                            },
                        ],
                        dadosRequisitosParaExecutarAcao: {
                            empunharItem: true,
                        },
                    },
                ],
                dadosComportamentoEmpunhavel: {
                    dadosCustoEmpunhar: [
                        {
                            idExecucao: 3,
                            quantidadeExecucoes: 1,
                        },
                    ],
                    extremidadesNecessarias: 1,
                },
                dadosComportamentoUtilizavel: {
                    dadosUtilizaveis: [
                        {
                            nomeUtilizavel: 'Carga de Gel de Babosa',
                            usosMaximos: 1,
                            usosAtuais: 1,
                        },
                    ],
                },
            },
            listaDescricoes: ['O Gel de Babosa aumenta em 2 sua Resistência Natural para o próximo Ataque Natural', `Tem Categoria 0, Peso 1 e 1 Uso`],
        },
        3: {
            dadosItem: {
                dadosNomeCustomizado: { nomePadrao: 'Ácido Hialurônico Injetável' },
                idTipoItem: 3,
                peso: 1,
                categoria: 1,
                dadosAcoes: [
                    {
                        nome: 'Injetar',
                        dadosCustos: {
                            dadosPrecoExecucao: [
                                {
                                    idExecucao: 2,
                                    quantidadeExecucoes: 1,
                                },
                            ],
                            dadosPrecoUtilizavel: {
                                nomeUtilizavel: 'Carga de Ácido Hialurônico Injetável',
                                custoCargasUtilizavel: 1,
                            },
                        },
                        dadosRequisitosParaExecutarAcao: {
                            empunharItem: true,
                        },
                    },
                ],
                dadosComportamentoEmpunhavel: {
                    dadosCustoEmpunhar: [
                        {
                            idExecucao: 3,
                            quantidadeExecucoes: 1,
                        },
                    ],
                    extremidadesNecessarias: 1,
                },
                dadosComportamentoUtilizavel: {
                    dadosUtilizaveis: [
                        {
                            nomeUtilizavel: 'Carga de Ácido Hialurônico Injetável',
                            usosMaximos: 1,
                            usosAtuais: 1,
                        },
                    ],
                },
            },
            listaDescricoes: ['O Bálsamo de Arnica recupera 4-7 P.V. do Alvo', `Tem Categoria 1, Peso 1 e 1 Uso`],
        },
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItem(Number(e.target.value));
    };

    const adicionar = () => {
        const dadosItem: DadosItemSemIdentificador = itens[item].dadosItem;

        adicionarItem(dadosItem, quantidade);
    };

    return (
        <>
            <div className={style.recipiente_area_item}>
                <div className={style.recipiente_conteudo_tipo_item}>
                    <h2>Adicionar Consumível</h2>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Consumível'}>
                            <select value={item} onChange={handleItemChange}> <option value="0" disabled >Selecionar Consumível</option> {Object.entries(itens).map(([id, data]) => (<option key={id} value={id}>{data.dadosItem.dadosNomeCustomizado.nomePadrao}</option>))} </select>
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
                </div>
            </div>
            <div className={style.recipiente_botoes_area_item}>
                <button onClick={() => { mudarPagina(0) }}>Voltar</button>
                <button onClick={adicionar} disabled={item === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}

export default pagina;