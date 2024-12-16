// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { dadosItem, RLJ_Ficha2 } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
import InputComRotulo from 'Recursos/ElementosComponentizados/InputComRotulo/page.tsx';
import InputNumerico from 'Recursos/ElementosComponentizados/InputNumerico/page.tsx';

import { useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserAstronaut, faWrench, faBagShopping } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const location = useLocation();
    const indexFicha = location.state?.indexFicha;
    const [fichaAtual, setFichaAtual] = useState<RLJ_Ficha2>();
    const navigate = useNavigate();
    const [idPaginaAberta, setIdPaginaAberta] = useState(0);

    const quantidadeItemsCat1 = fichaAtual?.inventario.filter(item => item.categoria === 1).length || 0;
    const cargaInventario = fichaAtual?.inventario.reduce((acc, cur) => { return acc + cur.peso }, 0) || 0;

    useEffect(() => {
        atualizaInventario();
    }, []);

    const atualizaInventario = () => {
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            setFichaAtual(fichas[indexFicha] || { inventario: [] });
        }
    };

    const voltaParaPaginaInicial = () => {
        setIdPaginaAberta(0);
    }

    const adicionarItem = (dadosItem: dadosItem, quantidade: number = 1) => {
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaAtualizada = fichas[indexFicha] || { inventario: [] };

            const novaQuantidadeItemsCat1 = quantidadeItemsCat1 + (dadosItem.categoria * quantidade);

            if (novaQuantidadeItemsCat1 > 2) {
                alert('Limite de itens da categoria 1 excedido');
                return;
            }

            const novaCargaInventario = cargaInventario + (dadosItem.peso * quantidade);

            if (novaCargaInventario > 30) {
                alert('Dobro do Limite de Capacidade de Carga está sendo excedido');
                return;
            }

            if (cargaInventario <= 15 && novaCargaInventario > 15) {
                const confirmou = window.confirm(
                    'O Limite de Capacidade de Carga está sendo excedido, deixando o personagem em sobrepeso. Deseja continuar?'
                );
                if (!confirmou) return;
            }

            fichaAtualizada.inventario = [
                ...(fichaAtualizada.inventario || []),
                ...Array(quantidade).fill(dadosItem),
            ];

            fichas[indexFicha] = fichaAtualizada;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
            atualizaInventario();
            voltaParaPaginaInicial();
        }
    };

    const removeItem = (index: number) => {
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaRemovendo = fichas[indexFicha] || { inventario: [] };

            if (fichaRemovendo.inventario && index >= 0 && index < fichaRemovendo.inventario.length) {
                fichaRemovendo.inventario.splice(index, 1);
            }

            fichas[indexFicha] = fichaRemovendo;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
            atualizaInventario();
        }
    };

    const PaginaInicialItems = () => {
        return (
            <>
                <h2>Adicionar novos Itens</h2>
                <div className={style.botoes_itens}>
                    <button onClick={() => { setIdPaginaAberta(1) }} className={style.botao_categoria_iteem}>Componentes</button>
                    <button onClick={() => { setIdPaginaAberta(2) }} className={style.botao_categoria_iteem}>Equipamentos</button>
                    <button onClick={() => { setIdPaginaAberta(6) }} className={style.botao_categoria_iteem}>Consumíveis</button>
                    <button onClick={() => { setIdPaginaAberta(7) }} className={style.botao_categoria_iteem}>Armas</button>
                </div>
            </>
        );
    }

    const PaginaComponentes = () => {
        const [elemento, setElemento] = useState({ value: 0, text: '' });
        const [patente, setPatente] = useState({ value: 0, text: '' });
        const [quantidade, setQuantidade] = useState(1);

        const handleElementoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setElemento({ value: Number(e.target.value), text });
        };

        const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPatente({ value: Number(e.target.value), text });
        };

        const adicionar = () => {
            const dadosItem: dadosItem = {
                idTipoItem: 4,
                nomeItem: { nomePadrao: `Componente de ${elemento.text} ${patente.text}` },
                peso: 1,
                categoria: 0,
                detalhesComponente: { idElemento: elemento.value, idNivelComponente: patente.value, usosMaximos: 2, usos: 2 }
            }

            adicionarItem(dadosItem, quantidade);
        }

        return (
            <div className={style.area_tipo_item}>
                <h2>Adicionar Componentes</h2>

                <InputComRotulo rotulo={'Elemento'}>
                    <select value={elemento.value} onChange={handleElementoChange}> <option value="0" disabled >Selecionar Elemento</option> {SingletonHelper.getInstance().elementos.filter(elemento => elemento.id !== 3).map(elemento => (<option key={elemento.id} value={elemento.id}>{elemento.nome}</option>))} </select>
                </InputComRotulo>

                <InputComRotulo rotulo={'Patente'}>
                    <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
                </InputComRotulo>

                <InputComRotulo rotulo={'Quantidade'}>
                    <InputNumerico min={1} step={1} value={quantidade} onChange={setQuantidade} />
                </InputComRotulo>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                    <button onClick={adicionar} disabled={elemento.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
            </div>
        );
    }

    const PaginaEquipamentos = () => {
        return (
            <>
                <h2>Adicionar Equipamentos</h2>

                <div className={style.botoes_itens_2}>
                    <button onClick={() => { setIdPaginaAberta(3) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faUserAstronaut} />Vestimentas</button>
                    <button onClick={() => { setIdPaginaAberta(4) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faWrench} />Utensílios</button>
                    <button onClick={() => { setIdPaginaAberta(5) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faBagShopping} />Mochilas</button>
                </div>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                </div>
            </>
        );
    }
    
    const PaginaVestimentas = () => {
        const [pericia, setPericia] = useState({ value: 0, text: '' });
        const [patente, setPatente] = useState({ value: 0, text: '' });

        const handlePericiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPericia({ value: Number(e.target.value), text });
        };

        const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPatente({ value: Number(e.target.value), text });
        };

        const adicionar = () => {
            const dadosItem: dadosItem = {
                idTipoItem: 2,
                nomeItem: { nomePadrao: `Vestimenta de ${pericia.text} ${patente.text}` },
                peso: 3,
                categoria: 1,
                detalhesItem: { podeSerVestido: true, precisaEstarVetindo: true },
                buffs: [ { idBuff: SingletonHelper.getInstance().pericias.find(periciaEscolhida => periciaEscolhida.id === pericia.value)!.idBuffRelacionado, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ],
            }

            adicionarItem(dadosItem);
        }

        return (
            <div className={style.area_tipo_item}>
                <h2>Adicionar Vestimentas</h2>

                <InputComRotulo rotulo={'Perícia'}>
                    <select value={pericia.value} onChange={handlePericiaChange}> <option value="0" disabled >Selecionar Perícia</option> {SingletonHelper.getInstance().pericias.sort((a, b) => a.nome.localeCompare(b.nome)).map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.nome}</option>))} </select>
                </InputComRotulo>

                <InputComRotulo rotulo={'Patente'}>
                    <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
                </InputComRotulo>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                    <button onClick={adicionar} disabled={pericia.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
            </div>
        );
    }

    const PaginaUtensilios = () => {
        const [pericia, setPericia] = useState({ value: 0, text: '' });
        const [patente, setPatente] = useState({ value: 0, text: '' });

        const handlePericiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPericia({ value: Number(e.target.value), text });
        };

        const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPatente({ value: Number(e.target.value), text });
        };

        const adicionar = () => {
            const dadosItem: dadosItem = {
                idTipoItem: 2,
                nomeItem: { nomePadrao: `Utensílio de ${pericia.text} ${patente.text}` },
                peso: 1,
                categoria: 1,
                detalhesItem: { precisaEstarEmpunhado: true },
                buffs: [ { idBuff: SingletonHelper.getInstance().pericias.find(periciaEscolhida => periciaEscolhida.id === pericia.value)!.idBuffRelacionado, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ],
            }

            adicionarItem(dadosItem);
        }

        return (
            <div className={style.area_tipo_item}>
                <h2>Adicionar Utensilios</h2>

                <InputComRotulo rotulo={'Perícia'}>
                    <select value={pericia.value} onChange={handlePericiaChange}> <option value="0" disabled >Selecionar Perícia</option> {SingletonHelper.getInstance().pericias.sort((a, b) => a.nome.localeCompare(b.nome)).map(pericia => (<option key={pericia.id} value={pericia.id}>{pericia.nome}</option>))} </select>
                </InputComRotulo>

                <InputComRotulo rotulo={'Patente'}>
                    <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
                </InputComRotulo>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                    <button onClick={adicionar} disabled={pericia.value === 0 || patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
            </div>
        );
    }

    const PaginaMochilas = () => {
        const [patente, setPatente] = useState({ value: 0, text: '' });

        const handlePatenteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedIndex = e.target.selectedIndex;
            const text = e.target.options[selectedIndex].text;
            setPatente({ value: Number(e.target.value), text });
        };

        const adicionar = () => {
            const dadosItem: dadosItem = {
                idTipoItem: 2,
                nomeItem: { nomePadrao: `Mochila ${patente.text}` },
                peso: 0,
                categoria: 1,
                detalhesItem: { podeSerVestido: true, precisaEstarVetindo: true },
                buffs: [ { idBuff: 52, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ],
            }

            adicionarItem(dadosItem);
        }

        return (
            <div className={style.area_tipo_item}>
                <h2>Adicionar Mochilas</h2>

                <InputComRotulo rotulo={'Patente'}>
                    <select value={patente.value} onChange={handlePatenteChange}> <option value="0" disabled >Selecionar Patente</option> <option key={1} value={1}>Simples</option> </select>
                </InputComRotulo>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                    <button onClick={adicionar} disabled={patente.value === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
            </div>
        );
    }

    const PaginaConsumiveis = () => {
        const [consumivel, setConsumivel] = useState(0);

        const handleConsumivelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setConsumivel(e.target.selectedIndex);
        };

        const adicionar = () => {
            let dadosItem: dadosItem;

            switch (consumivel) {
                case 1:
                    dadosItem = {
                        idTipoItem: 3,
                        nomeItem: { nomePadrao: `Bálsamo de Arnica` },
                        peso: 1,
                        categoria: 0,
                        detalhesConsumiveis: { usosMaximos: 1, usos: 1 },
                        dadosAcoes: [ {
                            nomeAcao: 'Consumir',
                            idTipoAcao: 1,
                            idCategoriaAcao: 1,
                            idMecanica: 3,
                            custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                            buffs: [ { idBuff: 33, nome: 'Bálsamo de Arnica', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 2, } ],
                            requisitos: [2]
                        } ],
                    }
                    break;
                case 2:
                    dadosItem = {
                        idTipoItem: 3,
                        nomeItem: { nomePadrao: `Gel de Babosa` },
                        peso: 1,
                        categoria: 0,
                        detalhesConsumiveis: { usosMaximos: 1, usos: 1 },
                        dadosAcoes: [ {
                            nomeAcao: 'Consumir',
                            idTipoAcao: 1,
                            idCategoriaAcao: 1,
                            idMecanica: 3,
                            custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
                            buffs: [ { idBuff: 37, nome: 'Gel de Babosa', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 2, } ],
                            requisitos: [2]
                        } ],
                    }
                    break;
                case 3:
                    dadosItem = {
                        idTipoItem: 3,
                        nomeItem: { nomePadrao: `Ácido Hialurônico Injetável` },
                        peso: 1,
                        categoria: 1,
                        detalhesConsumiveis: { usosMaximos: 1, usos: 1 },
                    }
                    break;
                default:
                    return;
            }

            adicionarItem(dadosItem);
        }

        return (
            <div className={style.area_tipo_item}>
                <h2>Adicionar Consumível</h2>

                <InputComRotulo rotulo={'Consumível'}>
                    <select value={consumivel} onChange={handleConsumivelChange}> <option value="0" disabled >Selecionar Consumível</option> <option key={1} value={1}>Bálsamo de Arnica</option><option key={2} value={2}>Gel de Babosa</option><option key={3} value={3}>Ácido Hialurônico Injetável</option> </select>
                </InputComRotulo>

                <div className={style.area_botao_tipo_item}>
                    <button onClick={voltaParaPaginaInicial}>Voltar</button>
                    <button onClick={adicionar} disabled={consumivel === 0} className={style.botao_adicionar}>Adicionar</button>
                </div>
            </div>
        );
    }

    const PaginaArmas = () => {
        return (
            <>

            </>
        );
    }

    return (
        <div className={style.shopping}>
            <h1>Shopping</h1>

            <div className={style.div_geral}>
                <div className={style.div_inventario}>
                    <h2>Inventário Atual</h2>

                    <div className={style.dados_inventario}>
                        <p>Capacidade de Carga: {cargaInventario}/15</p>
                        <p>Itens Categoria 1: {quantidadeItemsCat1}/2</p>
                    </div>

                    {fichaAtual?.inventario && fichaAtual.inventario.length > 0 ? (
                        <div className={style.embrulho_inventario_atual}>
                            <div className={style.inventario_atual}>
                                {fichaAtual.inventario.map((item, index) => (
                                    <div key={index} className={style.linha_item}>
                                        <h3>{item.nomeItem.nomePadrao}</h3>
                                        <FontAwesomeIcon className={style.remove_item} title={'Remover Item'} icon={faTrash} onClick={() => { removeItem(index) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <h3>Inventário Vazio</h3>
                    )}
                </div>
                <div className={style.div_shopping}>
                    <div className={style.area_adicionar_item}>
                        {idPaginaAberta === 0 && (
                            <PaginaInicialItems />
                        )}
                        {idPaginaAberta === 1 && (
                            <PaginaComponentes />
                        )}
                        {idPaginaAberta === 2 && (
                            <PaginaEquipamentos />
                        )}
                        {idPaginaAberta === 3 && (
                            <PaginaVestimentas />
                        )}
                        {idPaginaAberta === 4 && (
                            <PaginaUtensilios />
                        )}
                        {idPaginaAberta === 5 && (
                            <PaginaMochilas />
                        )}
                        {idPaginaAberta === 6 && (
                            <PaginaConsumiveis />
                        )}
                        {idPaginaAberta === 7 && (
                            <PaginaArmas />
                        )}
                    </div>
                </div>
            </div>

            <div className={style.linha_botoes}>
                <button onClick={() => { navigate('/pagina-interna'); }}>Fichas</button>
            </div>
        </div>
    );
}

export default page;