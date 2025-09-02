'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import { useCache } from 'Redux/hooks/useCache';
import { DetalheRascunhoSessaoUnicaDto, DificuldadeSessaoDto, NivelDto, RascunhoDto, TipoSessaoDto } from 'types-nora-api';

export function ModalEditarRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={ { titulo: `Editando Rascunho`, subtitulo: rascunho.titulo } }>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { niveis, dificuldadesSessao, tiposSessao } = useCache();
    const { salvaDetalhesRascunho, rascunho } = useContextoRascunho();

    const [numeroJogadoresMin, setNumeroJogadoresMin] = useState(1);
    const [numeroJogadoresMax, setNumeroJogadoresMax] = useState(1);

    useEffect(() => {
        if (numeroJogadoresMax < numeroJogadoresMin) setNumeroJogadoresMax(numeroJogadoresMin);
    }, [numeroJogadoresMin]);

    const [idNivelSelecionado, setIdNivelSelecionado] = useState(0);
    const handleNivelChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setIdNivelSelecionado(Number(e.target.value)); };

    const [idDificuldadeSelecionado, setIdDificuldadeSelecionada] = useState(0);
    const handleDificuldadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setIdDificuldadeSelecionada(Number(e.target.value)); };

    const [idTipoSelecionado, setIdTipoSelecionada] = useState(0);
    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setIdTipoSelecionada(Number(e.target.value)); };

    const handleSalvar = () => {
        salvaDetalhesRascunho({
            rascunho: { id: rascunho.id } as RascunhoDto,
            tipoSessao: { id: idTipoSelecionado } as TipoSessaoDto,
            dificuldadeSessao: { id: idDificuldadeSelecionado } as DificuldadeSessaoDto,
            nivelPersonagem: { id: idNivelSelecionado } as NivelDto,
            descricao: 'AAAAAAAAteste',
            numeroMinimoJogadores: numeroJogadoresMin,
            numeroMaximoJogadores: numeroJogadoresMax,
        } as DetalheRascunhoSessaoUnicaDto);
    };
    
    return (
        <div id={styles.recipiente_corpo_modal_edita_rascunho}>
            <InputComRotulo rotulo={'Número de Jogadores'}>
                <InputNumerico min={1} step={1} value={numeroJogadoresMin} onChange={setNumeroJogadoresMin} />
                <InputNumerico min={numeroJogadoresMin} step={1} value={numeroJogadoresMax} onChange={setNumeroJogadoresMax} />
            </InputComRotulo>

            <InputComRotulo rotulo={'Grau de Ex.P. dos Personangens'}>
                <select value={idNivelSelecionado} onChange={handleNivelChange}>
                    <option value="0" disabled >Selecionar Nível dos Personagens</option>
                    {niveis!.map(nivel => (<option key={nivel.id} value={nivel.id}>{nivel.nomeVisualizacao}</option>))}
                </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Dificuldade da Sessão'}>
                <select value={idDificuldadeSelecionado} onChange={handleDificuldadeChange}>
                    <option value="0" disabled >Selecionar Dificuldade da Sessão</option>
                    {dificuldadesSessao!.map(dificuldade => (<option key={dificuldade.id} value={dificuldade.id}>{dificuldade.descricao}</option>))}
                </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Tipo de Sessão'}>
                <select value={idTipoSelecionado} onChange={handleTipoChange}>
                    <option value="0" disabled >Selecionar Tipo de Sessão</option>
                    {tiposSessao!.map(tipo => (<option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>))}
                </select>
            </InputComRotulo>

            <InputComRotulo rotulo={'Descrição'}>
                <input type={'text'} />
            </InputComRotulo>

            <button onClick={handleSalvar}>Teste</button>
        </div>
    );
};