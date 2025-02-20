// #region Imports
import style from 'Paginas/Loja/style.module.css';
import { useState } from 'react';

import { DadosItemSemIdentificador } from 'Classes/ClassesTipos';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
import InputNumerico from 'Componentes/ElementosComponentizados/InputNumerico/pagina.tsx';
// #endregion

const pagina = () => {
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
        const dadosItem: DadosItemSemIdentificador = {
            idTipoItem: 4,
            dadosNomeCustomizado: { nomePadrao: `Componente de ${elemento.text} ${patente.text}` },
            peso: patentes[patente.value].peso,
            categoria: patentes[patente.value].categoria,
            dadosComportamentoEmpunhavel: { dadosCustoEmpunhar: [ { idExecucao: 3, quantidadeExecucoes: 1 } ], extremidadesNecessarias: 1, },
            dadosComportamentoComponenteRitualistico: { idElemento: elemento.value, idNivelComponente: patente.value, numeroDeCargasMaximo: patentes[patente.value].usosMaximos, numeroDeCargasAtuais: patentes[patente.value].usos, },
        };

        adicionarItem(dadosItem, quantidade);
    };

    return (
        <>
            <div className={style.recipiente_area_item}>
                <div className={style.recipiente_conteudo_tipo_item}>
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
            <div className={style.recipiente_botoes_area_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                <button onClick={adicionar} disabled={elemento.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}

export default pagina;