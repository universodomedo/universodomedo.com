'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useState } from 'react';

import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao, type ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { Renderiza__ImagemUDM__ArteCapaEnquadrada } from 'Uteis/RenderImagemUDM/Renderiza__ImagemUDM__ArteCapaEnquadrada';
import { listaCapasArte3D } from 'Funcionalidades/ArteDeCapa/arteDeCapa.api';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import type { Projeto3DCapaArteResumoPersistido } from 'types-nora-api';

// Seletor de Arte de Capa (Projeto 3D) — instância do Componente_Selecionador com fonte REST (listaCapasArte3D) embrulhada no formato do ListagemComposta. Devolve o idProjeto escolhido via aoConfirmar.
export function Componente_Selecionador__ArteCapa({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (idProjeto: number) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const [registros, setRegistros] = useState<readonly Projeto3DCapaArteResumoPersistido[]>([]);
    const [carregando, setCarregando] = useState<string | null>('Buscando Artes de Capa');
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;
        listaCapasArte3D()
            .then(capas => { if (ativo) { setRegistros(capas); setCarregando(null); } })
            .catch(() => { if (ativo) { setErro('Não foi possível carregar as Artes de Capa.'); setCarregando(null); } });
        return () => { ativo = false; };
    }, []);

    const listagem: ListagemCompostaListagem<Projeto3DCapaArteResumoPersistido> = useMemo(() => ({ registros, carregando, erro, mensagemListaVazia: 'Nenhuma Arte de Capa encontrada.' }), [registros, carregando, erro]);

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={capa => capa.idProjeto}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            renderizarItem={capa => <ItemCapa capa={capa} />}
            aoConfirmar={capa => aoConfirmar(capa.idProjeto)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar esta capa"
        />
    );
};

function ItemCapa({ capa }: { capa: Projeto3DCapaArteResumoPersistido }) {
    const imagem = useImagemCapaArte(capa.idProjeto);

    return (
        <div className={styles.item_capa}>
            <div className={styles.miniatura}>
                {imagem ? <Renderiza__ImagemUDM__ArteCapaEnquadrada imagemBase64={imagem} /> : <span className={styles.carregando}>…</span>}
            </div>
            <span className={styles.nome}>{capa.nome}</span>
        </div>
    );
};
