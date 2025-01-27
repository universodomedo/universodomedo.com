// #region Imports
import style from '../style.module.css';
import { useEffect, useState } from 'react';

import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';

import InputComRotulo from 'Componentes/ElementosComponentizados/InputComRotulo/pagina.tsx';
// #endregion

const pagina = () => {
    const { selecionaElemento, elementoSelecionado, selecionaNivel, nivelSelecionado, opcoesNivelRitual, opcoesTipoRitual, mudarPaginaTipoRitual, paginaTipoRitualAberta } = useContextoCriaRitual();

    const idElementoSelecionado = elementoSelecionado?.id || 0;
    const idNivelSelecionado = nivelSelecionado?.id || 0;

    const handleSelectChangeElemento = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selecionaElemento(Number(event.target.value));
        selecionaNivel(0);
        setIdTipoSelecionado(0);
    };

    const handleSelectChangeNivel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selecionaNivel(Number(event.target.value));
        setIdTipoSelecionado(0);
    };

    const [idTipoSelecionado, setIdTipoSelecionado] = useState(0);
    const handleSelectChangeTipo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdTipoSelecionado(Number(event.target.value));
    };

    useEffect(() => {
        mudarPaginaTipoRitual(idTipoSelecionado);
    }, [idTipoSelecionado])

    return (
        <>
            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Elemento do Ritual'}>
                    <select style={{width:'100%'}} value={idElementoSelecionado} onChange={handleSelectChangeElemento}><option value={0} disabled>Selecionar Elemento</option>{SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))}</select>
                </InputComRotulo>
            </div>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Nível do Ritual'}>
                    <select style={{width:'100%'}} value={idNivelSelecionado} onChange={handleSelectChangeNivel} disabled={idElementoSelecionado === 0}><option value={0} disabled>Selecionar Nível</option>{opcoesNivelRitual.map(opcao => (<option key={opcao.circuloNivelRitual.id} value={opcao.circuloNivelRitual.id} disabled={opcao.desabilitado}>{opcao.circuloNivelRitual.nome}</option>))}</select>
                </InputComRotulo>
            </div>

            <div className={style.opcao_item}>
                <InputComRotulo rotulo={'Tipo de Ritual'}>
                    <select style={{width:'100%'}} value={idTipoSelecionado} onChange={handleSelectChangeTipo} disabled={idNivelSelecionado === 0}><option value={0} disabled>Selecionar Tipo</option>{opcoesTipoRitual.map(opcao => (<option key={opcao.id} value={opcao.id}>{opcao.texto}</option>))}</select>
                </InputComRotulo>
            </div>

            {paginaTipoRitualAberta && (
                <div className={style.recipiente_construcao_ritual}>
                    {paginaTipoRitualAberta}
                </div>
            )}
        </>
    );
}

export default pagina;