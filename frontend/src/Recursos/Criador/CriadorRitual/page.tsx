// #region Imports
import { ArgsRitual, Pericia } from 'Types/classes/index.ts';
import style from './style.module.css';

import { useState } from 'react';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = ({ onCreate }: { onCreate: (novoRitual: ArgsRitual) => void; }) => {
    const [idElementoSelecionado, setIdElementoSelecionado] = useState(0);
    const handleSelectChangeElemento = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdElementoSelecionado(Number(event.target.value));
    };

    const [idNivelSelecionado, setIdNivelSelecionado] = useState(0);
    const handleSelectChangeNivel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdNivelSelecionado(Number(event.target.value));
    };

    const [idPericiaSelecionada, setIdPericiaSelecionada] = useState(0);
    const handleSelectChangePericia = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdPericiaSelecionada(Number(event.target.value));
    };

    const pericias = SingletonHelper.getInstance().pericias;
    const periciaSelecionada: Pericia | undefined = idElementoSelecionado > 0 && idNivelSelecionado > 0 && idPericiaSelecionada > 0 ? pericias.find(pericia => pericia.id === idPericiaSelecionada) : undefined;

    const criaRitual = (): ArgsRitual => {
        const valorPE: number = { 1: 2, 2: 3, 3: 5 }[idNivelSelecionado] || 0;
        const valorBuff: number = { 1: 2, 2: 3, 3: 4 }[idNivelSelecionado] || 0;

        return {
            args: { nome: `Aprimorar ${periciaSelecionada?.nome}`, },
            dadosComportamentos: {
                dadosComportamentoRitual: [idElementoSelecionado, idNivelSelecionado],
            },
            dadosAcoes: [ {
                args: {nome: 'Usar Ritual', idTipoAcao: 3, idMecanica: 3,},
                dadosComportamentos: {},
                custos: { custoPE: { valor: valorPE }, custoExecucao: [{ idExecucao: 2, valor: 1 }], custoComponente: true },
                modificadores: [
                    {
                        props: {
                            nome: `Aprimorar ${periciaSelecionada?.nome}`,
                            idDuracao: 3,
                            quantidadeDuracaoMaxima: 1,
                            dadosEfeitos: [
                                {
                                    idLinhaEfeito: periciaSelecionada?.refLinhaEfeito.id!,
                                    idTipoEfeito: 3,
                                    dadosValoresEfeitos: { valorBonusAdicional: valorBuff },
                                },
                            ],
                            dadosComportamentos: { dadosComportamentoAtivo: [] },
                        }
                    }
                ],
                requisitos: [1],
            } ]
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
                <select value={idElementoSelecionado} onChange={handleSelectChangeElemento}>
                    <option value={0} disabled >Selecionar Elemento</option>
                    {SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))}
                </select>
            </div>
            <div className={style.criador_ritual_particao}>
                <h2>Nivel</h2>
                <select value={idNivelSelecionado} onChange={handleSelectChangeNivel}>
                    <option value={0} disabled >Selecionar Nivel</option>
                    {SingletonHelper.getInstance().circulos_niveis_ritual.filter(circulo_nivel_ritual => circulo_nivel_ritual.idCirculo === 1).map(circulo_nivel_ritual => (<option key={circulo_nivel_ritual.id} value={circulo_nivel_ritual.id}>{circulo_nivel_ritual.nome}</option>))}
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
                <select value={idPericiaSelecionada} onChange={handleSelectChangePericia}>
                    <option value={0} disabled >Selecionar Perícia</option>
                    {pericias.map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.nome}</option>))}
                </select>
            </div>

            <button onClick={handleCreate} disabled={!(idElementoSelecionado > 0 && idNivelSelecionado > 0 && idPericiaSelecionada! > 0)}>Criar</button>
        </div>
    );
}

export default page;