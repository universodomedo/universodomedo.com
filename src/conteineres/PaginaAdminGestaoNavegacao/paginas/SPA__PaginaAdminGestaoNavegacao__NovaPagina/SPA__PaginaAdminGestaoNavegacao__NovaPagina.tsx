'use client';

import styles from './styles.module.css';

import { useMemo, useState } from 'react';
import { CAPACIDADES, type AcessoTipoPagina, type MenuNoDoBancoDto } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';
import { useContexto__PaginaAdminGestaoNavegacao__NovaPagina } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__NovaPagina/contexto';

const OPCOES_ACESSO: readonly OpcaoSelecionador[] = [
    { value: 'publico', label: 'Público' },
    { value: 'autenticado', label: 'Autenticado' },
    { value: 'cadastro_permitido', label: 'Cadastro permitido' },
    { value: 'capacidades', label: 'Por capacidades' },
];

// Achata a árvore de nós de um menu nos GRUPOS (com caminho), pra escolher o grupo pai do item. Itens não entram (não podem ser pais).
function achatarGrupos(nos: readonly MenuNoDoBancoDto[], prefixo = ''): OpcaoSelecionador[] {
    const opcoes: OpcaoSelecionador[] = [];
    for (const no of nos) {
        if (no.tipo !== 'grupo') continue;
        const caminho = prefixo.length > 0 ? `${prefixo} › ${no.titulo}` : no.titulo;
        opcoes.push({ value: String(no.id), label: caminho });
        opcoes.push(...achatarGrupos(no.filhos, caminho));
    }
    return opcoes;
};

export default function SPA__PaginaAdminGestaoNavegacao__NovaPagina() {
    const { form, menus, salvando, erro, podeSalvar, setCampo, criar, cancelar } = useContexto__PaginaAdminGestaoNavegacao__NovaPagina();
    const [escolhendoMusica, setEscolhendoMusica] = useState<boolean>(false);

    const opcoesCapacidades = useMemo<OpcaoSelecionador[]>(() => Object.keys(CAPACIDADES).map(chave => ({ value: chave, label: chave })), []);
    const opcoesMenus = useMemo<OpcaoSelecionador[]>(() => menus.map(menu => ({ value: String(menu.id), label: menu.descricao && menu.descricao.trim().length > 0 ? `${menu.chave} — ${menu.descricao}` : menu.chave })), [menus]);
    const opcoesGrupos = useMemo<OpcaoSelecionador[]>(() => {
        const menuSelecionado = menus.find(menu => menu.id === form.menuAlvoId) ?? null;
        return menuSelecionado ? achatarGrupos(menuSelecionado.nos) : [];
    }, [menus, form.menuAlvoId]);

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Chave *">
                        <input type="text" value={form.chave} onChange={e => setCampo('chave', e.target.value)} placeholder="ex.: minhasPaginas.admin.novaCoisa" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Rota *">
                        <input type="text" value={form.template} onChange={e => setCampo('template', e.target.value)} placeholder="ex.: /minhas-paginas/admin/nova-coisa" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Label *">
                        <input type="text" value={form.label} onChange={e => setCampo('label', e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tipo de acesso">
                        <SelecionadorOpcoes opcoes={OPCOES_ACESSO} valor={form.acessoTipo} onChange={valor => setCampo('acessoTipo', (valor ?? 'publico') as AcessoTipoPagina)} />
                    </InputComRotulo>
                    {form.acessoTipo === 'capacidades' && (
                        <InputComRotulo rotulo="Capacidades necessárias *" classname={styles.campo_largo}>
                            <SelecionadorOpcoes isMulti opcoes={opcoesCapacidades} valores={form.acessoCapacidades} onChange={valores => setCampo('acessoCapacidades', valores)} placeholder="Selecione capacidades..." />
                        </InputComRotulo>
                    )}
                    <InputComRotulo rotulo="Com cabeçalho">
                        <AlternaOpcao opcao={form.comCabecalho} onChange={valor => setCampo('comCabecalho', valor)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Acesso por menu interno">
                        <AlternaOpcao opcao={form.acessoPorMenuInterno} onChange={valor => setCampo('acessoPorMenuInterno', valor)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tem layout contextualizado">
                        <AlternaOpcao opcao={form.temLayout} onChange={valor => setCampo('temLayout', valor)} />
                    </InputComRotulo>
                    {form.temLayout && (
                        <>
                            <InputComRotulo rotulo="Título do layout">
                                <input type="text" value={form.layoutTitulo} onChange={e => setCampo('layoutTitulo', e.target.value)} />
                            </InputComRotulo>
                            <InputComRotulo rotulo="Proporção do conteúdo (0–100)">
                                <InputNumerico value={form.layoutProporcaoConteudo} onChange={valor => setCampo('layoutProporcaoConteudo', valor)} min={0} max={100} />
                            </InputComRotulo>
                        </>
                    )}
                    <InputComRotulo rotulo="Prioridade de presença">
                        <InputNumerico value={form.prioridadePresenca ?? 0} onChange={valor => setCampo('prioridadePresenca', valor)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Menu (onde a página aparece)" classname={styles.campo_largo}>
                        <SelecionadorOpcoes opcoes={opcoesMenus} valor={form.menuAlvoId !== null ? String(form.menuAlvoId) : null} onChange={valor => { setCampo('menuAlvoId', valor !== null ? Number(valor) : null); setCampo('grupoPaiId', null); }} placeholder="Nenhum — só cria a página" isClearable />
                    </InputComRotulo>
                    {form.menuAlvoId !== null && (
                        <>
                            <InputComRotulo rotulo="Grupo pai (opcional)">
                                <SelecionadorOpcoes opcoes={opcoesGrupos} valor={form.grupoPaiId !== null ? String(form.grupoPaiId) : null} onChange={valor => setCampo('grupoPaiId', valor !== null ? Number(valor) : null)} placeholder="Topo do menu" isClearable />
                            </InputComRotulo>
                            <InputComRotulo rotulo="Título do item">
                                <input type="text" value={form.tituloItem} onChange={e => setCampo('tituloItem', e.target.value)} placeholder={form.label.trim().length > 0 ? form.label : 'Igual ao Label'} />
                            </InputComRotulo>
                        </>
                    )}
                    <InputComRotulo rotulo="Música de fundo" classname={styles.campo_largo}>
                        {escolhendoMusica ? (
                            <div className={styles.caixa_musica}>
                                <Componente_Selecionador__MusicaDeFundo idInicial={form.idMusicaPagina} aoConfirmar={id => { setCampo('idMusicaPagina', id); setEscolhendoMusica(false); }} aoCancelar={() => setEscolhendoMusica(false)} />
                            </div>
                        ) : (
                            <div className={styles.musica_resumo}>
                                <span>{form.idMusicaPagina === null ? 'Nenhuma' : `Música #${form.idMusicaPagina}`}</span>
                                <button type="button" className={styles.botao_leve} onClick={() => setEscolhendoMusica(true)}>Escolher</button>
                                {form.idMusicaPagina !== null && <button type="button" className={styles.botao_leve} onClick={() => setCampo('idMusicaPagina', null)}>Remover</button>}
                            </div>
                        )}
                    </InputComRotulo>
                    {erro && <p className={styles.erro}>{erro}</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={criar} disabled={!podeSalvar}>{salvando ? 'Criando...' : 'Criar Página'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
