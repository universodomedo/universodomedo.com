'use client';

import styles from './styles.module.css';

import type React from 'react';
import type { ItemPermissaoDto } from 'types-nora-api';

import { BlocoFoco, Botao, ItemPermissaoWidget, TextoVazio } from 'Componentes/ElementosVisuais/Permissoes/componentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

type RenderDetalhesSelecionado = React.ReactNode | ((item: ItemPermissaoDto) => React.ReactNode);

export default function PermissoesModoFoco({ itemSelecionado, itemPaiSelecionado, filhosItemSelecionado, onFocoItem, onVoltar, renderDetalhesSelecionado, renderFooterDireita, }: { itemSelecionado: ItemPermissaoDto; itemPaiSelecionado: ItemPermissaoDto | null; filhosItemSelecionado: ItemPermissaoDto[]; onFocoItem: (idItem: number) => void; onVoltar: () => void; renderDetalhesSelecionado?: RenderDetalhesSelecionado; renderFooterDireita?: React.ReactNode; }) {
    return (
        <div className={styles.recipiente}>
            <div className={styles.foco}>
                <BlocoFoco titulo="Pai">
                    {itemPaiSelecionado
                        ? <ItemPermissaoWidget item={itemPaiSelecionado} depth={0} isExpandable={false} disableHover showFocoButton onFoco={() => onFocoItem(itemPaiSelecionado.id)} modo="card" />
                        : <TextoVazio texto="RAIZ" />
                    }
                </BlocoFoco>

                <BlocoFoco titulo="Selecionado">
                    <ItemPermissaoWidget item={itemSelecionado} depth={0} isExpandable={false} disableHover showFocoButton={false} onFoco={() => { }} modo="card-destaque" />
                    {typeof renderDetalhesSelecionado === 'function' ? renderDetalhesSelecionado(itemSelecionado) : (renderDetalhesSelecionado ?? null)}
                </BlocoFoco>

                <BlocoFoco titulo="Filhos">
                    {filhosItemSelecionado.length ? (
                        <div className={styles.lista_filhos} data-scrollable data-visibility-mode="sempreVisivel">
                            {filhosItemSelecionado.map((i) => (
                                <ItemPermissaoWidget key={i.id} item={i} depth={0} isExpandable={false} disableHover showFocoButton onFoco={() => onFocoItem(i.id)} modo="linha" />
                            ))}
                        </div>
                    ) : (
                        <TextoVazio texto="(sem filhos)" />
                    )}
                </BlocoFoco>
            </div>

            <div className={styles.footer_acoes}>
                <Botao onClick={() => onVoltar()}>Voltar</Botao>
                {renderFooterDireita ?? null}
            </div>
        </div>
    );
};

export function DetalhesUsuariosPermitidos({ itemSelecionado }: { itemSelecionado: ItemPermissaoDto }) {
    return (
        <div className={styles.detalhes_usuarios}>
            {itemSelecionado.listaIdsUsuariosPermitidos.length > 0
                ? itemSelecionado.listaIdsUsuariosPermitidos.map((idUsuarioPermitido) => (
                    <div key={idUsuarioPermitido} className={styles.avatar_usuario_permitido}>
                        <AvatarUsuarioEmVisualizacao_CACHED idUsuario={idUsuarioPermitido} />
                    </div>
                ))
                : <div className={styles.detalhes_usuarios_mensagem}>Nenhum Usuário permitido</div>
            }
        </div>
    );
};