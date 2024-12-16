// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = () => {
    const { mudarPagina } = usePagina();
    
    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Vestimentas</h2>

            <InputComRotulo rotulo={'Perícia'}>
                <select value={pericia.value} onChange={handlePericiaChange}> <option value="0" disabled >Selecionar Perícia</option> {SingletonHelper.getInstance().pericias.sort((a, b) => a.nome.localeCompare(b.nome)).map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.nome}</option>))} </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Patente'}>
                <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
            </InputComRotulo>

            <div className={style.area_botao_tipo_item}>
                <button onClick={voltaParaPaginaInicial}>Voltar</button>
                <button onClick={adicionar} disabled={pericia.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;