// #region Imports
import { createSlice } from '@reduxjs/toolkit';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
import * as DadosRecuperadosDoBanco from '../../DadosTemporarios/DadosRecuperadosDoBanco.ts';
// #endregion

const singletonHelper = SingletonHelper.getInstance();

const singletonHelperSlice = createSlice({
    name: 'singletonHelper',
    initialState: { singletonHelper },
    reducers: {},
});

singletonHelper.alcances = DadosRecuperadosDoBanco.registrosAlcanceModelo.map(registro => { return { ...registro } });

singletonHelper.atributos = DadosRecuperadosDoBanco.registrosAtributoModelo.map(registro => {
    return {
        ...registro,
        get nomeAbreviado() { return this.nome.toUpperCase().slice(0, 3); },
        get refLinhaEfeito() { return singletonHelper.linhas_efeito.find(linhaEfeito => linhaEfeito.id === this.idLinhaEfeito)!; },
    }
});

singletonHelper.circulos_niveis_ritual = DadosRecuperadosDoBanco.registrosCirculoNivelRitualModelo.map(registro => {
    return {
        ...registro,
        get nome() { return `${this.refCirculo.nome}º Círculo ${this.refNivelRitual.nome}`; },
        get refCirculo() { return singletonHelper.circulos_ritual.find(circuloRitual => circuloRitual.id === this.idCirculo)!; },
        get refNivelRitual() { return singletonHelper.niveis_ritual.find(nivelRitual => nivelRitual.id === this.idNivel)!; },
    }
});

singletonHelper.circulos_ritual = DadosRecuperadosDoBanco.registrosCirculoRitualModelo.map(registro => { return { ...registro } });

singletonHelper.classes = DadosRecuperadosDoBanco.registrosClasseModelo.map(registro => { return { ...registro } });

singletonHelper.duracoes = DadosRecuperadosDoBanco.registrosDuracaoModelo.map(registro => { return { ...registro } });

singletonHelper.elementos = DadosRecuperadosDoBanco.registrosElementoModelo.map(registro => { return { ...registro } });

singletonHelper.estatisticas_danificavel = DadosRecuperadosDoBanco.registrosEstatisticaDanificavelModelo.map(registro => {
    return {
        ...registro,
        get nomeAbreviado() { return this.nome.split(" ").filter(word => word.toLowerCase() !== "de").map(word => word[0].toUpperCase()).join(".") + "."; },
    }
});

singletonHelper.execucoes = DadosRecuperadosDoBanco.registrosExecucaoModelo.map(registro => {
    return {
        ...registro,
        get nomeExibicao() { return `Ação ${this.nome}`; },
        get refLinhaEfeito() { return singletonHelper.linhas_efeito.find(linhaEfeito => linhaEfeito.id === this.idLinhaEfeito)!; },
    }
});

singletonHelper.formatos_alcance = DadosRecuperadosDoBanco.registrosFormatoAlcanceModelo.map(registro => { return { ...registro } });

singletonHelper.linhas_efeito = DadosRecuperadosDoBanco.registrosLinhaEfeitoModelo.map(registro => { return { ...registro } });

singletonHelper.niveis_componente = DadosRecuperadosDoBanco.registrosNivelComponenteModelo.map(registro => { return { ...registro } });

singletonHelper.niveis = DadosRecuperadosDoBanco.registrosNivelModelo.map(registro => {
    return {
        ...registro,
        get nomeDisplay() { return `NEX ${this.nome}%`; },
    }
});

singletonHelper.niveis_proficiencia = DadosRecuperadosDoBanco.registrosNivelProficienciaModelo.map(registro => { return { ...registro } });

singletonHelper.niveis_ritual = DadosRecuperadosDoBanco.registrosNivelRitualModelo.map(registro => { return { ...registro } });

singletonHelper.patentes_pericia = DadosRecuperadosDoBanco.registrosPatentePericiaModelo.map(registro => { return { ...registro } });

singletonHelper.pericias = DadosRecuperadosDoBanco.registrosPericiaModelo.map(registro => {
    return {
        ...registro,
        get nomeAbreviado() { return this.nome.toUpperCase().slice(0, 4); },
        get refLinhaEfeito() { return singletonHelper.linhas_efeito.find(linhaEfeito => linhaEfeito.id === this.idLinhaEfeito)!; },
        get refAtributo() { return singletonHelper.atributos.find(atributo => atributo.id === this.idAtributo)!; },
    }
});

singletonHelper.tipos_alvo = DadosRecuperadosDoBanco.registrosTipoAlvoModelo.map(registro => { return { ...registro } });

singletonHelper.tipos_categoria = DadosRecuperadosDoBanco.registrosTipoCategoriaModelo.map(registro => {
    return {
        ...registro,
        get nomeCategoria() { return `Categoria ${this.valorCategoria}`; }
    }
});

singletonHelper.tipos_dano = DadosRecuperadosDoBanco.registrosTipoDanoModelo.map(registro => {
    return {
        ...registro,
        get refLinhaEfeito() { return singletonHelper.linhas_efeito.find(linhaEfeito => linhaEfeito.id === this.idLinhaEfeito)!; },
        get refTipoDanoPertecente() { return singletonHelper.tipos_dano.find(tipoDano => tipoDano.id === this.idDanoPertencente) ?? undefined; },
    }
});

singletonHelper.tipos_efeito = DadosRecuperadosDoBanco.registrosTipoEfeitoModelo.map(registro => { return { ...registro } });

singletonHelper.tipos_items = DadosRecuperadosDoBanco.registrosTipoItemModelo.map(registro => { return { ...registro } });

singletonHelper.tipos_proficiencia = DadosRecuperadosDoBanco.registrosTipoProficienciaModelo.map(registro => { return { ...registro } });

export default singletonHelperSlice.reducer;