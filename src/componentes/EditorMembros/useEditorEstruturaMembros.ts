'use client';

import { useCallback, useRef, useState } from 'react';
import type { MembroSerJogavel, MembroSerJogavelInput } from 'types-nora-api';

import { useListagemCapacidadesInatas } from 'Hooks/useListagemCapacidadesInatas';
import { adicionaAcaoMembroEditor, alternaCapacidadeMembroEditor, atualizaCapacidadeAcaoMembroEditor, atualizaDanoAcaoMembroEditor, atualizaNomeAcaoMembroEditor, atualizaNomeMembroEditor, membroEditorVazio, membrosEditorDePersistidos, membrosEditorSaoValidos, montaInputMembrosEditor, obtemMensagemValidacaoMembrosEditor, removeAcaoMembroEditor, type CapacidadeInataMembroEditor, type MembroEditor } from './membrosSerJogavelEditor';

type CarregarMaisEditorMembros = { readonly podeCarregarMais: boolean; readonly aoCarregarMais: () => void; readonly carregando?: string | null; };

// Forma da listagem de Capacidades Inatas que o editor consome (o hook a entrega; as vistas só leem).
export type CapacidadesInatasListagemEditorMembros = {
    readonly registros: readonly CapacidadeInataMembroEditor[];
    readonly carregando?: string | null;
    readonly erro?: string | null;
    readonly carregarMais?: CarregarMaisEditorMembros | null;
};

// Estado REUTILIZAVEL do editor de estrutura (Membros -> Capacidades Inatas + Acoes), extraido do editor legado, desacoplado de persistencia.
// Quem usa: carrega os membros (carregar), edita pelas acoes e persiste com montaInput. Serve para a estrutura humana compartilhada e para a estrutura propria do nao-humano.
export function useEditorEstruturaMembros() {
    const capacidadesInatas = useListagemCapacidadesInatas();
    const proximoIdLocalRef = useRef(1);
    const proximoIdLocalAcaoRef = useRef(1);
    const [membros, setMembros] = useState<readonly MembroEditor[]>([]);

    const proximoIdLocal = useCallback((): number => { const id = proximoIdLocalRef.current; proximoIdLocalRef.current += 1; return id; }, []);
    const proximoIdLocalAcao = useCallback((): number => { const id = proximoIdLocalAcaoRef.current; proximoIdLocalAcaoRef.current += 1; return id; }, []);

    const carregar = useCallback((membrosPersistidos: readonly MembroSerJogavel[]): void => {
        const carregados = membrosEditorDePersistidos(membrosPersistidos, proximoIdLocal, proximoIdLocalAcao);
        setMembros(carregados.length > 0 ? carregados : [membroEditorVazio(proximoIdLocal())]);
    }, [proximoIdLocal, proximoIdLocalAcao]);

    // Adicionar devolve o idLocal criado — o Controlador de Fluxo abre a subvista do item recém-criado.
    function adicionaMembro(): number { const idLocal = proximoIdLocalRef.current++; setMembros(atuais => [...atuais, membroEditorVazio(idLocal)]); return idLocal; };
    function removeMembro(idLocal: number): void { setMembros(atuais => atuais.filter(membro => membro.idLocal !== idLocal)); };
    function atualizaNomeMembro(idLocal: number, nome: string): void { setMembros(atuais => atualizaNomeMembroEditor(atuais, idLocal, nome)); };
    function alternaCapacidadeMembro(idLocal: number, idCapacidade: number): void { setMembros(atuais => alternaCapacidadeMembroEditor(atuais, idLocal, idCapacidade)); };
    function adicionaAcaoMembro(idLocal: number): number { const idLocalAcao = proximoIdLocalAcaoRef.current++; setMembros(atuais => adicionaAcaoMembroEditor(atuais, idLocal, idLocalAcao)); return idLocalAcao; };
    function removeAcaoMembro(idLocal: number, idLocalAcao: number): void { setMembros(atuais => removeAcaoMembroEditor(atuais, idLocal, idLocalAcao)); };
    function atualizaNomeAcaoMembro(idLocal: number, idLocalAcao: number, nome: string): void { setMembros(atuais => atualizaNomeAcaoMembroEditor(atuais, idLocal, idLocalAcao, nome)); };
    function atualizaCapacidadeAcaoMembro(idLocal: number, idLocalAcao: number, idCapacidadeInata: number): void { setMembros(atuais => atualizaCapacidadeAcaoMembroEditor(atuais, idLocal, idLocalAcao, idCapacidadeInata)); };
    function atualizaDanoAcaoMembro(idLocal: number, idLocalAcao: number, dano: number | ''): void { setMembros(atuais => atualizaDanoAcaoMembroEditor(atuais, idLocal, idLocalAcao, dano)); };

    const mensagemValidacao = obtemMensagemValidacaoMembrosEditor(membros, capacidadesInatas.registros);
    const valido = membrosEditorSaoValidos(membros, capacidadesInatas.registros) && capacidadesInatas.registros.length > 0;

    function montaInput(): readonly MembroSerJogavelInput[] { return montaInputMembrosEditor(membros); };

    return { membros, capacidadesInatas, mensagemValidacao, valido, carregar, montaInput, adicionaMembro, removeMembro, atualizaNomeMembro, alternaCapacidadeMembro, adicionaAcaoMembro, removeAcaoMembro, atualizaNomeAcaoMembro, atualizaCapacidadeAcaoMembro, atualizaDanoAcaoMembro };
};
