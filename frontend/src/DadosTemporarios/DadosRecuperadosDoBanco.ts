// #region Imports
import { AlcanceModelo, AtributoModelo, CirculoNivelRitualModelo, CirculoRitualModelo, ClasseModelo, DuracaoModelo, ElementoModelo, EstatisticaDanificavelModelo, ExecucaoModelo, FormatoAlcanceModelo, LinhaEfeitoModelo, NivelComponenteModelo, NivelModelo, NivelProficienciaModelo, NivelRitualModelo, PatentePericiaModelo, PericiaModelo, TipoAlvoModelo, TipoCategoriaModelo, TipoDanoModelo, TipoEfeitoModelo, TipoItemModelo, TipoProficienciaModelo } from "Classes/ClassesTipos/index.ts";
// #endregion

export const registrosAlcanceModelo: AlcanceModelo[] = [
    { id: 1, nome: "Adjacente" },
    { id: 2, nome: "Próximo" },
    { id: 3, nome: "Curto" },
    { id: 4, nome: "Médio" },
    { id: 5, nome: "Longo" },
    { id: 6, nome: "Ambiente" },
    { id: 7, nome: "Ilimitado" },
];

export const registrosAtributoModelo: AtributoModelo[] = [
    { id: 1, idLinhaEfeito: 1, nome: 'Agilidade', descricao: 'Índice da velocidade e precisão que seu corpo responde a estímulos' },
    { id: 2, idLinhaEfeito: 2, nome: 'Força', descricao: 'Índice da construção física de seu corpo' },
    { id: 3, idLinhaEfeito: 3, nome: 'Inteligência', descricao: 'Índice da sua capacidade mental, que responde à atividades intelectuais e memórias' },
    { id: 4, idLinhaEfeito: 4, nome: 'Presença', descricao: 'Índice de seus sentidos e habilidades sociais' },
    { id: 5, idLinhaEfeito: 5, nome: 'Vigor', descricao: 'Índice da sua resistência física e persistência' },
];

export const registrosCirculoNivelRitualModelo: CirculoNivelRitualModelo[] = [
    { id: 1, idCirculo: 1, idNivel: 1, valorPSSacrificado: 0 },
    { id: 2, idCirculo: 1, idNivel: 2, valorPSSacrificado: 5 },
    { id: 3, idCirculo: 1, idNivel: 3, valorPSSacrificado: 10 },
    { id: 4, idCirculo: 2, idNivel: 1, valorPSSacrificado: 5 },
    { id: 5, idCirculo: 2, idNivel: 2, valorPSSacrificado: 10 },
    { id: 6, idCirculo: 2, idNivel: 3, valorPSSacrificado: 15 },
    { id: 7, idCirculo: 3, idNivel: 1, valorPSSacrificado: 10 },
    { id: 8, idCirculo: 3, idNivel: 2, valorPSSacrificado: 15 },
    { id: 9, idCirculo: 3, idNivel: 3, valorPSSacrificado: 20 },
];

export const registrosCirculoRitualModelo: CirculoRitualModelo[] = [
    { id: 1, nome: "1" },
    { id: 2, nome: "2" },
    { id: 3, nome: "3" },
];

export const registrosClasseModelo: ClasseModelo[] = [
    { id: 1, nome: 'Mundano', descricao: '' },
    { id: 2, nome: 'Combatente', descricao: 'Combatentes tem os melhores Ganhos de Estatísticas, além de receber Pontos de Atributos Bônus durante seu crescimento' },
    { id: 3, nome: 'Especialista', descricao: 'Especialistas tem os melhores ganhos de Aprimoramento de Patente de Perícia, acompanhado do maior número de Habilidades de Perícias' },
    { id: 4, nome: 'Ocultista', descricao: 'Ocultistas tem o melhor Ganho de Pontos de Sanidade, além de receber vários Rituais Bônus' },
];

export const registrosDuracaoModelo: DuracaoModelo[] = [
    { id: 1, nome: "Ação" },
    { id: 2, nome: "Turno" },
    { id: 3, nome: "Cena" },
    { id: 4, nome: "Dia" },
    { id: 5, nome: "Intermitente" },
];

export const registrosElementoModelo: ElementoModelo[] = [
    { id: 1, nome: "Conhecimento", cores: { corPrimaria: "#F7F157" } },
    { id: 2, nome: "Energia", cores: { corPrimaria: "#CD23EA", corSecundaria: "#5C1767", corTerciaria: "#D84Ef5" } },
    { id: 3, nome: "Medo", cores: { corPrimaria: "#8F8F8F" } },
    { id: 4, nome: "Morte", cores: { corPrimaria: "#0E0D0D" } },
    { id: 5, nome: "Sangue", cores: { corPrimaria: "#B92324" } },
];

