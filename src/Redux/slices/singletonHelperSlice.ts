// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SingletonHelper } from 'Types/classes_estaticas';
import { Circulo, Elemento, NivelRitual, CirculoRitual, BuffRef, Alcance, FormatoAlcance, Duracao, Execucao, TipoAcao, TipoAlvo, TipoCusto, TipoDano, CirculoNivelRitual, CorTooltip, PaletaCores, CategoriaAcao, TipoEstatisticaDanificavel, TipoEstatisticaBuffavel } from "Types/classes.tsx";
// #endregion

const singletonHelper = SingletonHelper.getInstance();

singletonHelper.tipo_estatistica_danificavel = [new TipoEstatisticaDanificavel(1, "Pontos de Vida", "P.V.", "#FF0000"), new TipoEstatisticaDanificavel(2, "Pontos de Sanidade", "P.S.", "#324A99"), new TipoEstatisticaDanificavel(3, "Pontos de Esforço", "P.E.", "#47BA16")];
singletonHelper.tipo_estatistica_buffavel = [
    new TipoEstatisticaBuffavel(1, "Defesa"),
    new TipoEstatisticaBuffavel(2, "Defesa Adicional por Agilidade"),
    new TipoEstatisticaBuffavel(3, "Defesa Adicional por Força"),
    new TipoEstatisticaBuffavel(4, "Defesa Adicional por Vigor"),
    new TipoEstatisticaBuffavel(5, "Resistência Paranormal"),
    new TipoEstatisticaBuffavel(6, "Deslocamento"),
    new TipoEstatisticaBuffavel(7, "Número de Ações Padrões"),
    new TipoEstatisticaBuffavel(8, "Número de Ações de Movimento"),
    new TipoEstatisticaBuffavel(9, "Número de Reações"),
    new TipoEstatisticaBuffavel(10, "Número de Ações Ritualísticas"),
    new TipoEstatisticaBuffavel(11, "Número de Ações Investigativas"),
    new TipoEstatisticaBuffavel(12, "Espaço de Inventário"),
    new TipoEstatisticaBuffavel(13, "Espaço de Inventário Adicional por Força"),
    new TipoEstatisticaBuffavel(14, "Espaços de Categoria 1"),
    new TipoEstatisticaBuffavel(15, "Espaços de Categoria 2"),
    new TipoEstatisticaBuffavel(16, "Espaços de Categoria 3"),
    new TipoEstatisticaBuffavel(17, "Espaços de Categoria 4"),
    new TipoEstatisticaBuffavel(18, "Número de Extremidades"),
];
singletonHelper.elementos = [new Elemento(1, "Energia", { corPrimaria: "#CD23EA", corSecundaria: "#5C1767", corTerciaria: "#D84Ef5" }), new Elemento(2, "Conhecimento", { corPrimaria: "#F7F157" }), new Elemento(3, "Medo", { corPrimaria: "#8F8F8F" }), new Elemento(4, "Morte", { corPrimaria: "#0E0D0D" }), new Elemento(5, "Sangue", { corPrimaria: "#B92324" })];
singletonHelper.niveis_ritual = [new NivelRitual(1, "Fraco"), new NivelRitual(2, "Médio"), new NivelRitual(3, "Forte")];
singletonHelper.circulos_ritual = [new CirculoRitual(1, "1"), new CirculoRitual(2, "2"), new CirculoRitual(3, "3")];
singletonHelper.circulos_niveis_ritual = [new CirculoNivelRitual(1, 1, 1), new CirculoNivelRitual(2, 1, 2), new CirculoNivelRitual(3, 1, 3), new CirculoNivelRitual(4, 2, 1), new CirculoNivelRitual(5, 2, 2), new CirculoNivelRitual(6, 2, 3), new CirculoNivelRitual(7, 3, 1), new CirculoNivelRitual(8, 3, 2), new CirculoNivelRitual(9, 3, 3)];
singletonHelper.buffs = [new BuffRef(1, "Agilidade"), new BuffRef(2, "Força"), new BuffRef(3, "Inteligência"), new BuffRef(4, "Presença"), new BuffRef(5, "Vigor"), new BuffRef(6, "Acrobacia"), new BuffRef(7, "Adestramento"), new BuffRef(8, "Artes"), new BuffRef(9, "Atletismo"), new BuffRef(10, "Atualidades"), new BuffRef(11, "Ciências"), new BuffRef(12, "Crime"), new BuffRef(13, "Diplomacia"), new BuffRef(14, "Enganação"), new BuffRef(15, "Engenharia"), new BuffRef(16, "Fortitude"), new BuffRef(17, "Furtividade"), new BuffRef(18, "Iniciativa"), new BuffRef(19, "Intimidação"), new BuffRef(20, "Intuição"), new BuffRef(21, "Investigação"), new BuffRef(22, "Luta"), new BuffRef(23, "Medicina"), new BuffRef(24, "Ocultista"), new BuffRef(25, "Percepção"), new BuffRef(26, "Pontaria"), new BuffRef(27, "Reflexo"), new BuffRef(28, "Sobrevivência"), new BuffRef(29, "Tatica"), new BuffRef(30, "Tecnologia"), new BuffRef(31, "Vontade"), new BuffRef(32, "R.D. Vital"), new BuffRef(33, "R.D. Mundano"), new BuffRef(34, "R.D. Concussivo"), new BuffRef(35, "R.D. Cortante"), new BuffRef(36, "R.D. Perfurante"), new BuffRef(37, "R.D. Natural"), new BuffRef(38, "R.D. Elétrico"), new BuffRef(39, "R.D. Fogo"), new BuffRef(40, "R.D. Frio"), new BuffRef(41, "R.D. Químico"), new BuffRef(42, "R.D. Elemental"), new BuffRef(43, "R.D. Conhecimento"), new BuffRef(44, "R.D. Sangue"), new BuffRef(45, "R.D. Energia"), new BuffRef(46, "R.D. Morte"), new BuffRef(47, "R.D. Medo"), new BuffRef(48, "R.D. Mental"), new BuffRef(49, "R.D. Debilitante"), new BuffRef(50, "Dano"), new BuffRef(51, "Variância")];
singletonHelper.alcances = [new Alcance(1, "Adjacente"), new Alcance(2, "Próximo"), new Alcance(3, "Curto"), new Alcance(4, "Médio"), new Alcance(5, "Longo"), new Alcance(6, "Ambiente"), new Alcance(7, "Ilimitado")];
singletonHelper.formatos_alcance = [new FormatoAlcance(1, "Selecionado"), new FormatoAlcance(2, "Linha Reta"), new FormatoAlcance(3, "Cone"), new FormatoAlcance(4, "Área")];
singletonHelper.duracoes = [new Duracao(1, "Ação"), new Duracao(2, "Turno"), new Duracao(3, "Cena"), new Duracao(4, "Dia"), new Duracao(5, "Intermitente")];
singletonHelper.execucoes = [new Execucao(1, "Ação Livre"), new Execucao(2, "Ação Padrão"), new Execucao(3, "Ação de Movimento"), new Execucao(4, "Reação"), new Execucao(5, "Ação Ritualística"), new Execucao(6, "Ação Investigativa"), new Execucao(7, "Comando Doméstico")];
singletonHelper.categorias_acao = [new CategoriaAcao(1, "Ativo"), new CategoriaAcao(2, "Passiva")];
singletonHelper.tipos_acao = [new TipoAcao(1, "Ação Direta Pacifica"), new TipoAcao(2, "Ação Direta Agressiva"), new TipoAcao(3, "Aplicação de Efeito Positivo"), new TipoAcao(4, "Aplicação de Efeito Negativo")];
singletonHelper.tipos_alvo = [new TipoAlvo(1, "Pessoal"), new TipoAlvo(2, "Ser"), new TipoAlvo(3, "Objeto"), new TipoAlvo(4, "Ponto"), new TipoAlvo(5, "Direção")];
singletonHelper.tipos_custo = [new TipoCusto(1, "Gasto de P.E.")];
singletonHelper.tipos_dano = [new TipoDano(1, "Vital"), new TipoDano(2, "Mundano"), new TipoDano(3, "Concussivo"), new TipoDano(4, "Cortante"), new TipoDano(5, "Perfurante"), new TipoDano(6, "Natural"), new TipoDano(7, "Elétrico"), new TipoDano(8, "Fogo"), new TipoDano(9, "Frio"), new TipoDano(10, "Químico"), new TipoDano(11, "Elemental"), new TipoDano(12, "Conhecimento"), new TipoDano(13, "Sangue"), new TipoDano(14, "Energia"), new TipoDano(15, "Morte"), new TipoDano(16, "Medo"), new TipoDano(17, "Mental"), new TipoDano(18, "Debilitante")];

const singletonHelperSlice = createSlice({
    name: 'singletonHelper',
    initialState: {
        singletonHelper,
    },
    reducers: {},
});

export default singletonHelperSlice.reducer;