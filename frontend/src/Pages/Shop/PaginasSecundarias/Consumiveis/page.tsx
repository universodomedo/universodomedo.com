// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { dadosItem } from 'Types/classes/index.ts';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
import InputNumerico from 'Recursos/ElementosComponentizados/InputNumerico/page.tsx';
// #endregion

const page = () => {
    const [item, setItem] = useState(0);
    const [quantidade, setQuantidade] = useState(1);

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const itens: Record<number, { nome: string; peso: number; categoria: number; usosMaximos: number; usos: number; idBuff: number; valor: number; listaDescricoes: string[]; }> = {
        1: { nome: `Bálsamo de Arnica`, peso: 1, categoria: 0, usosMaximos: 1, usos: 1, idBuff: 33, valor: 2, listaDescricoes: ['O Bálsamo de Arnica aumenta em 2 sua Resistência Mundana para o próximo Ataque Mundano', `Tem Categoria 0, Peso 1 e 1 Uso`] },
        2: { nome: `Gel de Babosa`, peso: 1, categoria: 0, usosMaximos: 1, usos: 1, idBuff: 37, valor: 2, listaDescricoes: ['O Gel de Babosa aumenta em 2 sua Resistência Natural para o próximo Ataque Natural', `Tem Categoria 0, Peso 1 e 1 Uso`] },
        //Ácido Hialurônico Injetável
    }

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItem(Number(e.target.value));
    };

    const adicionar = () => {
        const dadosItem: dadosItem = {
            idTipoItem: 3,
            nomeItem: { nomePadrao: itens[item].nome },
            peso: itens[item].peso,
            categoria: itens[item].categoria,
            detalhesConsumiveis: { usosMaximos: itens[item].usosMaximos, usos: itens[item].usos },
            dadosAcoes: [ {
                nomeAcao: 'Consumir',
                idTipoAcao: 1,
                idCategoriaAcao: 1,
                idMecanica: 3,
                custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                buffs: [ { idBuff: itens[item].idBuff, nome: itens[item].nome, valor: itens[item].valor, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 2, } ],
                requisitos: [2],
            } ],
        };

        adicionarItem(dadosItem, quantidade);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Consumível</h2>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Consumível'}>
                    <select value={item} onChange={handleItemChange}> <option value="0" disabled >Selecionar Consumível</option> {Object.entries(itens).map(([id, data]) => ( <option key={id} value={id}>{data.nome}</option> ))} </select>
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