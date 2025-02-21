// #region Imports
import style from 'Paginas/Loja/style.module.css';
import { useState } from 'react';

import { DadosItemSemIdentificador } from 'Classes/ClassesTipos/index.ts';

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
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
        const dadosItem: DadosItemSemIdentificador = {
            dadosNomeCustomizado: { nomePadrao: `Mochila ${patente.text}` },
            idTipoItem: 2,
            peso: 0,
            categoria: patentes[patente.value].categoria,
            dadosComportamentoEmpunhavel: {
                dadosCustoEmpunhar: [
                    {
                        idExecucao: 3,
                        quantidadeExecucoes: 1,
                    },
                ],
                extremidadesNecessarias: 1,
            },
            dadosComportamentoEquipavel: {
                dadosCustoEquipar: [
                    {
                        idExecucao: 2,
                        quantidadeExecucoes: 1,
                    },
                ],
            },
            dadosModificadores: [
                {
                    nome: `Mochila ${patente.text}`,
                    idDuracao: 5,
                    quantidadeDuracaoMaxima: 1,
                    quantidadeDuracaoAtual: 1,
                    tipoModificador: { tipo: 'Passivo', requisito: 'Equipar' },
                    dadosEfeitos: [
                        {
                            idTipoEfeito: 1,
                            idLinhaEfeito: 52,
                            dadosValorEfeito: { valorBonusAdicional: patentes[patente.value].valor },
                        },
                    ],
                },
            ],
        };

        adicionarItem(dadosItem);
    }

    return (
        <>
            <div className={style.recipiente_area_item}>
                <div className={style.recipiente_conteudo_tipo_item}>
                    <h2>Adicionar Mochilas</h2>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Patente'}>
                            <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> {Object.entries(patentes).map(([id, data]) => (<option key={id} value={id}>{data.nome}</option>))} </select>
                        </InputComRotulo>
                    </div>

                    <div className={style.descricao_item}>
                        <div>
                            <p>Mochilas são Itens que aumentam o Valor de Capacidade de Carga</p>
                            <p>A Mochila precisa estar sendo Vestida para aplicar seus Bônus</p>
                        </div>
                        {patente.value > 0 && (
                            <div>
                                <p>{`Uma Mochila ${patentes[patente.value].nome} oferece ${patentes[patente.value].valor} de Capacidade de Carga Extra`}</p>
                                <p>{`Tem Categoria ${patentes[patente.value].categoria}`}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <div className={style.recipiente_botoes_area_item}>
                <button onClick={() => { mudarPagina(0) }}>Voltar</button>
                <button onClick={adicionar} disabled={patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}


export default page;