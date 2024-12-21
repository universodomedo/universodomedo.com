// #region Imports
import { dadosRitual, Pericia } from 'Types/classes/index.ts';
import style from './style.module.css';

import { useState } from 'react';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = ({ onCreate }: { onCreate: (novoRitual: dadosRitual) => void; }) => {
    const [elementoSelecionado, setElementoSelecionado] = useState(0);
    const handleSelectChangeElemento = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setElementoSelecionado(Number(event.target.value));
    };

    const [nivelSelecionado, setNivelSelecionado] = useState(0);
    const handleSelectChangeNivel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNivelSelecionado(Number(event.target.value));
    };

    const [periciaSelecionada, setPericiaSelecionada] = useState<Pericia>();
    const handleSelectChangePericia = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPericiaSelecionada(pericias.find(pericia => pericia.id === Number(event.target.value)));
    };

    const pericias = SingletonHelper.getInstance().pericias;

    const criaRitual = (): dadosRitual => {
        const valorPE: number = { 1: 2, 2: 3, 3: 5 }[nivelSelecionado] || 0;
        const valorBuff: number = { 1: 2, 2: 3, 3: 4 }[nivelSelecionado] || 0;

        return {
            nomeRitual: `Aprimorar ${periciaSelecionada?.nome}`, idCirculoNivel: nivelSelecionado, idElemento: elementoSelecionado, dadosAcoes: [
                {
                    nomeAcao: 'Usar Ritual', idTipoAcao: 3, idCategoriaAcao: 1, idMecanica: 3,
                    custos: { custoPE: { valor: valorPE }, custoExecucao: [{ idExecucao: 2, valor: 1 }], custoComponente: true },
                    buffs: [{ idBuff: periciaSelecionada?.idBuffRelacionado!, nome: `Aprimorar ${periciaSelecionada?.nome}`, valor: valorBuff, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 }],
                    requisitos: [1],
                }
            ]
        }
    }

    const handleCreate = () => {
        const novoRitual = criaRitual();
        onCreate(novoRitual);
    };

    return (
        <div className={style.modal_criacao_ritual}>
            <h1>Novo Ritual</h1>
            <div className={style.criador_ritual_particao}>
                <h2>Elemento</h2>
                <select value={elementoSelecionado} onChange={handleSelectChangeElemento}>
                    <option value={0} disabled >Selecionar Elemento</option>
                    {SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}> {elemento.nome} </option>))}
                </select>
            </div>
            <div className={style.criador_ritual_particao}>
                <h2>Nivel</h2>
                <select value={nivelSelecionado} onChange={handleSelectChangeNivel}>
                    <option value={0} disabled >Selecionar Nivel</option>
                    {SingletonHelper.getInstance().circulos_niveis_ritual.filter(circulo_nivel_ritual => circulo_nivel_ritual.idCirculo === 1).map(circulo_nivel_ritual => (<option key={circulo_nivel_ritual.id} value={circulo_nivel_ritual.id}> {circulo_nivel_ritual.nome} </option>))}
                </select>
            </div>
            <div className={style.criador_ritual_particao}>
                <h2>Tipo</h2>
                <select value={0} onChange={handleSelectChangeNivel} disabled>
                    <option value={0} disabled>Ritual de Perícia</option>
                </select>
            </div>
            <div className={style.criador_ritual_particao}>
                <h2>Pericia</h2>
                <select value={periciaSelecionada?.id} onChange={handleSelectChangePericia}>
                    {pericias.map(pericia => (<option key={pericia.id} value={pericia.id}> {pericia.nome} </option>))}
                </select>
            </div>

            <button onClick={handleCreate} disabled={!(elementoSelecionado > 0 && nivelSelecionado > 0 && periciaSelecionada?.id! > 0)}>Criar</button>
        </div>
    );
}

export default page;