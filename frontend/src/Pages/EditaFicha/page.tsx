// #region Imports
import style from './style.module.css';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

const page = () => {
    const navigate = useNavigate();

    const [atributos, setAtributos] = useState(SingletonHelper.getInstance().atributos.map((atributo) => ({ idAtributo: atributo.id, nomeAbrev: atributo.nomeAbrev, valor: 1 })));
    const [pericias, setPericias] = useState(SingletonHelper.getInstance().pericias.map((pericia) => ({ idPericia: pericia.id, nomeAbrev: pericia.nomeAbrev, valor: 1 })));
    const [inputValue, setInputValue] = useState('');

    const [numeroInicialAtributos] = useState(() => atributos.reduce((acc, cur) => acc + cur.valor, 0));
    const numeroAtualAtributos = atributos.reduce((acc, cur) => acc + cur.valor, 0);
    const atributosDistribuir = 2;
    const numeroAtributosNoFinal = numeroInicialAtributos + atributosDistribuir;
    const atributosRestantesDistribuir = numeroAtributosNoFinal - numeroAtualAtributos;
    const numeroAtributosPodeDiminuir = atributos.filter(atributo => atributo.valor < 1).length;

    //

    const [numeroInicialPericiasTreinadas] = useState(() => pericias.filter(pericia => pericia.valor === 2).length);
    const numeroAtualPericiasTreinadas = pericias.filter(pericia => pericia.valor === 2).length;
    const periciasTreinadasDistribuir = 1 + atributos.find(atributo => atributo.idAtributo === 3)!.valor;
    const numeroPericiasTreinadasNoFinal = numeroInicialPericiasTreinadas + periciasTreinadasDistribuir;
    const periciasTreinadasRestantesDistribuir = numeroPericiasTreinadasNoFinal - numeroAtualPericiasTreinadas;

    //

    const totalPV = Math.ceil(
        (atributos.find(atributo => atributo.idAtributo === 5)!.valor * 2)
        + atributos.find(atributo => atributo.idAtributo === 2)!.valor
        + 6
    );

    const totalPS = Math.ceil(
        ((atributos.find(atributo => atributo.idAtributo === 3)!.valor + atributos.find(atributo => atributo.idAtributo === 4)!.valor) / 2)
        + 5
    );

    const totalPE = Math.ceil(
        ((atributos.find(atributo => atributo.idAtributo === 1)!.valor + atributos.find(atributo => atributo.idAtributo === 2)!.valor + atributos.find(atributo => atributo.idAtributo === 5)!.valor) / 3)
        + 1
    );

    //

    const modificarAtributo = (index: number, delta: number) => {
        const novosAtributos = [...atributos];
        novosAtributos[index].valor += delta;

        setAtributos(novosAtributos);
    };

    const modificarPericia = (index: number, delta: number) => {
        const novasPericiasTreinadas = [...pericias];
        novasPericiasTreinadas[index].valor += delta;

        setPericias(novasPericiasTreinadas);
    }

    const limiteDiminuirAtributo = (valorAtributo: number): boolean => {
        return (
            (valorAtributo <= 0) ||
            (numeroAtributosPodeDiminuir > 0 && valorAtributo === 1)
        );
    }

    const limiteAumentarAtributo = (valorAtributo: number): boolean => {
        return (
            valorAtributo >= 3 ||
            atributosRestantesDistribuir <= 0
        );
    }

    const limiteDiminuirPericia = (valorPericia: number): boolean => {
        return (
            valorPericia < 2
        );
    }

    const limiteAumentarPericia = (valorPericia: number): boolean => {
        return (
            periciasTreinadasRestantesDistribuir <= 0 ||
            valorPericia >= 2
        );
    }

    const bloqueiaProsseguir = (): boolean => {
        return (
            atributosRestantesDistribuir > 0 ||
            periciasTreinadasRestantesDistribuir !== 0 ||
            inputValue.trim() === ''
        );
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const prosseguir = () => {
        const ficha: RLJ_Ficha2 = {
            detalhes: {
                nome: inputValue,
                idClasse: 1,
                idNivel: 1,
            },
            estatisticasDanificaveis: [
                {
                    id: 1,
                    valorMaximo: totalPV,
                    valor: totalPV,
                },
                {
                    id: 2,
                    valorMaximo: totalPS,
                    valor: totalPS,
                },
                {
                    id: 3,
                    valorMaximo: totalPE,
                    valor: totalPE,
                },
            ],
            estatisticasBuffaveis: [],
            atributos: atributos.map(atributo => ({ id: atributo.idAtributo, valor: atributo.valor })),
            periciasPatentes: pericias.map(pericia => ({ idPericia: pericia.idPericia, idPatente: pericia.valor })),
        }

        addFichaLocalStore(ficha);

        navigate('/pagina-interna');
    }

    const addFichaLocalStore = (novaFicha: RLJ_Ficha2) => {
        const data = localStorage.getItem('dadosFicha');
        const dadosFicha = data ? JSON.parse(data) : [];

        dadosFicha.push({ dados: novaFicha });
        localStorage.setItem('dadosFicha', JSON.stringify(dadosFicha));
    }

    return (
        <div className={style.editando_ficha}>
            <h1>Criando Ficha - NEX 0%</h1>

            <input type='text' placeholder='Nome do Personagem' value={inputValue} onChange={handleInputChange} autoFocus />

            <div className={style.area_edicao}>
                <div className={style.editando_ficha_atributos}>
                    <h1>Atributos a Distribuir: {atributosRestantesDistribuir}</h1>

                    <div className={style.div_atributos}>
                        {atributos.map((atributo, index) => (
                            <div key={index} className={style.editando_atributo}>
                                <h2>{atributo.nomeAbrev}</h2>
                                <h2>{atributo.valor}</h2>
                                <div className={style.operador_atributo}>
                                    <button onClick={() => modificarAtributo(index, -1)} disabled={limiteDiminuirAtributo(atributo.valor)}>-</button>
                                    <button onClick={() => modificarAtributo(index, 1)} disabled={limiteAumentarAtributo(atributo.valor)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.editando_ficha_pericias}>
                    <h1>Pericias Treinadas para Selecionar: {periciasTreinadasRestantesDistribuir}</h1>

                    <div className={style.div_pericias}>
                        {pericias.map((pericia, index) => (
                            <div key={index} className={style.editando_pericia}>
                                <h2>{pericia.nomeAbrev}</h2>
                                <h2>{pericia.valor}</h2>
                                <div className={style.operador_atributo}>
                                    <button onClick={() => modificarPericia(index, -1)} disabled={limiteDiminuirPericia(pericia.valor)}>-</button>
                                    <button onClick={() => modificarPericia(index, 1)} disabled={limiteAumentarPericia(pericia.valor)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.editando_ficha_estatisticas}>
                    <div className={style.visualizador_estatistica}><h2>P.V.</h2><h2>{totalPV}</h2></div>
                    <div className={style.visualizador_estatistica}><h2>P.S.</h2><h2>{totalPS}</h2></div>
                    <div className={style.visualizador_estatistica}><h2>P.E.</h2><h2>{totalPE}</h2></div>
                </div>
            </div>

            <button onClick={() => prosseguir()} disabled={bloqueiaProsseguir()} className={style.prosseguir}>Prosseguir</button>
        </div>
    );
}

export default page;