export const registrosEstatisticaDanificavelModelo: EstatisticaDanificavelModelo[] = [
    { id: 1, nome: "Pontos de Vida", cor: "#FF0000", descricao: "Mostram a Saúde Física e Vital do seu Personagem, traduzindo Ferimentos e Condições Físicas. Ao zerar, você automaticamente recebe a condição Morrendo" },
    { id: 2, nome: "Pontos de Sanidade", cor: "#324A99", descricao: "Mostram o seu Estado de Mente e Espírito, traduzindo sua proximidade com o Paranormal. Ao zerar, você automaticamente recebe a condição Enlouquecendo" },
    { id: 3, nome: "Pontos de Esforço", cor: "#47BA16", descricao: "Mostram a sua capacidade de agir além do seu limite habitual, como Ações Especiais e Usar o Paranormal, traduzindo o seu cansaço" },
];

export const registrosExecucaoModelo: ExecucaoModelo[] = [
    { id: 1, idLinhaEfeito: 55, nome: "Ação Livre" },
    { id: 2, idLinhaEfeito: 56, nome: "Ação Padrão" },
    { id: 3, idLinhaEfeito: 57, nome: "Ação de Movimento" },
    { id: 4, idLinhaEfeito: 58, nome: "Reação" },
    { id: 5, idLinhaEfeito: 59, nome: "Ação Ritualística" },
    { id: 6, idLinhaEfeito: 60, nome: "Ação Investigativa" },
    { id: 7, idLinhaEfeito: 61, nome: "Ação de Comando" },
];

export const registrosFormatoAlcanceModelo: FormatoAlcanceModelo[] = [
    { id: 1, nome: "Selecionado" },
    { id: 2, nome: "Linha Reta" },
    { id: 3, nome: "Cone" },
    { id: 4, nome: "Área" },
];

export const registrosLinhaEfeitoModelo: LinhaEfeitoModelo[] = [
    { id: 1, nome: "Agilidade" },
    { id: 2, nome: "Força" },
    { id: 3, nome: "Inteligência" },
    { id: 4, nome: "Presença" },
    { id: 5, nome: "Vigor" },
    { id: 6, nome: "Acrobacia" },
    { id: 7, nome: "Adestramento" },
    { id: 8, nome: "Artes" },
    { id: 9, nome: "Atletismo" },
    { id: 10, nome: "Atualidades" },
    { id: 11, nome: "Ciências" },
    { id: 12, nome: "Crime" },
    { id: 13, nome: "Diplomacia" },
    { id: 14, nome: "Enganação" },
    { id: 15, nome: "Engenharia" },
    { id: 16, nome: "Fortitude" },
    { id: 17, nome: "Furtividade" },
    { id: 18, nome: "Iniciativa" },
    { id: 19, nome: "Intimidação" },
    { id: 20, nome: "Intuição" },
    { id: 21, nome: "Investigação" },
    { id: 22, nome: "Luta" },
    { id: 23, nome: "Medicina" },
    { id: 24, nome: "Ocultismo" },
    { id: 25, nome: "Percepção" },
    { id: 26, nome: "Pontaria" },
    { id: 27, nome: "Reflexo" },
    { id: 28, nome: "Sobrevivência" },
    { id: 29, nome: "Tatica" },
    { id: 30, nome: "Tecnologia" },
    { id: 31, nome: "Vontade" },
    { id: 32, nome: "R.D. Vital" },
    { id: 33, nome: "R.D. Mundano" },
    { id: 34, nome: "R.D. Concussivo" },
    { id: 35, nome: "R.D. Cortante" },
    { id: 36, nome: "R.D. Perfurante" },
    { id: 37, nome: "R.D. Natural" },
    { id: 38, nome: "R.D. Elétrico" },
    { id: 39, nome: "R.D. Fogo" },
    { id: 40, nome: "R.D. Frio" },
    { id: 41, nome: "R.D. Químico" },
    { id: 42, nome: "R.D. Elemental" },
    { id: 43, nome: "R.D. Conhecimento" },
    { id: 44, nome: "R.D. Sangue" },
    { id: 45, nome: "R.D. Energia" },
    { id: 46, nome: "R.D. Morte" },
    { id: 47, nome: "R.D. Medo" },
    { id: 48, nome: "R.D. Mental" },
    { id: 49, nome: "R.D. Debilitante" },
    { id: 50, nome: "Dano" },
    { id: 51, nome: "Variância" },
    { id: 52, nome: 'Capacidade de Carga' },
    { id: 53, nome: 'Deslocamento' },
    { id: 54, nome: 'Defesa' },
    { id: 55, nome: 'Número de Ações Livre' },
    { id: 56, nome: 'Número de Ações Padrão' },
    { id: 57, nome: 'Número de Ações de Movimento' },
    { id: 58, nome: 'Número de Reações' },
    { id: 59, nome: 'Número de Ações Ritualística' },
    { id: 60, nome: 'Número de Ações Investigativa' },
    { id: 61, nome: 'Número de Comandos Doméstico' },
    { id: 62, nome: 'Desconto de P.E. para Rituais' },
    { id: 63, nome: 'Pontos de Característica de Arma de Ataque Corpo-a-Corpo' },
    { id: 64, nome: 'Pontos de Característica de Arma de Ataque a Distância' },
];

