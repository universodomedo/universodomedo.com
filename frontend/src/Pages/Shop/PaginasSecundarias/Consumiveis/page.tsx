// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';

import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
// #endregion

const page = () => {
    const { mudarPagina } = usePagina();
    
    return (
        <div className={style.area_tipo_item}>
            <h2>Adicionar Consumível</h2>

            <InputComRotulo rotulo={'Consumível'}>
                <select value={consumivel} onChange={handleConsumivelChange}> <option value="0" disabled >Selecionar Consumível</option> <option key={1} value={1}>Bálsamo de Arnica</option><option key={2} value={2}>Gel de Babosa</option><option key={3} value={3}>Ácido Hialurônico Injetável</option> </select>
            </InputComRotulo>

            <div className={style.area_botao_tipo_item}>
                <button onClick={voltaParaPaginaInicial}>Voltar</button>
                <button onClick={adicionar} disabled={consumivel === 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </div>
    );
}

export default page;