'use client';

import styles from './styles.module.css';

import type { ComposicaoPagina } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaDocumentacaoProduto__Documentacao } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';
import NecessidadesVinculadas from './NecessidadesVinculadas';
import PublicosDaPagina from './PublicosDaPagina';
import CtasDaPagina from './CtasDaPagina';
import SecoesDaPagina from './SecoesDaPagina';

// Composição = metadado de mutabilidade: avisa quem desenha a tela se ela é fixa ou montável/reorganizável.
const OPCOES_COMPOSICAO: readonly OpcaoSelecionador[] = [
    { value: 'FLUXO_FIXO', label: 'Fluxo fixo — tela comum (menu + conteúdo)' },
    { value: 'SUPERFICIE_CONFIGURAVEL', label: 'Superfície configurável — montável/reorganizável (ex.: Landing)' },
];

export default function SPA__PaginaDocumentacaoProduto__Documentacao() {
    const { documentacaoExiste, form, salvando, erro, setCampo, salvar, listagemVinculos, necessidadesDisponiveis, nomePersonaPorId, vincular, alternarAtendida, removerVinculo, idPagina, listagemPersonas, listagemCtas, listagemTiposSecao } = useContexto__PaginaDocumentacaoProduto__Documentacao();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Composição da página" classname={styles.campo_largo}>
                        <SelecionadorOpcoes opcoes={OPCOES_COMPOSICAO} valor={form.composicao === '' ? null : form.composicao} onChange={valor => setCampo('composicao', (valor ?? '') as '' | ComposicaoPagina)} placeholder="Como esta página é montada? (avisa quem desenha a tela)" isClearable />
                    </InputComRotulo>
                    {form.composicao === 'SUPERFICIE_CONFIGURAVEL' && (
                        <InputComRotulo rotulo="Descrição da arquitetura configurável" classname={styles.campo_largo}>
                            <textarea rows={3} value={form.composicaoDescricao} onChange={e => setCampo('composicaoDescricao', e.target.value)} placeholder="Como a página foge do padrão menu+slot? (seções empilhadas, blocos que vão e vêm, etc.)" />
                        </InputComRotulo>
                    )}
                    <InputComRotulo rotulo="Objetivo — por que esta página existe" classname={styles.campo_largo}>
                        <textarea rows={4} value={form.objetivo} onChange={e => setCampo('objetivo', e.target.value)} placeholder="Qual necessidade esta página atende? Por que ela existe?" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Informações que consome">
                        <textarea rows={4} value={form.informacoesConsumidas} onChange={e => setCampo('informacoesConsumidas', e.target.value)} placeholder="Que informações esta página apresenta/consome?" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Informações que gera">
                        <textarea rows={4} value={form.informacoesGeradas} onChange={e => setCampo('informacoesGeradas', e.target.value)} placeholder="Que informações esta página gera/cadastra?" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Status de implementação" classname={styles.campo_largo}>
                        <textarea rows={4} value={form.statusImplementacao} onChange={e => setCampo('statusImplementacao', e.target.value)} placeholder="Já atende X, Y; ainda falta A — sendo A a necessidade tal." />
                    </InputComRotulo>
                </div>
                {documentacaoExiste
                    ? <NecessidadesVinculadas listagemVinculos={listagemVinculos} necessidadesDisponiveis={necessidadesDisponiveis} nomePersonaPorId={nomePersonaPorId} vincular={vincular} alternarAtendida={alternarAtendida} removerVinculo={removerVinculo} />
                    : <p className={styles.aviso}>Crie a documentação para poder vincular necessidades.</p>}
                <PublicosDaPagina idPagina={idPagina} listagemPersonas={listagemPersonas} nomePersonaPorId={nomePersonaPorId} />
                <CtasDaPagina idPagina={idPagina} listagemCtas={listagemCtas} />
                <SecoesDaPagina idPagina={idPagina} listagemTiposSecao={listagemTiposSecao} listagemPersonas={listagemPersonas} nomePersonaPorId={nomePersonaPorId} />
                {erro && <p className={styles.erro}>{erro}</p>}
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : documentacaoExiste ? 'Salvar Documentação' : 'Criar Documentação'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};