export const registrosNivelComponenteModelo: NivelComponenteModelo[] = [
    { id: 1, nome: "Simples" },
    { id: 2, nome: "Complexo" },
    { id: 3, nome: "Especial" },
];

export const registrosNivelModelo: NivelModelo[] = [ 
    { id: 1, nome: '0' },
    { id: 2, nome: '5' },
    { id: 3, nome: '10' },
    { id: 4, nome: '15' },
    { id: 5, nome: '20' },
    { id: 6, nome: '25' },
    { id: 7, nome: '30' },
    { id: 8, nome: '35' },
    { id: 9, nome: '40' },
    { id: 10, nome: '45' },
    { id: 11, nome: '50' },
    { id: 12, nome: '55' },
    { id: 13, nome: '60' },
    { id: 14, nome: '65' },
    { id: 15, nome: '70' },
    { id: 16, nome: '75' },
    { id: 17, nome: '80' },
    { id: 18, nome: '85' },
    { id: 19, nome: '90' },
    { id: 20, nome: '95' },
    { id: 21, nome: '99' },
];

export const registrosNivelProficienciaModelo: NivelProficienciaModelo[] = [
    { nomeNivel: 'Simples', idTipoProficiencia: 1, idNivelProficiencia: 1, },
    { nomeNivel: 'Complexas', idTipoProficiencia: 1, idNivelProficiencia: 2, },
    { nomeNivel: 'Especiais', idTipoProficiencia: 1, idNivelProficiencia: 3, },
    { nomeNivel: 'Simples', idTipoProficiencia: 2, idNivelProficiencia: 1, },
    { nomeNivel: 'Complexas', idTipoProficiencia: 2, idNivelProficiencia: 2, },
    { nomeNivel: 'Especiais', idTipoProficiencia: 2, idNivelProficiencia: 3, },
    { nomeNivel: 'Simples', idTipoProficiencia: 3, idNivelProficiencia: 1, },
    { nomeNivel: 'Complexas', idTipoProficiencia: 3, idNivelProficiencia: 2, },
    { nomeNivel: 'Especiais', idTipoProficiencia: 3, idNivelProficiencia: 3, },
    { nomeNivel: 'Mundanas', idTipoProficiencia: 4, idNivelProficiencia: 1, },
    { nomeNivel: 'Simples', idTipoProficiencia: 4, idNivelProficiencia: 2, },
    { nomeNivel: 'Complexas', idTipoProficiencia: 4, idNivelProficiencia: 3, },
    { nomeNivel: 'Especiais', idTipoProficiencia: 4, idNivelProficiencia: 4, },
    { nomeNivel: 'Simples', idTipoProficiencia: 5, idNivelProficiencia: 1, },
    { nomeNivel: 'Complexa', idTipoProficiencia: 5, idNivelProficiencia: 2, },
    { nomeNivel: 'Especial', idTipoProficiencia: 5, idNivelProficiencia: 3, },
    { nomeNivel: 'de Primeiro Círculo', idTipoProficiencia: 6, idNivelProficiencia: 1, },
    { nomeNivel: 'de Segundo Círculo', idTipoProficiencia: 6, idNivelProficiencia: 2, },
    { nomeNivel: 'de Terceiro Círculo', idTipoProficiencia: 6, idNivelProficiencia: 3, },
];

export const registrosNivelRitualModelo: NivelRitualModelo[] = [
    { id: 1, nome: "Fraco" },
    { id: 2, nome: "Médio" },
    { id: 3, nome: "Forte" },
];

export const registrosPatentePericiaModelo: PatentePericiaModelo[] = [
    { id: 1, nome: "Destreinado", valor: 0, corTexto: '#CDCDCD' },
    { id: 2, nome: "Treinado", valor: 5, corTexto: '#EBEF5D' },
    { id: 3, nome: "Veterano", valor: 10, corTexto: '#E59627' },
    { id: 4, nome: "Expert", valor: 15, corTexto: '#FF4A24' },
];

