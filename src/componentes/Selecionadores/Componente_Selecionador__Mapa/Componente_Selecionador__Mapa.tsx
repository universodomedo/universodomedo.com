'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useState } from 'react';
import type { Projeto3DMinimoPersistido, Projeto3DResumoPersistido } from 'types-nora-api';

import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao, type ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { MiniaturaMapa3D } from 'Componentes/ElementosDeJogo/MiniaturaMapa3D/MiniaturaMapa3D';
import { consultaProjetoMapa3D, listaMapas3D } from 'Funcionalidades/MapaJogavel/mapaJogavel.api';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';
import { dimensoesMapaDaCena } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';

// Seletor de Mapa jogável (Projeto 3D tipo MAPA) — instância do Componente_Selecionador com fonte REST (listaMapas3D).
// Devolve o PROJETO INTEIRO via aoConfirmar: quem configura precisa da cena (derivar dimensões), não só do id.
export function Componente_Selecionador__Mapa({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (projeto: Projeto3DMinimoPersistido) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const [registros, setRegistros] = useState<readonly Projeto3DResumoPersistido[]>([]);
    const [carregando, setCarregando] = useState<string | null>('Buscando Mapas');
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;
        listaMapas3D()
            .then(mapas => { if (ativo) { setRegistros(mapas); setCarregando(null); } })
            .catch(() => { if (ativo) { setErro('Não foi possível carregar os Mapas.'); setCarregando(null); } });
        return () => { ativo = false; };
    }, []);

    const listagem: ListagemCompostaListagem<Projeto3DResumoPersistido> = useMemo(() => ({ registros, carregando, erro, mensagemListaVazia: 'Nenhum Mapa encontrado. Crie um no Editor 3D (Novo › Mapa).' }), [registros, carregando, erro]);

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={mapa => mapa.id}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            renderizarItem={mapa => <ItemMapa mapa={mapa} />}
            aoConfirmar={async mapa => {
                // A confirmação precisa do projeto COMPLETO (cena p/ derivar dimensões), não só do resumo listado.
                const projeto = await consultaProjetoMapa3D(mapa.id);
                if (projeto) await aoConfirmar(projeto);
            }}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar este mapa"
        />
    );
};

// O preview do mapa vive DENTRO do card: miniatura 3D real (câmera fixa, clique atravessa e seleciona o card) + nome + dimensões.
function ItemMapa({ mapa }: { mapa: Projeto3DResumoPersistido }) {
    const { projetoMapa } = useProjetoMapa(mapa.id);
    const dimensoes = projetoMapa ? dimensoesMapaDaCena(projetoMapa.cenaCanonica) : null;

    return (
        <div className={styles.item_mapa}>
            <div className={styles.miniatura}>
                <MiniaturaMapa3D idProjeto={mapa.id} />
            </div>
            <span className={styles.nome}>{mapa.nome}</span>
            <small className={styles.dimensoes}>{dimensoes ? `${(dimensoes.larguraMilimetros / 1000).toFixed(1)}m × ${(dimensoes.alturaMilimetros / 1000).toFixed(1)}m` : '…'}</small>
        </div>
    );
};
