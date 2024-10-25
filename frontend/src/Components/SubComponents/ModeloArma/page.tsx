// #region Imports
import style from "./style.module.css";
import useApi from "ApiConsumer/Consumer.tsx";
import Dropdown from 'Components/SubComponents/Dropdown/page.tsx';
import { MDL_BaseArma, MDL_ClassificacaoArma, MDL_DetalheBaseArma, MDL_TipoArma, RLJ_BaseArma_Patente_Alcance } from "udm-types";
import { useEffect, useState, useRef } from "react";
import { Arma } from "Types/classes.tsx";
// #endregion

const page = () => {
    const [tiposArma, setTipoArma] = useState<MDL_TipoArma[]>([]);
    const [classificacoesArma, setClassificacoesArma] = useState<MDL_ClassificacaoArma[]>([]);
    const [patentesArma, setPatentesArma] = useState<RLJ_BaseArma_Patente_Alcance[]>([]);
    const [detalhesBaseArma, setDetalhesBaseArma] = useState<MDL_DetalheBaseArma[]>([]);

    const [selectedTipoArma, setSelectedTipoArma] = useState<MDL_TipoArma>({} as MDL_TipoArma);
    const [selectedClassificacaoArma, setSelectedClassificacaoArma] = useState<MDL_ClassificacaoArma>({} as MDL_ClassificacaoArma);
    const [selectedPatenteArma, setSelectedPatenteArma] = useState<RLJ_BaseArma_Patente_Alcance>({} as RLJ_BaseArma_Patente_Alcance);
    const [selectedDetalhesBaseArma, setSelectedDetalhesBaseArma] = useState<MDL_DetalheBaseArma>({} as MDL_DetalheBaseArma);

    const [arma, setArma] = useState<Arma>({} as Arma);

    const dropdownRefTipo = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    const dropdownRefClassificacao = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    const dropdownRefPatente = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    
    useEffect(() => {
        const getInfoArmas = async () => {
            const resultado = await useApi<{tipos:MDL_TipoArma[], classificacoes:MDL_ClassificacaoArma[], bases:RLJ_BaseArma_Patente_Alcance[], detalhes:MDL_DetalheBaseArma[]}>("/armas/getInfoArmas");
            setTipoArma(resultado.tipos);
            setClassificacoesArma(resultado.classificacoes);
            setPatentesArma(resultado.bases);
            setDetalhesBaseArma(resultado.detalhes);
        }
        
        getInfoArmas();
    }, []);

    useEffect(() => {
        if(!detalhesBaseArma) return;

        setSelectedDetalhesBaseArma(detalhesBaseArma.find(detalheBaseArma => detalheBaseArma.idBaseArma === selectedPatenteArma.id)!);
    }, [selectedPatenteArma]);

    useEffect(() => {
        if(!selectedPatenteArma || !selectedDetalhesBaseArma) return;

        setArma(new Arma('Teste', selectedPatenteArma.peso, selectedPatenteArma.categoria!, selectedDetalhesBaseArma.dano, selectedDetalhesBaseArma.variancia));
    }, [selectedDetalhesBaseArma]);

    return (
        <div className={style.wrapper_modal}>
            <h1>Criação de Arma</h1>
            <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Tipo</div>
                <div className={style.info_arma_direita}>
                    <Dropdown ref={dropdownRefTipo} options={tiposArma.map(tipoArma => ({ id: tipoArma.id, descricao: tipoArma.nome}))} onSelect={(id) => {setSelectedTipoArma(tiposArma.find(tipoArma => tipoArma.id === id)!);}} />
                </div>
            </div>
            <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Classificação</div>
                <div className={style.info_arma_direita}>
                    <Dropdown ref={dropdownRefClassificacao} options={classificacoesArma.filter(classificacaoArma => classificacaoArma.idTipoArma === selectedTipoArma.id).map(classificacaoArma => ({ id: classificacaoArma.id, descricao: classificacaoArma.nome}))} onSelect={(id) => {setSelectedClassificacaoArma(classificacoesArma.find(classificacaoArma => classificacaoArma.id === id)!);}} />
                </div>
            </div>
            <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Patente</div>
                <div className={style.info_arma_direita}>
                    <Dropdown ref={dropdownRefPatente} options={patentesArma.filter(patentesArma => patentesArma.idClassificacaoArma === selectedClassificacaoArma.id).map(patentesArma => ({ id: patentesArma.patente.id, descricao: patentesArma.patente.nome}))} onSelect={(id) => {setSelectedPatenteArma(patentesArma.find(patentesArma => patentesArma.patente.id === id && patentesArma.idClassificacaoArma === selectedClassificacaoArma.id)!);}} />
                </div>
            </div>
            {/* <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Peso</div>
                <div className={style.info_arma_direita}>{selectedPatenteArma.patente ? selectedPatenteArma.peso : "-"}</div>
            </div>
            <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Categoria</div>
                <div className={style.info_arma_direita}>{selectedPatenteArma.patente ? selectedPatenteArma.categoria : "-"}</div>
            </div>
            <div className={style.info_arma}>
                <div className={style.info_arma_esquerda}>Dano</div>
                <div className={style.info_arma_direita}>{selectedDetalhesBaseArma ? `${selectedDetalhesBaseArma.dano-selectedDetalhesBaseArma.variancia} - ${selectedDetalhesBaseArma.dano}` : "-"}</div>
            </div> */}
            <hr/>
            <h1>Arma</h1>
            {arma && (
                <>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Nome</div>
                        <div className={style.info_arma_direita}>{arma.nome}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Peso</div>
                        <div className={style.info_arma_direita}>{arma.peso}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Categoria</div>
                        <div className={style.info_arma_direita}>{arma.categoria}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Dano</div>
                        <div className={style.info_arma_direita}>{arma.dano}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Variância</div>
                        <div className={style.info_arma_direita}>{arma.variancia}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>Características</div>
                        <div className={style.info_arma_direita}>{arma.caracteristicas?.join(', ')}</div>
                    </div>
                </>
            )}
        </div>
    )
}

export default page;