export const registrosPericiaModelo: PericiaModelo[] = [
    { id: 1, idAtributo: 1, idLinhaEfeito: 6, nome: 'Acrobacia', descricao: 'Experiência em movimentação vertical e manobras, como realizar movimentos não lineares ou em maior velocidade' },
    { id: 2, idAtributo: 1, idLinhaEfeito: 12, nome: 'Crime', descricao: 'Experiência no roubo e encobrimento de objetos, assim como a resolução e manuseio de pequenos mecanismos' },
    { id: 3, idAtributo: 1, idLinhaEfeito: 17, nome: 'Furtividade', descricao: 'Experiência em se esconder e tomar ações estando despercebido, assim como atacar furtivamente e se mesclar no ambiente' },
    { id: 4, idAtributo: 1, idLinhaEfeito: 18, nome: 'Iniciativa', descricao: 'Experiência em tomar ações de maneira preventiva, se preparando para situações especificas ou reagindo a ações tomadas por outros' },
    { id: 5, idAtributo: 1, idLinhaEfeito: 26, nome: 'Pontaria', descricao: 'Experiência no manuseio de armas de longo alcance e suas utilizações' },
    { id: 6, idAtributo: 1, idLinhaEfeito: 27, nome: 'Reflexo', descricao: 'Experiência em reagir defensivamente a situações inesperadas' },
    { id: 7, idAtributo: 2, idLinhaEfeito: 9, nome: 'Atletismo', descricao: 'Experiência em utilizar o máximo de sua capacidade física' },
    { id: 8, idAtributo: 2, idLinhaEfeito: 22, nome: 'Luta', descricao: 'Experiência no manuseio de armas corpo-a-corpo e suas utlizações' },
    { id: 9, idAtributo: 3, idLinhaEfeito: 7, nome: 'Adestramento', descricao: 'Experiência na domesticação, treinamento e relacionamento com seres domesticáveis' },
    { id: 10, idAtributo: 3, idLinhaEfeito: 8, nome: 'Artes', descricao: 'Experiência na execução de ações magistrais, que procuram chamar atenção do público' },
    { id: 11, idAtributo: 3, idLinhaEfeito: 10, nome: 'Atualidades', descricao: 'Experiência no estudo de acontecimentos do mundo e como eles se afetam' },
    { id: 12, idAtributo: 3, idLinhaEfeito: 11, nome: 'Ciências', descricao: 'Experiência no estudo de matérias biológicas e lógicas, utilizadas na confecção e produção de substâncias' },
    { id: 13, idAtributo: 3, idLinhaEfeito: 15, nome: 'Engenharia', descricao: 'Experiência na produção de ferramentas, equipamentos e utensílios' },
    { id: 14, idAtributo: 3, idLinhaEfeito: 21, nome: 'Investigação', descricao: 'Experiência na busca de detalhes e atenção a pistas no ambiente ou em objetos' },
    { id: 15, idAtributo: 3, idLinhaEfeito: 23, nome: 'Medicina', descricao: 'Experiência no tratamento de ferimentos, condições negativas e suas adversidades em materiais biológicos' },
    { id: 16, idAtributo: 3, idLinhaEfeito: 24, nome: 'Ocultismo', descricao: 'Experiência em estudar e se comunicar com o outro lado' },
    { id: 17, idAtributo: 3, idLinhaEfeito: 28, nome: 'Sobrevivência', descricao: 'Experiência em utilizar de materiais naturais para sobreviver ou se adaptar à ambientes inóspitos e vida selvagem' },
    { id: 18, idAtributo: 3, idLinhaEfeito: 29, nome: 'Tatica', descricao: 'Experiência em estudar e analisar o ambiente e seus alvos para melhor explorá-los' },
    { id: 19, idAtributo: 3, idLinhaEfeito: 30, nome: 'Tecnologia', descricao: 'Experiência na utilizaçao de equipamentos tecnológicos e seus conhecimentos' },
    { id: 20, idAtributo: 4, idLinhaEfeito: 13, nome: 'Diplomacia', descricao: 'Experiência na comunicação com outros seres racionais e suas vantagens' },
    { id: 21, idAtributo: 4, idLinhaEfeito: 14, nome: 'Enganação', descricao: 'Experiência em esconder ou mentir informações e trabalhar com disfarces' },
    { id: 22, idAtributo: 4, idLinhaEfeito: 19, nome: 'Intimidação', descricao: 'Experiência em coagir oui amendrontar seus alvos' },
    { id: 23, idAtributo: 4, idLinhaEfeito: 20, nome: 'Intuição', descricao: 'Experiência na analise da omissão de informações de outros seres racionais' },
    { id: 24, idAtributo: 4, idLinhaEfeito: 25, nome: 'Percepção', descricao: 'Experiência em observar, analisar e estudar seus arredores, como padrões ou alterações no ambiente' },
    { id: 25, idAtributo: 4, idLinhaEfeito: 31, nome: 'Vontade', descricao: 'Experiência em resistir a condições e danos mentais' },
    { id: 26, idAtributo: 5, idLinhaEfeito: 16, nome: 'Fortitude', descricao: 'Experiência em resistir a condições e danos físicos, assim como danos graves' },
];

