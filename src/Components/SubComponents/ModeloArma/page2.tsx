// #region Imports
import style from "./style.module.css";
import useApi from "ApiConsumer/Consumer.tsx";
import Dropdown from 'Components/SubComponents/Dropdown/page.tsx';
import { MDL_BaseArma, MDL_ClassificacaoArma, MDL_DetalheBaseArma, MDL_TipoArma, RLJ_BaseArma_Patente } from "udm-types";
import { useEffect, useState, useRef } from "react";
// #endregion

const page = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const [tiposArma, setTipoArma] = useState<MDL_TipoArma[]>([]);
    const [classificacoesArma, setClassificacoesArma] = useState<MDL_ClassificacaoArma[]>([]);
    const [patentesArma, setPatentesArma] = useState<RLJ_BaseArma_Patente[]>([]);
    const [detalhesBaseArma, setDetalhesBaseArma] = useState<MDL_DetalheBaseArma[]>([]);

    const [selectedTipoArma, setSelectedTipoArma] = useState<MDL_TipoArma>({} as MDL_TipoArma);
    const [selectedClassificacaoArma, setSelectedClassificacaoArma] = useState<MDL_ClassificacaoArma>({} as MDL_ClassificacaoArma);
    const [selectedPatenteArma, setSelectedPatenteArma] = useState<RLJ_BaseArma_Patente>({} as RLJ_BaseArma_Patente);
    const [selectedDetalhesBaseArma, setSelectedDetalhesBaseArma] = useState<MDL_DetalheBaseArma>({} as MDL_DetalheBaseArma);

    const dropdownRefTipo = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    const dropdownRefClassificacao = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    const dropdownRefPatente = useRef<{ getSelectedOption: () => { id: number; descricao: string }, clearSelection: () => {}}>(null);
    
    useEffect(() => {
        const getInfoArmas = async () => {
            const resultado = await useApi<{tipos:MDL_TipoArma[], classificacoes:MDL_ClassificacaoArma[], bases:RLJ_BaseArma_Patente[], detalhes:MDL_DetalheBaseArma[]}>("/armas/getInfoArmas");
            setTipoArma(resultado.tipos);
            setClassificacoesArma(resultado.classificacoes);
            setPatentesArma(resultado.bases);
            setDetalhesBaseArma(resultado.detalhes);
        }
        getInfoArmas();
    }, []);

    const nextStep = () => {
        if (currentStep < 4) {
            setDirection('next');
            setCurrentStep(currentStep + 1);
        }
    };
    
    const prevStep = () => {
        if (currentStep > 1) {
            setDirection('prev');
            setCurrentStep(currentStep - 1);
        }
    };

    const jumpStep = (idNextStep:number) => {
        if (currentStep < idNextStep) {
            setDirection('next');
        } else {
            setDirection('prev');
        }
        setCurrentStep(idNextStep);
    }

    useEffect(() => {
        if(currentStep === 1) {
            setSelectedTipoArma({} as MDL_TipoArma); dropdownRefTipo.current?.clearSelection();
            setSelectedClassificacaoArma({} as MDL_ClassificacaoArma); dropdownRefClassificacao.current?.clearSelection();
            setSelectedPatenteArma({} as RLJ_BaseArma_Patente); dropdownRefPatente.current?.clearSelection();
            setSelectedDetalhesBaseArma({} as MDL_DetalheBaseArma);
        }
        if(currentStep === 2) {
            setSelectedClassificacaoArma({} as MDL_ClassificacaoArma); dropdownRefClassificacao.current?.clearSelection();
            setSelectedPatenteArma({} as RLJ_BaseArma_Patente); dropdownRefPatente.current?.clearSelection();
            setSelectedDetalhesBaseArma({} as MDL_DetalheBaseArma);
        }
        if(currentStep === 3) {
            setSelectedPatenteArma({} as RLJ_BaseArma_Patente); dropdownRefPatente.current?.clearSelection();
            setSelectedDetalhesBaseArma({} as MDL_DetalheBaseArma);
        }
    }, [currentStep]);

    useEffect(() => {
        if(!detalhesBaseArma) return;

        setSelectedDetalhesBaseArma(detalhesBaseArma.find(detalheBaseArma => detalheBaseArma.idBaseArma === selectedPatenteArma.id)!);
    }, [selectedPatenteArma]);

    const getStepClass = (step:number) => {
        if (step === currentStep) {
            return `${style.step} ${style.step_active}`;
        } else if (step < currentStep) {
            return `${style.step} ${direction === 'next' ? style.slide_out_left : style.slide_in_left}`;
        } else {
            return `${style.step} ${direction === 'next' ? style.slide_in_right : style.slide_out_right}`;
        }
    };

    return (
        <div className={style.wrapper_modal}>
            <div className={style.conteudo_esquerda}>
                <div className={getStepClass(1)}>
                    <h1>Escolha o Tipo de Arma</h1>
                    <Dropdown ref={dropdownRefTipo} options={tiposArma.map(tipoArma => ({ id: tipoArma.id, descricao: tipoArma.nome}))} onSelect={(id) => {setSelectedTipoArma(tiposArma.find(tipoArma => tipoArma.id === id)!); nextStep();}} />
                </div>
                <div className={getStepClass(2)}>
                    <h1>Escolha a Classificação da Arma</h1>
                    <Dropdown ref={dropdownRefClassificacao} options={classificacoesArma.filter(classificacaoArma => classificacaoArma.idTipoArma === selectedTipoArma.id).map(classificacaoArma => ({ id: classificacaoArma.id, descricao: classificacaoArma.nome}))} onSelect={(id) => {setSelectedClassificacaoArma(classificacoesArma.find(classificacaoArma => classificacaoArma.id === id)!); nextStep();}} />
                </div>
                <div className={getStepClass(3)}>
                    <h1>Escolha a Patente da Arma</h1>
                    <Dropdown ref={dropdownRefPatente} options={patentesArma.filter(patentesArma => patentesArma.idClassificacaoArma === selectedClassificacaoArma.id).map(patentesArma => ({ id: patentesArma.patente.id, descricao: patentesArma.patente.nome}))} onSelect={(id) => {setSelectedPatenteArma(patentesArma.find(patentesArma => patentesArma.patente.id === id && patentesArma.idClassificacaoArma === selectedClassificacaoArma.id)!);}} />
                </div>
            </div>
            <div className={style.conteudo_direita}>
                <div className={style.direita_visualizador_arma}></div>
                <div className={style.direita_info_arma}>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>
                            <a href="#" onClick={() => {jumpStep(1)}}>
                                Tipo
                            </a>
                        </div>
                        <div className={style.info_arma_direita}>{selectedTipoArma.nome ?? "-"}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>
                            <a href="#" onClick={() => {jumpStep(2)}}>
                                Classificação
                            </a>
                        </div>
                        <div className={style.info_arma_direita}>{selectedClassificacaoArma.nome ?? "-"}</div>
                    </div>
                    <div className={style.info_arma}>
                        <div className={style.info_arma_esquerda}>
                            <a href="#" onClick={() => {jumpStep(3)}}>
                                Patente
                            </a>
                        </div>
                        <div className={style.info_arma_direita}>{selectedPatenteArma.patente ? selectedPatenteArma.patente.nome : "-"}</div>
                    </div>
                    <div className={style.info_arma}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page;