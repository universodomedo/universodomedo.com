// #region Imports
import style from 'Pages/Shop/style.module.css';
import { useState } from 'react';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
import InputNumerico from 'Recursos/ElementosComponentizados/InputNumerico/page.tsx';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = () => {
    const [elemento, setElemento] = useState({ value: 0, text: '' });
    const [patente, setPatente] = useState({ value: 0, text: '' });
    const [quantidade, setQuantidade] = useState(1);

    const { mudarPagina, adicionarItem } = useContextoLoja();

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
        const dadosItem: dadosItem = {
            idTipoItem: 4,
            nomeItem: { nomePadrao: `Componente de ${elemento.text} ${patente.text}` },
            peso: 1,
            categoria: 0,
            detalhesComponente: { idElemento: elemento.value, idNivelComponente: patente.value, usosMaximos: 2, usos: 2 }
        }

        adicionarItem(dadosItem, quantidade);
    }

    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Componentes</h2>

            <InputComRotulo rotulo={'Elemento'}>
                <select value={elemento.value} onChange={handleElementoChange}> <option value="0" disabled >Selecionar Elemento</option> {SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))} </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Patente'}>
                <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Quantidade'}>
                <InputNumerico min={1} step={1} value={quantidade} onChange={setQuantidade} />
            </InputComRotulo>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
                <button onClick={adicionar} disabled={elemento.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;