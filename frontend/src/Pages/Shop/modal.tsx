// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { dadosItem } from 'Types/classes/index.ts';
// #endregion

const page = ({ onCreate }: { onCreate: (novoRitual: dadosItem) => void; }) => {
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const data: { id: number, dados: dadosItem }[] = [
        { id: 1, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo Leve Simples Ineficaz' }, peso: 2, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 4, variancia: 3, idAtributoUtilizado: 1, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 2, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo Leve Simples Refinada' }, peso: 2, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 6, variancia: 5, idAtributoUtilizado: 1, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 3, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo Leve Complexa Veloz' }, peso: 4, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 8, variancia: 6, idAtributoUtilizado: 1, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 4, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Uma Mão Simples Ineficaz' }, peso: 3, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 4, variancia: 3, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 5, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Uma Mão Simples Refinada' }, peso: 3, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 6, variancia: 5, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 6, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Uma Mão Complexa Atroz' }, peso: 5, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 9, variancia: 6, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 7, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Duas Mãos Simples Ineficaz' }, peso: 5, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 6, variancia: 4, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 8, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Duas Mãos Simples Refinada' }, peso: 5, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 8, variancia: 6, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 9, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Corpo a Corpo De Duas Mãos Complexa Colossal' }, peso: 8, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 12, variancia: 9, idAtributoUtilizado: 2, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 10, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Disparador Simples Ineficaz' }, peso: 4, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 4, variancia: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 11, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Disparador Simples Lente Auxiliar' }, peso: 4, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 4, variancia: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 12, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Disparador Complexo Tensionado' }, peso: 7, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 6, variancia: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 13, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arremessável Simples Ineficaz' }, peso: 4, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 4, variancia: 3, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 14, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arremessável Simples Refinado' }, peso: 4, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 6, variancia: 5, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 15, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arremessável Complexo Atroz' }, peso: 6, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 9, variancia: 6, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 16, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma de Fogo Simples' }, peso: 3, categoria: 0, precisaEstarEmpunhando: true, detalhesArma: { dano: 8, variancia: 7, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 1, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 17, dados: { idTipoItem: 1, nomeItem: { nomePadrao: 'Arma de Fogo Complexa' }, peso: 6, categoria: 1, precisaEstarEmpunhando: true, detalhesArma: { dano: 14, variancia: 12, idAtributoUtilizado: 1, idPericiaUtilizada: 5, numeroExtremidadesUtilizadas: 2, }, dadosAcoes: [{ nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2] }], } },
        { id: 18, dados: { idTipoItem: 4, nomeItem: { nomePadrao: 'Componentes de Conhecimento Simples' }, peso: 1, categoria: 0, detalhesComponente: { idElemento: 1, idNivelComponente: 1, usosMaximos: 2, usos: 2 }, } },
        { id: 19, dados: { idTipoItem: 4, nomeItem: { nomePadrao: 'Componentes de Energia Simples' }, peso: 1, categoria: 0, detalhesComponente: { idElemento: 2, idNivelComponente: 1, usosMaximos: 2, usos: 2 }, } },
        { id: 20, dados: { idTipoItem: 4, nomeItem: { nomePadrao: 'Componentes de Morte Simples' }, peso: 1, categoria: 0, detalhesComponente: { idElemento: 4, idNivelComponente: 1, usosMaximos: 2, usos: 2 }, } },
        { id: 21, dados: { idTipoItem: 4, nomeItem: { nomePadrao: 'Componentes de Sangue Simples' }, peso: 1, categoria: 0, detalhesComponente: { idElemento: 5, idNivelComponente: 1, usosMaximos: 2, usos: 2 }, } },
        { id: 22, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Acrobacia Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 6, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 23, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Crime Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 12, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 24, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Furtividade Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 17, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 25, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Iniciativa Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 18, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 26, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Pontaria Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 26, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 27, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Reflexo Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 27, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 28, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Atletismo Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 9, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 29, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Luta Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 22, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 30, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Adestramento Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 7, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 31, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Artes Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 8, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 32, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Atualidades Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 10, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 33, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Ciências Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 11, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 34, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Engenharia Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 15, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 35, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Investigação Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 21, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 36, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Medicina Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 23, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 37, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Ocultismo Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 24, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 38, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Sobrevivência Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 28, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 39, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Tatica Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 29, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 40, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Tecnologia Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 30, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 41, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Diplomacia Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 13, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 42, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Enganação Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 14, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 43, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Intimidação Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 19, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 44, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Intuição Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 20, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 45, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Percepção Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 25, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 46, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Vontade Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 31, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
        { id: 47, dados: { idTipoItem: 2, nomeItem: { nomePadrao: 'Vestimenta de Fortitude Simples'}, peso: 3, categoria: 1, detalhesEquipamentos: { }, buffs: [ { idBuff: 16, nome: 'Ferramentas Simples', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 1, } ], } },
    ];
    // const data: { id:number, dados: dadosItem}[] = [
    //     { id: 1, dados: {
    //         idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Teste', nomeCustomizado: 'Bea', }, peso: 5, categoria: 1, precisaEstarEmpunhando: true,
    //         detalhesArma: { dano: 6, variancia: 3, idPericiaUtilizada: 8, numeroExtremidadesUtilizadas: 1, },
    //         dadosAcoes: [
    //             {
    //                 nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idCategoriaAcao: 1, idMecanica: 3,
    //                 custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ]},
    //                 requisitos: [2]
    //             }
    //         ],
    //     }},
    // ];

    const handleRowClick = (id: number) => {
        setSelectedRowId(id);
    };

    const handleCreate = () => {

        onCreate(data.find(row => row.id === selectedRowId)!.dados);
    };

    return (
        <div className={style.modal_inventario}>
            <h1>Adicionando Novo Item</h1>
            <table border={1} style={{ width: '100%', cursor: 'pointer' }}>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id} onClick={() => handleRowClick(row.id)} style={{ backgroundColor: selectedRowId === row.id ? 'lightblue' : 'white', }} >
                            <td>{row.dados.nomeItem.nomePadrao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleCreate} disabled={selectedRowId === undefined}>Adicionar</button>
        </div>
    );
}

export default page;