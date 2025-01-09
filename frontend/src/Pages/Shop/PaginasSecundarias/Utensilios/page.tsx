// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { ArgsItem } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const [pericia, setPericia] = useState({ value: 0, text: '' });
    const [patente, setPatente] = useState({ value: 0, text: '' });

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const patentes: Record<number, { nome: string; peso: number; categoria: number; valor: number; }> = {
        1: { nome: 'Simples', peso: 1, categoria: 1, valor: 2, },
        2: { nome: 'Complexo', peso: 1, categoria: 2, valor: 5, },
        3: { nome: 'Especial', peso: 2, categoria: 3, valor: 8, },
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
        const argsItem: ArgsItem = {
            args: { idTipoItem: 2, nome: [`Utensílio de ${pericia.text} ${patente.text}`], peso: patentes[patente.value].peso, categoria: patentes[patente.value].categoria, },
            dadosComportamentos: {
                dadosComportamentoEmpunhavel: [true, 1],
            },
            modificadores: [
                {
                    props: {
                        nome: `Ferramentas ${patente.text}`,
                        idDuracao: 3,
                        quantidadeDuracaoMaxima: 1,
                        dadosEfeitos: [
                            {
                                idLinhaEfeito: SingletonHelper.getInstance().pericias.find(periciaEscolhida => periciaEscolhida.id === pericia.value)!.refLinhaEfeito.id,
                                idTipoEfeito: 1,
                                dadosValoresEfeitos: { valorBonusAdicional: patentes[patente.value].valor },
                            },
                        ],
                        dadosComportamentos: { dadosComportamentoPassivo: [true, false] },
                    }
                }
            ],
        };

        adicionarItem(argsItem);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Utensilios</h2>

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
                    <p>Utensílios são Itens que aumentam o Valor de uma Perícia</p>
                    <p>O Utensílio precisa estar sendo Empunhado para aplicar seus Bônus</p>
                </div>
                {patente.value > 0 && (
                    <div>
                        <p>{`Um Utensílio ${patentes[patente.value].nome} oferece ${patentes[patente.value].valor} de Bônus`}</p>
                        <p>{`Tem Categoria ${patentes[patente.value].categoria} e Peso ${patentes[patente.value].peso}`}</p>
                    </div>
                )}
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => { mudarPagina(0) }}>Voltar</button>
                <button onClick={adicionar} disabled={pericia.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;