'use client';

import styles from './styles.module.css';

import classNames from 'classnames';
import { useMemo } from 'react';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaDocumentacaoProduto__Catalogo } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Catalogo/contexto';

// Catálogo do módulo: personas e suas necessidades — o vocabulário de intenção que os verbetes das páginas vinculam.
export default function SPA__PaginaDocumentacaoProduto__Catalogo() {
    const { listagemPersonas, listagemNecessidades, formPersona, formNecessidade, salvandoPersona, salvandoNecessidade, erroPersona, erroNecessidade, podeSalvarPersona, podeSalvarNecessidade, setCampoPersona, setCampoNecessidade, editarPersona, editarNecessidade, limparFormPersona, limparFormNecessidade, salvarPersona, salvarNecessidade } = useContexto__PaginaDocumentacaoProduto__Catalogo();

    const opcoesPersonas = useMemo<OpcaoSelecionador[]>(() => listagemPersonas.registros.filter(persona => persona.ativo).map(persona => ({ value: String(persona.id), label: persona.nome })), [listagemPersonas.registros]);
    const nomePersona = (idPersona: number): string => listagemPersonas.registros.find(persona => persona.id === idPersona)?.nome ?? `Persona #${idPersona}`;

    return (
        <div className={styles.colunas}>
            <section className={styles.coluna}>
                <h4 className={styles.titulo_secao}>Personas</h4>
                {listagemPersonas.registros.length === 0 && <p className={styles.vazio}>Nenhuma persona cadastrada ainda.</p>}
                <ul className={styles.lista}>
                    {listagemPersonas.registros.map(persona => (
                        <li key={persona.id}>
                            <DivClicavel className={classNames(styles.item, { [styles.inativo]: !persona.ativo, [styles.em_edicao]: formPersona.idEmEdicao === persona.id })} onClick={() => editarPersona(persona)}>
                                <strong className={styles.nome_item}>{persona.nome}</strong>
                                {persona.descricao !== null && <span className={styles.descricao_item}>{persona.descricao}</span>}
                            </DivClicavel>
                        </li>
                    ))}
                </ul>
                <div className={styles.form}>
                    <InputComRotulo rotulo={formPersona.idEmEdicao === null ? 'Nova persona *' : 'Editando persona *'}>
                        <input type="text" value={formPersona.nome} onChange={e => setCampoPersona('nome', e.target.value)} placeholder="ex.: Jogador, Mestre, Criador de assets" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição">
                        <textarea rows={3} value={formPersona.descricao} onChange={e => setCampoPersona('descricao', e.target.value)} placeholder="Quem é este tipo de usuário? O que ele busca?" />
                    </InputComRotulo>
                    {formPersona.idEmEdicao !== null && (
                        <div className={styles.linha_toggle}>
                            <span className={styles.rotulo_toggle}>Ativa</span>
                            <AlternaOpcao opcao={formPersona.ativo} onChange={valor => setCampoPersona('ativo', valor)} />
                        </div>
                    )}
                    {erroPersona && <p className={styles.erro}>{erroPersona}</p>}
                    <div className={styles.acoes_form}>
                        {formPersona.idEmEdicao !== null && <button type="button" className={styles.botao_leve} onClick={limparFormPersona} disabled={salvandoPersona}>Cancelar edição</button>}
                        <button type="button" className={styles.botao_leve} onClick={salvarPersona} disabled={!podeSalvarPersona}>{salvandoPersona ? 'Salvando...' : formPersona.idEmEdicao === null ? 'Criar persona' : 'Salvar persona'}</button>
                    </div>
                </div>
            </section>
            <section className={styles.coluna}>
                <h4 className={styles.titulo_secao}>Necessidades</h4>
                {listagemNecessidades.registros.length === 0 && <p className={styles.vazio}>Nenhuma necessidade cadastrada ainda.</p>}
                <ul className={styles.lista}>
                    {listagemNecessidades.registros.map(necessidade => (
                        <li key={necessidade.id}>
                            <DivClicavel className={classNames(styles.item, { [styles.em_edicao]: formNecessidade.idEmEdicao === necessidade.id })} onClick={() => editarNecessidade(necessidade)}>
                                <strong className={styles.nome_item}>{necessidade.titulo}</strong>
                                <span className={styles.persona_tag}>{nomePersona(necessidade.fkPersonasId)}</span>
                            </DivClicavel>
                        </li>
                    ))}
                </ul>
                <div className={styles.form}>
                    <InputComRotulo rotulo="Persona (de quem é a necessidade) *">
                        {formNecessidade.idEmEdicao === null
                            ? <SelecionadorOpcoes opcoes={opcoesPersonas} valor={formNecessidade.fkPersonasId !== null ? String(formNecessidade.fkPersonasId) : null} onChange={valor => setCampoNecessidade('fkPersonasId', valor !== null ? Number(valor) : null)} placeholder="Selecione a persona..." />
                            : <span className={styles.persona_fixa}>{formNecessidade.fkPersonasId !== null ? nomePersona(formNecessidade.fkPersonasId) : ''}</span>}
                    </InputComRotulo>
                    <InputComRotulo rotulo={formNecessidade.idEmEdicao === null ? 'Nova necessidade *' : 'Editando necessidade *'}>
                        <input type="text" value={formNecessidade.titulo} onChange={e => setCampoNecessidade('titulo', e.target.value)} placeholder="ex.: Encontrar uma partida para jogar" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição">
                        <textarea rows={3} value={formNecessidade.descricao} onChange={e => setCampoNecessidade('descricao', e.target.value)} placeholder="Detalhe a necessidade — por que ela importa pra essa persona?" />
                    </InputComRotulo>
                    {erroNecessidade && <p className={styles.erro}>{erroNecessidade}</p>}
                    <div className={styles.acoes_form}>
                        {formNecessidade.idEmEdicao !== null && <button type="button" className={styles.botao_leve} onClick={limparFormNecessidade} disabled={salvandoNecessidade}>Cancelar edição</button>}
                        <button type="button" className={styles.botao_leve} onClick={salvarNecessidade} disabled={!podeSalvarNecessidade}>{salvandoNecessidade ? 'Salvando...' : formNecessidade.idEmEdicao === null ? 'Criar necessidade' : 'Salvar necessidade'}</button>
                    </div>
                </div>
            </section>
        </div>
    );
};