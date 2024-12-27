// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { DadosItem } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
import InputNumerico from 'Recursos/ElementosComponentizados/InputNumerico/page.tsx';
// #endregion

const page = () => {
    const [elemento, setElemento] = useState({ value: 0, text: '' });
    const [patente, setPatente] = useState({ value: 0, text: '' });
    const [quantidade, setQuantidade] = useState(1);

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const patentes: Record<number, { nome: string; peso: number; categoria: number; usosMaximos: number; usos: number }> = {
        1: { nome: 'Simples', peso: 1, categoria: 0, usosMaximos: 2, usos: 2 },
        2: { nome: 'Complexo', peso: 1, categoria: 0, usosMaximos: 1, usos: 1 },
        3: { nome: 'Especial', peso: 1, categoria: 1, usosMaximos: 1, usos: 1 },
    };

    const handleElementoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        const text = e.target.options[selectedIndex].text;
        setElemento({ value: Number(e.target.value), text });
    };

    const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        const text = e.target.options[selectedIndex].text;
        setPatente({ value: Number(e.target.value), text });
    };

    const adicionar = () => {
        const dadosItem: DadosItem = {
            idTipoItem: 4,
            nomeItem: { nomePadrao: `Componente de ${elemento.text} ${patente.text}` },
            peso: patentes[patente.value].peso,
            categoria: patentes[patente.value].categoria,
            dadosComportamentos: {
                dadosComportamentoEmpunhavel: [true, 1],
                dadosComportamentoUtilizavel: [patentes[patente.value].usosMaximos],
                dadosComportamentoComponente: [elemento.value, patente.value],
            },
        };

        adicionarItem(dadosItem, quantidade);
    }

    return (
        <>
            <div className={style.embrulho_area_item}>
                <div className={style.area_tipo_item}>
                    <h2>Adicionar Componentes</h2>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Elemento'}>
                            <select value={elemento.value} onChange={handleElementoChange}> <option value="0" disabled >Selecionar Elemento</option> {SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))} </select>
                        </InputComRotulo>
                    </div>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Patente'}>
                            <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> {Object.entries(patentes).map(([id, data]) => ( <option key={id} value={id}>{data.nome}</option> ))} </select>
                        </InputComRotulo>
                    </div>

                    <div className={style.opcao_item}>
                        <InputComRotulo rotulo={'Quantidade'}>
                            <InputNumerico min={1} step={1} value={quantidade} onChange={setQuantidade} />
                        </InputComRotulo>
                    </div>

                    <div className={style.descricao_item}>
                        <div>
                            <p>Componentes são Itens utilizados na Execução de Rituais</p>
                            <p>O Elemento do Componente deve ser o mesmo de seu Ritual</p>
                        </div>
                        {patente.value > 0 && (
                            <div>
                                <p>{`Um Componente ${patentes[patente.value].nome} é utilizado na Execução de Rituais de ${patente.value}º Círculo`}</p>
                                <p>{`Tem Categoria ${patentes[patente.value].categoria}, Peso ${patentes[patente.value].peso} e ${patentes[patente.value].usosMaximos} Usos`}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={style.area_botao_tipo_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                <button onClick={adicionar} disabled={elemento.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}

export default page;