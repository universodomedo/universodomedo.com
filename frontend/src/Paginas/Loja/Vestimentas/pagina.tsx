// #region Imports
import style from 'Paginas/Loja/style.module.css';
import { useState } from 'react';

import { DadosItemSemIdentificador } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts'

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
// #endregion

const page = () => {
    const [pericia, setPericia] = useState({ value: 0, text: '' });
    const [patente, setPatente] = useState({ value: 0, text: '' });

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const patentes: Record<number, { nome: string; peso: number; categoria: number; valor: number; }> = {
        1: { nome: 'Simples', peso: 3, categoria: 1, valor: 2, },
        2: { nome: 'Complexa', peso: 3, categoria: 2, valor: 5, },
        3: { nome: 'Especial', peso: 4, categoria: 3, valor: 8, },
    };

    const handlePericiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        const text = e.target.options[selectedIndex].text;
        setPericia({ value: Number(e.target.value), text });
    };

    const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        const text = e.target.options[selectedIndex].text;
        setPatente({ value: Number(e.target.value), text });
    };

    const adicionar = () => {
        const dadosItem: DadosItemSemIdentificador = {
            dadosNomeCustomizado: { nomePadrao: `Vestimenta de ${pericia.text} ${patente.text}` },
            idTipoItem: 2,
            peso: patentes[patente.value].peso,
            categoria: patentes[patente.value].categoria,
            dadosComportamentoEmpunhavel: {
                dadosCustoEmpunhar: [
                    {
                        idExecucao: 2,
                        quantidadeExecucoes: 1,
                    },
                ],
                extremidadesNecessarias: 2,
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
                    nome: `Ferramentas ${patente.text}`,
                    idDuracao: 5,
                    quantidadeDuracaoMaxima: 1,
                    quantidadeDuracaoAtual: 1,
                    tipoModificador: { tipo: 'Passivo', requisito: 'Equipar' },
                    dadosEfeitos: [
                        {
                            idTipoEfeito: 1,
                            idLinhaEfeito: SingletonHelper.getInstance().pericias.find(periciaEscolhida => periciaEscolhida.id === pericia.value)!.refLinhaEfeito.id,
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
                    <h2>Adicionar Vestimentas</h2>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Perícia'}>
                            <select value={pericia.value} onChange={handlePericiaChange}> <option value="0" disabled >Selecionar Perícia</option> {SingletonHelper.getInstance().pericias.sort((a, b) => a.nome.localeCompare(b.nome)).map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.nome}</option>))} </select>
                        </InputComRotulo>
                    </div>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Patente'}>
                            <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> {Object.entries(patentes).map(([id, data]) => (<option key={id} value={id}>{data.nome}</option>))} </select>
                        </InputComRotulo>
                    </div>

                    <div className={style.descricao_item}>
                        <div>
                            <p>Vestimentas são Itens que aumentam o Valor de uma Perícia</p>
                            <p>A Vestimenta precisa estar sendo Vestida para aplicar seus Bônus</p>
                        </div>
                        {patente.value > 0 && (
                            <div>
                                <p>{`Uma Vestimenta ${patentes[patente.value].nome} oferece ${patentes[patente.value].valor} de Bônus`}</p>
                                <p>{`Tem Categoria ${patentes[patente.value].categoria} e Peso ${patentes[patente.value].peso}`}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <div className={style.recipiente_botoes_area_item}>
                <button onClick={() => { mudarPagina(0) }}>Voltar</button>
                <button onClick={adicionar} disabled={pericia.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}


export default page;