export const registrosTipoAlvoModelo: TipoAlvoModelo[] = [
    { id: 1, nome: "Pessoal" },
    { id: 2, nome: "Ser" },
    { id: 3, nome: "Objeto" },
    { id: 4, nome: "Ponto" },
    { id: 5, nome: "Direção" },
];

export const registrosTipoCategoriaModelo: TipoCategoriaModelo[] = [
    { id: 1, valorCategoria: 0, },
    { id: 2, valorCategoria: 1, },
    { id: 3, valorCategoria: 2, },
    { id: 4, valorCategoria: 3, },
    { id: 5, valorCategoria: 4, },
];

export const registrosTipoDanoModelo: TipoDanoModelo[] = [
    { id: 1, nome: "Vital", idLinhaEfeito: 32 },
    { id: 2, nome: "Mundano", idLinhaEfeito: 33, idDanoPertencente: 1 },
    { id: 3, nome: "Concussivo", idLinhaEfeito: 34, idDanoPertencente: 2 },
    { id: 4, nome: "Cortante", idLinhaEfeito: 35, idDanoPertencente: 2 },
    { id: 5, nome: "Perfurante", idLinhaEfeito: 36, idDanoPertencente: 2 },
    { id: 6, nome: "Natural", idLinhaEfeito: 37, idDanoPertencente: 1 },
    { id: 7, nome: "Elétrico", idLinhaEfeito: 38, idDanoPertencente: 6 },
    { id: 8, nome: "Fogo", idLinhaEfeito: 39, idDanoPertencente: 6 },
    { id: 9, nome: "Frio", idLinhaEfeito: 40, idDanoPertencente: 6 },
    { id: 10, nome: "Químico", idLinhaEfeito: 41, idDanoPertencente: 6 },
    { id: 11, nome: "Elemental", idLinhaEfeito: 42, idDanoPertencente: 1 },
    { id: 12, nome: "Conhecimento", idLinhaEfeito: 43, idDanoPertencente: 11 },
    { id: 13, nome: "Sangue", idLinhaEfeito: 44, idDanoPertencente: 11 },
    { id: 14, nome: "Energia", idLinhaEfeito: 45, idDanoPertencente: 11 },
    { id: 15, nome: "Morte", idLinhaEfeito: 46, idDanoPertencente: 11 },
    { id: 16, nome: "Medo", idLinhaEfeito: 47, idDanoPertencente: 11 },
    { id: 17, nome: "Mental", idLinhaEfeito: 48 },
    { id: 18, nome: "Debilitante", idLinhaEfeito: 49 },
];

export const registrosTipoEfeitoModelo: TipoEfeitoModelo[] = [
    { id: 1, nome: "Equipamento", nomeExibirTooltip: 'Efeito de Equipamento' },
    { id: 2, nome: "Químico", nomeExibirTooltip: 'Efeito Químico' },
    { id: 3, nome: "Paranormal", nomeExibirTooltip: 'Efeito Paranormal' },
    { id: 4, nome: "Especial", nomeExibirTooltip: 'Efeito Especial' },
    { id: 5, nome: 'Negativo', nomeExibirTooltip: 'Efeito Negativo' },
];

export const registrosTipoItemModelo: TipoItemModelo[] = [
    { id: 1, nome: "Arma" },
    { id: 2, nome: "Equipamento" },
    { id: 3, nome: "Consumível" },
    { id: 4, nome: "Componente Ritualístico" },
];

export const registrosTipoProficienciaModelo: TipoProficienciaModelo[] = [
    { id: 1, nome: 'Armas de Ataque Corpo-a-Corpo' },
    { id: 2, nome: 'Armas de Ataque à Distância' },
    { id: 3, nome: 'Proteções' },
    { id: 4, nome: 'Substâncias' },
    { id: 5, nome: 'Confecção' },
    { id: 6, nome: 'Ligação Paranormal' },
];

// tipo_estatistica_buffavel

// tipos_acao

// tipos_requisitos