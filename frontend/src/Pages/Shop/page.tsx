// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { dadosItens, RLJ_Ficha2 } from 'Types/classes/index.ts';

import { useNavigate, useLocation } from 'react-router-dom';

import Modal from "Components/Modal/page.tsx";
import ModalAdicionarItem from './modal.tsx';
// #endregion

const page = () => {
    const [_, setState] = useState({});
    const location = useLocation();
    const indexFicha = location.state?.indexFicha;
    const [fichaAtual, setFichaAtual] = useState<RLJ_Ficha2>();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        atualizaInventario();
    }, []);

    const atualizaInventario = () => {
        const dadosFicha = localStorage.getItem('dadosFicha');

        const ficha: RLJ_Ficha2 = (() => {
            const parsed = JSON.parse(dadosFicha!);
            return parsed[indexFicha] as RLJ_Ficha2;
        })();

        setFichaAtual(ficha);
    };

    const adicionarItem = (dadosItens: dadosItens) => {
        const fichaAtualTeste = fichaAtual;
        if (fichaAtualTeste!.inventario === undefined) fichaAtualTeste!.inventario = [];

        fichaAtualTeste?.inventario.push(dadosItens);

        setFichaAtual(fichaAtualTeste);
        setState({});
        closeModal();
    };

    const salvarInventario = () => {
        const dadosFicha = localStorage.getItem('dadosFicha');
        
        const fichas: RLJ_Ficha2[] = (() => {
            const parsed = JSON.parse(dadosFicha!);
            return parsed as RLJ_Ficha2[];
        })();
        
        fichas[indexFicha].inventario = fichaAtual!.inventario;
        localStorage.setItem('dadosFicha', JSON.stringify(fichas));

        navigate('/pagina-interna')
    };

    return (
        <div className={style.shopping}>
            <h1>Shopping</h1>

            <h2>Inventário Atual</h2>
            {fichaAtual?.inventario ? (
                <div className={style.inventario_atual}>
                    {fichaAtual.inventario.map((item, index) => (
                        <h3 key={index}>{item.nomeItem.nomePadrao}</h3>
                    ))}
                </div>
            ): (
                <h3>Inventário Vazio!</h3>
            )}

            <button onClick={openModal}>Adicionar Item</button>
            <button onClick={salvarInventario}>Salvar</button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalAdicionarItem onCreate={adicionarItem} />
            </Modal>
        </div>
    );
}

export default page;