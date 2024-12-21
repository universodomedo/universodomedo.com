// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { dadosItem } from 'Types/classes/index.ts';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const [item, setItem] = useState(0);

    const { mudarPagina, adicionarItem } = useContextoLoja();

    const itens: Record<number, { nome: string; peso: number; categoria: number; extremidadesNecessarias: number; danoMin: number; danoMax: number; idAtributoUtilizado: number; idPericiaUtilizada: number; listaDescricoes: string[]; }> = {
        1: { nome: `Arma de Uma Mão Ineficaz`, peso: 3, categoria: 0, extremidadesNecessarias: 1, danoMin: 1, danoMax: 4, idAtributoUtilizado: 2, idPericiaUtilizada: 8, listaDescricoes: ['Dano Mínimo 1, Dano Máximo 4, usado com 1 Extremidadee'] },
        2: { nome: `Arma de Uma Mão Refinada`, peso: 3, categoria: 0, extremidadesNecessarias: 1, danoMin: 1, danoMax: 6, idAtributoUtilizado: 2, idPericiaUtilizada: 8, listaDescricoes: ['Dano Mínimo 1, Dano Máximo 6, usado com 1 Extremidadee'] }
    }

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItem(Number(e.target.value));
    };

    const adicionar = () => {
        const dadosItem: dadosItem = {
            idTipoItem: 1,
            nomeItem: { nomePadrao: itens[item].nome },
            peso: itens[item].peso,
            categoria: itens[item].categoria,
            detalhesItem: { precisaEstarEmpunhado: true },
            detalhesArma: {
                danoMin: itens[item].danoMin,
                danoMax: itens[item].danoMax,
                numeroExtremidadesUtilizadas: itens[item].extremidadesNecessarias,
                idAtributoUtilizado: itens[item].idAtributoUtilizado,
                idPericiaUtilizada: itens[item].idPericiaUtilizada,
            },
            dadosAcoes: [ {
                nomeAcao: 'Realizar Ataque',
                idTipoAcao: 2,
                idCategoriaAcao: 1,
                idMecanica: 6,
                custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] },
                requisitos: [2],
            } ],
        };

        adicionarItem(dadosItem);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Arma</h2>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Arma'}>
                    <select value={item} onChange={handleItemChange}> <option value="0" disabled >Selecionar Arma</option> {Object.entries(itens).map(([id, data]) => ( <option key={id} value={id}>{data.nome}</option> ))} </select>
                </InputComRotulo>
            </div>

            <div className={style.descricao_item}>
                <div>
                    <p>Armas são itens de uso Ofensivo</p>
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