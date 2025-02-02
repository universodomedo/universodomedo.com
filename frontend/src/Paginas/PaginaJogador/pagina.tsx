// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from 'Componentes/ModalDialog/pagina.tsx';
import { criaFichaERetornaIndexInserido } from 'Dados/novaFicha.ts';
// #endregion

const pagina = () => {
    const navigate = useNavigate();
    const [dadosFicha, setDadosFicha] = useState<RLJ_Ficha2[]>([]);

    const limpaLocalStoragePorDesatualizacao = () => {
        const chaveVersaoAtual = 'v2.7';
        const chaveLimpeza = localStorage.getItem("chaveLimpeza");

        if (chaveLimpeza === null || chaveLimpeza !== chaveVersaoAtual) {
            alert('Versão Desatualizada Detectada. Fichas criadas previamente estarão sendo apagadas para ajustar a versão nova (sorry)');
            localStorage.clear();
            localStorage.setItem("chaveLimpeza", chaveVersaoAtual);
        }
    }

    useEffect(() => {
        limpaLocalStoragePorDesatualizacao();

        const data = localStorage.getItem("dadosFicha");
        if (data) {
            let convertedData = JSON.parse(data);

            setDadosFicha(convertedData);
        }
    }, []);

    const abreFicha = (index: number) => {
        // localStorage.setItem('fichaAtual', JSON.stringify(dadosFicha[index]));
        const dadosFicha = '';

        navigate('/ficha', { state: { indexFicha: index } });
        // navigate('/ficha-demo', { state: { indexFicha: index } });
    }

    const removeFicha = (index: number) => {
        const data = localStorage.getItem('dadosFicha');
        const dadosFicha = data ? JSON.parse(data) : [];

        dadosFicha.splice(index, 1);

        const jsonDadosFicha = JSON.stringify(dadosFicha);

        setDadosFicha(dadosFicha);

        localStorage.setItem('dadosFicha', jsonDadosFicha);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    return (
        <div id={style.portal_jogador}>
            <div id={style.portal_jogador_esquerda}>
                <div id={style.barra_jogador}>
                    <h1>Visitante</h1>
                </div>

                <div id={style.notificacoes_jogador}>
                    <h1>Fichas Customizadas: {Object.entries(dadosFicha).length}</h1>

                    <button className={style.acesso_ficha_nova} onClick={openModal} disabled={Object.entries(dadosFicha).length >= 5}>{Object.entries(dadosFicha).length < 5 ? 'Criar Nova Ficha' : 'Muitas Fichas'}</button>

                    {dadosFicha && dadosFicha.map((ficha, index) => {
                        const pendente: boolean = ficha.pendencias ? ficha.detalhes!.idNivel < ficha.pendencias.idNivelEsperado : false;

                        return (
                            <div key={index} className={`${style.ficha_existente} ${pendente ? style.ficha_pendente : ''}`}>
                                <div className={style.acesso_ficha_existente} onClick={() => { abreFicha(index) }}>
                                    <div className={style.ficha_nome}>{ficha.detalhes!.nome}</div>
                                    <div className={style.ficha_detalhes}>
                                        <div className={style.ficha_classe}>{SingletonHelper.getInstance().classes.find(classe => classe.id === ficha.detalhes!.idClasse)!.nome}</div>
                                        <div className={style.ficha_nex}>{ficha.detalhes!.idNivel > 0 ? `NEX ${SingletonHelper.getInstance().niveis.find(nivel => nivel.id === ficha.detalhes!.idNivel)!.nomeDisplay}` : `-`}</div>
                                    </div>
                                </div>
                                <div className={style.ficha_acoes}>
                                    <div className={style.ficha_acoes_coluna}>
                                        <FontAwesomeIcon className={style.icones_ficha} title={'Remover Ficha'} icon={faTrash} onClick={() => { removeFicha(index); }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div id={style.portal_jogador_direita}>

            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content title={'Novo Personagem'}>
                    <ModalNovoPersonagem />
                </Modal.Content>
            </Modal>
        </div>
    );
}

const ModalNovoPersonagem = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [idNexSelecionado, setIdNexSelecionado] = useState(0);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdNexSelecionado(Number(event.target.value));
    };

    const criaNovaFichaComNexEspecifico = () => {
        const indexFicha = criaFichaERetornaIndexInserido(inputValue, idNexSelecionado);
        navigate('/ficha', { state: { indexFicha: indexFicha } });
    }

    return (
        <div className={style.modal_criacao_ficha}>
            <input type='text' placeholder='Nome do Personagem' value={inputValue} onChange={handleInputChange} autoFocus />
            <select id="selectNex" value={idNexSelecionado} onChange={handleSelectChange}>
                <option value="0" disabled >Selecionar NEX</option>
                {SingletonHelper.getInstance().niveis.filter(nivel => nivel.id <= 9).map(nivel => (<option key={nivel.id} value={nivel.id}>{nivel.nomeDisplay}</option>))}
            </select>
            <button onClick={criaNovaFichaComNexEspecifico} disabled={!inputValue || !idNexSelecionado}>Confirmar</button>
        </div>
    );
}

export default pagina;