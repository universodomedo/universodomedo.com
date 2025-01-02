// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { getDadoFichaPorIdFake } from 'Recursos/DadosFicha.ts';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import Modal from "Components/Modal/page.tsx";
import ModalCriarFicha from './modal.tsx';
// import { useSalaContext } from 'Providers/SalaProvider.tsx';
// #endregion

const page = () => {
    // const {salas, criaSala} = useSalaContext();
    // comitando denovo
    const [dadosFicha, setDadosFicha] = useState<RLJ_Ficha2[]>([]);
    const navigate = useNavigate();

    const limpaLocalStorage = () => {
        const chaveVersaoAtual = 'v2.6';
        const chaveLimpeza = localStorage.getItem("chaveLimpeza");

        if (chaveLimpeza === null || chaveLimpeza !== chaveVersaoAtual) {
            alert('Foram detectadas Fichas Desatualizadas. Elas estarão sendo apagadas para ajustar a versão nova (sorry)')
            localStorage.clear();
            localStorage.setItem("chaveLimpeza", chaveVersaoAtual);
        }
    }

    useEffect(() => {
        limpaLocalStorage();
        localStorage.removeItem("fichaAtual");

        const data = localStorage.getItem("dadosFicha");
        if (data) {
            let convertedData = JSON.parse(data);

            setDadosFicha(convertedData);
        }
    }, []);

    const criaNovaFicha = () => {
        navigate('/edita-ficha');
    }

    const vaiPraFicha = (idFake: number) => {
        const ficha: RLJ_Ficha2 = getDadoFichaPorIdFake(idFake);

        localStorage.setItem('fichaAtual', JSON.stringify(ficha));

        navigate('/ficha-demo');
    }

    const abreFicha2 = (index: number) => {
        localStorage.setItem('fichaAtual', JSON.stringify(dadosFicha[index]));
        navigate('/ficha-demo');
    }

    const abreFicha = (index: number) => {
        localStorage.setItem('fichaAtual', JSON.stringify(dadosFicha[index]));
        navigate('/ficha-demo', { state: { indexFicha: index } });
    }

    const removeFicha = (index: number) => {
        const data = localStorage.getItem('dadosFicha');
        const dadosFicha = data ? JSON.parse(data) : [];

        dadosFicha.splice(index, 1);

        const jsonDadosFicha = JSON.stringify(dadosFicha);

        setDadosFicha(dadosFicha);

        localStorage.setItem('dadosFicha', jsonDadosFicha);
    };

    const abrirShop = (index: number) => {
        navigate('/shop-demo', { state: { indexFicha: index } });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={style.teste_interno}>
            <h1>Fichas Customizadas: {Object.entries(dadosFicha).length}</h1>

            <button className={style.acesso_ficha_nova} onClick={openModal} disabled={Object.entries(dadosFicha).length >= 5}>
                {/* <button className={style.acesso_ficha_nova} onClick={criaNovaFicha} disabled={Object.entries(dadosFicha).length >= 5}> */}
                {Object.entries(dadosFicha).length < 5 ? 'Criar Nova Ficha' : 'Muitas Fichas'}
            </button>

            {dadosFicha && dadosFicha.map((ficha, index) => (
                <div key={index} className={style.ficha_existente}>
                    <div className={style.acesso_ficha_existente} onClick={() => { abreFicha(index) }}>
                        <div className={style.ficha_nome}>{ficha.detalhes!.nome}</div>
                        <div className={style.ficha_detalhes}>
                            <div className={style.ficha_classe}>{SingletonHelper.getInstance().classes.find(classe => classe.id === ficha.detalhes!.idClasse)!.nome}</div>
                            <div className={style.ficha_nex}>{`NEX ${SingletonHelper.getInstance().niveis.find(nivel => nivel.id === ficha.detalhes!.idNivel)!.nomeDisplay}`}</div>
                        </div>
                    </div>
                    <div className={style.ficha_acoes}>
                        <FontAwesomeIcon className={style.remover_ficha} title={'Remover Ficha'} icon={faTrash} onClick={() => { removeFicha(index) }} />
                        <FontAwesomeIcon className={style.remover_ficha} title={'Alterar Inventário'} icon={faShoppingCart} onClick={() => { abrirShop(index) }} />
                    </div>
                </div>
            ))}

            {/* <h1>Fichas Modelo</h1>

            <div className={style.ficha_existente} onClick={() => { vaiPraFicha(1) }}>
                <div className={style.acesso_ficha_existente}>
                    <div className={style.ficha_nome}>Rui</div>
                    <div className={style.ficha_detalhes}>
                        <div className={style.ficha_classe}>Mundano</div>
                        <div className={style.ficha_nex}>NEX 0%</div>
                    </div>
                </div>
            </div>

            <div className={style.ficha_existente} onClick={() => { vaiPraFicha(2) }}>
                <div className={style.acesso_ficha_existente}>
                    <div className={style.ficha_nome}>Zumbi de Sangue</div>
                    <div className={style.ficha_detalhes}>
                        <div className={style.ficha_classe}>Criatura</div>
                        <div className={style.ficha_nex}>NEX 10%</div>
                    </div>
                </div>
            </div>

            <div className={style.ficha_existente} onClick={() => { vaiPraFicha(3) }}>
                <div className={style.acesso_ficha_existente}>
                    <div className={style.ficha_nome}>Ocultista</div>
                    <div className={style.ficha_detalhes}>
                        <div className={style.ficha_classe}>Ocultista</div>
                        <div className={style.ficha_nex}>NEX 15%</div>
                    </div>
                </div>
            </div> */}

            {/* <h1>Salas de Jogo</h1>
            <h2 onClick={criaSala}>Nova Sala</h2>
            {salas.length > 1 ? (
                <>
                    {salas.map((sala, index) => {
                        <h2>Sala 1</h2>
                    })}
                </>
            ): (
                <h2>Não há nenhuma sala disponível</h2>
            )} */}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalCriarFicha />
            </Modal>
        </div>
    );
}

export default page;