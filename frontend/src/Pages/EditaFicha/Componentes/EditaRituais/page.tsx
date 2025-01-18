// #region Imports
import style from './style.module.css';

import { useState } from 'react';
import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { ArgsRitual, GanhoIndividualNexRitual } from 'Types/classes/index.ts';

import CriadorRitual from 'Recursos/Criador/CriadorRitual/page.tsx';

import Modal from "Components/Modal/page.tsx";
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const ganhoRitual = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexRitual)!;

    const handleRitualCreated = (novoRitual: ArgsRitual) => {
        ganhoRitual.dadosRituais.push(novoRitual);
        closeModal();
        atualizarFicha();
    };

    return (
        <div className={style.atributo_contadores}>
            {/* <h1>Rituais Pendentes: {ganhoRitual.numeroRituais - ganhoRitual.dadosRituais.length}</h1>

            <h1>Rituais Criados:</h1>
            {ganhoRitual.dadosRituais.length > 0 ? (
                <div>
                    <ul>
                        {ganhoRitual.dadosRituais.map((ritual, index) => (
                            <li key={index}>{ritual.args.nome}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Nenhum Ritual foi criado!</p>
            )}

            <button onClick={openModal} disabled={ganhoRitual.finalizado}>Criar Ritual</button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CriadorRitual onCreate={handleRitualCreated}/>
            </Modal> */}
        </div>
    );
}

export default page;