'use client';

import styles from './styles.module.css';

import type React from 'react';
import type { ItemPermissaoDto } from 'types-nora-api';

import { SecaoGalhoItemAtual } from 'Contextos/ContextoPaginaPermissoes/contexto';
import { BlocoFoco, BotaoTelaPermissoes, ItemPermissaoWidget, TextoVazio } from 'Componentes/ElementosVisuais/Permissoes/componentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

type RenderDetalhesSelecionado = React.ReactNode | ((item: ItemPermissaoDto) => React.ReactNode);

export default function PermissoesModoFoco({ secaoGalhoItemAtual, onFocoItem, onVoltar, renderDetalhesSelecionado, renderFooterDireita, getAcessoLeaf, renderAcaoItem, getIsLeaf }: { secaoGalhoItemAtual: SecaoGalhoItemAtual; onFocoItem: (idItem: number) => void; onVoltar: () => void; renderDetalhesSelecionado?: RenderDetalhesSelecionado; renderFooterDireita?: React.ReactNode; getAcessoLeaf?: (item: ItemPermissaoDto) => boolean; renderAcaoItem?: (item: ItemPermissaoDto) => React.ReactNode; getIsLeaf?: (item: ItemPermissaoDto) => boolean }) {
    const obtemAcessoLeaf = (item: ItemPermissaoDto | null) => item && getAcessoLeaf ? getAcessoLeaf(item) : undefined;
    const obtemIsLeaf = (item: ItemPermissaoDto) => getIsLeaf ? getIsLeaf(item) : item.childrenCount === 0;
    const renderAcaoSeAplicavel = (item: ItemPermissaoDto) => renderAcaoItem && obtemIsLeaf(item) ? renderAcaoItem(item) : null;

    return (
        <div className={styles.recipiente}>
            <div className={styles.foco}>
                <BlocoFoco titulo="Pai">
                    {secaoGalhoItemAtual.paiItemSelecionado
                        ? <>
                            <ItemPermissaoWidget item={secaoGalhoItemAtual.paiItemSelecionado} depth={0} isExpandable={false} disableHover showFocoButton onFoco={() => onFocoItem(secaoGalhoItemAtual.paiItemSelecionado!.id)} modo="card" acessoLeaf={obtemAcessoLeaf(secaoGalhoItemAtual.paiItemSelecionado)} />
                            {renderAcaoSeAplicavel(secaoGalhoItemAtual.paiItemSelecionado)}
                        </>
                        : <TextoVazio texto="RAIZ" />
                    }
                </BlocoFoco>

                <BlocoFoco titulo="Selecionado">
                    <ItemPermissaoWidget item={secaoGalhoItemAtual.itemSelecionado} depth={0} isExpandable={false} disableHover showFocoButton={false} onFoco={() => { }} modo="card-destaque" acessoLeaf={obtemAcessoLeaf(secaoGalhoItemAtual.itemSelecionado)} />
                    {renderAcaoSeAplicavel(secaoGalhoItemAtual.itemSelecionado)}
                    {typeof renderDetalhesSelecionado === 'function' ? renderDetalhesSelecionado(secaoGalhoItemAtual.itemSelecionado) : (renderDetalhesSelecionado ?? null)}
                </BlocoFoco>

                <BlocoFoco titulo="Filhos">
                    {secaoGalhoItemAtual.filhosItemSelecionado.length ? (
                        <div className={styles.lista_filhos} data-scrollable data-visibility-mode="sempreVisivel">
                            {renderAcaoItem
                                ? secaoGalhoItemAtual.filhosItemSelecionado.map((i) => (
                                    <div key={i.id} className={styles.recipiente_filho}>
                                        <ItemPermissaoWidget item={i} depth={0} isExpandable={false} disableHover showFocoButton onFoco={() => onFocoItem(i.id)} modo="linha" acessoLeaf={obtemAcessoLeaf(i)} />
                                        {renderAcaoSeAplicavel(i)}
                                    </div>
                                ))
                                : secaoGalhoItemAtual.filhosItemSelecionado.map((i) => <ItemPermissaoWidget key={i.id} item={i} depth={0} isExpandable={false} disableHover showFocoButton onFoco={() => onFocoItem(i.id)} modo="linha" acessoLeaf={obtemAcessoLeaf(i)} />)
                            }
                        </div>
                    ) : (
                        <TextoVazio texto="(sem filhos)" />
                    )}
                </BlocoFoco>
            </div>

            <div className={styles.footer_acoes}>
                <BotaoTelaPermissoes onClick={() => onVoltar()}>Voltar</BotaoTelaPermissoes>
                {renderFooterDireita ?? null}
            </div>
        </div>
    );
};

export function DetalhesUsuariosPermitidos({ itemSelecionado }: { itemSelecionado: ItemPermissaoDto }) {
    return (
        <div className={styles.detalhes_usuarios}>
            {itemSelecionado.listaIdsUsuariosPermitidos.length > 0
                ? itemSelecionado.listaIdsUsuariosPermitidos.map((idUsuarioPermitido) => <div key={idUsuarioPermitido} className={styles.avatar_usuario_permitido}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={idUsuarioPermitido} /></div>)
                : <div className={styles.detalhes_usuarios_mensagem}>Nenhum Usuário permitido</div>
            }
        </div>
    );
};