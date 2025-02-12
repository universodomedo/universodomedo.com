import { DadosAcao, DadosNomeCustomizado, NomeCustomizado, PaletaCores, } from 'Classes/ClassesTipos/index.ts';

export type Ritual = {
    readonly nome: NomeCustomizado;
    readonly svg: string;
    readonly dadosAcoes: DadosAcao[];
    readonly refElemento: Elemento;
    readonly refCirculoNivelRitual: CirculoNivelRitual;
};

export type DadosRitual = Pick<Ritual, 'dadosAcoes'> & {
    dadosNomeCustomizado: DadosNomeCustomizado;
    idElemento: number;
    idCirculoNivelRitual: number;
};

export type ElementoModelo = {
    id: number;
    nome: string;
    cores: PaletaCores;  
};

export type Elemento = ElementoModelo;

export type NivelRitualModelo = {
    id: number;
    nome: string;
};

export type NivelRitual = NivelRitualModelo;

export type CirculoRitualModelo = {
    id: number;
    nome: string;
};

export type CirculoRitual = CirculoRitualModelo;

export type CirculoNivelRitualModelo = {
    id: number;
    idCirculo: number;
    idNivel: number;
    valorPSSacrificado: number;
};

export type CirculoNivelRitual = CirculoNivelRitualModelo & {
    readonly nome: string;
    readonly refCirculo: CirculoRitualModelo;
    readonly refNivelRitual: NivelRitualModelo;
}

export type NivelComponenteModelo = {
    id: number;
    nome: string;
};

export type NivelComponente = NivelComponenteModelo;