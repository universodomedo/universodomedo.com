// #region Imports
import style from '../style.module.css';
import { GanhoIndividualNexRitual, Ritual } from 'Classes/ClassesTipos/index.ts';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx'
import { useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faShuffle } from '@fortawesome/free-solid-svg-icons';
// #endregion

const pagina = () => {
    const { mudarPaginaRitual } = useContextoCriaRitual();
    
    const { ganhosNex } = useContextoNexUp();

    const ganhoRitual = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexRitual)!;

    const removeFicha = (indexRitual: number) => {

    }

    return (
        <div className={style.pagina_rituais_visualizacao}>
            {/* <div className={style.rituais_pendentes}>
                <h1>Rituais Pendentes: {ganhoRitual.numeroRituaisPendentes}</h1>
                <button onClick={() => { mudarPaginaRitual(1) }} disabled={ganhoRitual.finalizado}>Criar Ritual</button>
            </div>

            <div className={style.rituais_existentes}>
                <h1>Rituais Criados</h1>
                <div className={style.recipiente_area_rituais_existentes}>
                    {ganhoRitual.dadosRituais?.map((ritual, index) => {
                        const objetoRitual = new Ritual({ dadosGenericosRitual: ritual.dadosRitual.args, dadosComportamentos: ritual.dadosRitual.dadosComportamentos });

                        return (
                            <div key={index} className={style.recipiente_info_ritual}>
                                <div className={style.ritual_existente} style={{borderColor: objetoRitual.comportamentos.comportamentoRitual.refElemento.cores.corPrimaria}}>
                                    <h2>{objetoRitual.nomeExibicao}</h2>
                                    <div className={style.detalhes_ritual_existente}>
                                        <p>{objetoRitual.comportamentos.comportamentoRitual.refElemento.nome}</p>
                                        <p>{objetoRitual.comportamentos.comportamentoRitual.refCirculoNivelRitual.nome}</p>
                                    </div>
                                </div>
                                {ritual.emCriacao && (
                                    <div className={style.acoes_rituais_existentes}>
                                        <FontAwesomeIcon className={style.icones_lixeira} title={'Remover Ritual'} icon={faTrash} onClick={() => { removeFicha(index); }} />
                                        <FontAwesomeIcon className={style.icones_lixeira} title={'Evoluir Ritual'} icon={faPlus} onClick={() => {  }} />
                                        <FontAwesomeIcon className={style.icones_lixeira} title={'Trocar Ritual'} icon={faShuffle} onClick={() => {  }} />
                                    </div>
                                )}
                            </div>                                
                        );
                    })}
                </div>
            </div> */}
        </div>
    );
}

export default pagina;