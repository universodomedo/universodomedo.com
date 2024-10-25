import { useState } from "react";
import Modal from "Components/Modal/page.tsx";
import ModeloArma from "Components/SubComponents/ModeloArma/page.tsx";

const page: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        // <>
        //     {tiposArma.length > 0 && (
        //         <div>
        //             <h1>Escolha o Tipo de Arma</h1>
        //             <Dropdown options={tiposArma.map((tipoArma) => ({ id: tipoArma.id, descricao: tipoArma.nome}))} onSelect={(id) => {setSelectedTiposArmaId(id);}} />
        //             {classificacoesArma.length > 0 && (
        //                 <>
        //                     <h1>Escolha a Classificação da Arma</h1>
        //                     <Dropdown options={classificacoesArma.map((classificacaoArma) => ({ id: classificacaoArma.id, descricao: classificacaoArma.nome}))} onSelect={(id) => {setSelectedClassificacoesArmaId(id)}} />
        //                     {patentesArma.length > 0 && (
        //                         <>
        //                             <h1>Escolha a Patente da Arma</h1>
        //                             <Dropdown options={patentesArma.map((patenteArma) => ({ id: patenteArma.patente.id, descricao: patenteArma.patente.nome}))} onSelect={(id) => {setSelectedPatentesArmaId(id)}} />
        //                             {(selectedPatenteArma && detalhesBaseArma) && (
        //                                 <>
        //                                     <h2>Dano: {detalhesBaseArma.dano-detalhesBaseArma.variancia} - {detalhesBaseArma.dano}</h2>
        //                                     <h2>Peso: {selectedPatenteArma.peso}</h2>
        //                                     <h2>Categoria: {selectedPatenteArma.categoria}</h2>
        //                                 </>
        //                             )}
        //                         </>
        //                     )}
        //                 </>
        //             )}
        //         </div>
        //     )}
        // </>
        <>
            <h1>Minha Página Simples</h1>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }}>
                Criar Modelo
            </a>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModeloArma />
            </Modal>
        </>
    )
}

export default page;