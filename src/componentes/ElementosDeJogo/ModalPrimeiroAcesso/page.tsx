'use client';

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";

import Modal from "Componentes/Elementos/Modal/page.tsx";

export default function ModalPrimeiroAcesso() {
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [apelido, setApelido] = useState("");
    const [checkTopicosSensiveis, setCheckTopicosSensiveis] = useState(false);
    const [termo1, setTermo1] = useState(false);
    const [termo2, setTermo2] = useState(false);
    const [erroApelido, setErroApelido] = useState("");
    const [podeProsseguir, setPodeProsseguir] = useState(false);

    const validarApelido = () => {
        if (apelido.trim() === "") return false;

        if (apelido.length < 4 || apelido.length > 25) {
            setErroApelido("O apelido deve ter entre 4 e 25 caracteres.");
            return false;
        }

        const regex = /^[a-zA-Z0-9 .,\/\-+]*$/;
        if (!regex.test(apelido)) {
            setErroApelido("Caracteres especiais não são permitidos.");
            return false;
        }

        setErroApelido("");
        return true;
    };

    const termoAceito = () => {
        return termo1 && termo2;
    }

    useEffect(() => {
        const apelidoValido = validarApelido();
        const termosAceitos = termoAceito();
        setPodeProsseguir(apelidoValido && termosAceitos);
    }, [apelido, termo1, termo2]);

    return (
        <Modal open={true} onOpenChange={() => { }}>
            <Modal.Content title={mostrarTermos ? "Termos de Aceite" : "Bem Vindo ao Universo do Medo!"} className={styles.modal_primeiro_acesso} temBotaoFechar={false}>
                {!mostrarTermos ? (
                    <div className={styles.conteudo_modal_primeiro_acesso_confirmacao}>
                        <div className={styles.confirmacao_explicacao}>
                            <h3>Insira um Nome Principal para a sua conta</h3>
                            <p>
                                Este será o <span className="negrito">nome que identificará o jogador</span> por trás de tantos personagens. Não é o nome de seu personagem, e não poderá ser alterado futuramente, então escolha com atenção
                            </p>

                            <div className={styles.recipiente_nome}>
                                <span>O nome pode ser revogado caso seja considerado inapropriado</span>

                                <input className={`${styles.recipiente_nome_input} ${!podeProsseguir ? styles.invalido : ''}`} type="text" value={apelido} onChange={(e) => setApelido(e.target.value)} />
                                {erroApelido && <span className={styles.mensagem_erro}>{erroApelido}</span>}
                            </div>

                        </div>
                        <div className={styles.confirmacao_prosseguir}>
                            <div className={styles.textos_disclaimer_termo}>
                                <span className={styles.disclaimer_termo}>Este Termo de Aceite deve ser lido e aceito para prosseguir</span>
                                <span className={styles.disclaimer_termo}>Informações Úteis estão presentes, que podem esclarecer dúvidas</span>
                                <span className={styles.disclaimer_termo}>Qualquer dúvida, procurar <Link target="_blank" href={'https://discord.universodomedo.com'}>suporte da Direção</Link></span>
                                <span>Seguir para os <span className={`${styles.link_termo_aceite} ${!termoAceito() ? styles.nao_aceito : ''}`} onClick={() => setMostrarTermos(true)}>Termos de Aceite</span></span>
                            </div>

                            <button disabled={!podeProsseguir}>Prosseguir</button>
                        </div>
                    </div>
                ) : (
                    <ConteudoTermoAceite
                        checkTopicosSensiveis={checkTopicosSensiveis}
                        termo1={termo1}
                        termo2={termo2}
                        setCheckTopicosSensiveis={setCheckTopicosSensiveis}
                        setTermo1={setTermo1}
                        setTermo2={setTermo2}
                        onVoltar={() => setMostrarTermos(false)}
                    />
                )}
            </Modal.Content>
        </Modal>
    );
};

function ConteudoTermoAceite({ checkTopicosSensiveis, termo1, termo2, setCheckTopicosSensiveis, setTermo1, setTermo2, onVoltar }: any) {
    return (
        <div className={styles.conteudo_modal_primeiro_acesso_termos}>
            <div className={styles.conteudo_modal_primeiro_acesso_termos_section}>
                <h3>Conteúdo Sensível e Idade Mínima</h3>

                <p>
                    O Universo do Medo é uma experiência narrativa que busca representar a realidade de forma dramática e imersiva. Por esse motivo, as aventuras podem conter temas e elementos restritos para <span className="negrito">maiores de 16 anos</span>
                </p>

                <p>
                    Cada aventura e cada temática podem abordar diferentes níveis de conteúdo sensível, incluindo, mas não se limitando à:
                </p>

                <div className={styles.disclaimer_centralizado}>
                    <div className={styles.recipiente_checkbox}>
                        <span>Visualizar Lista de Tópicos Sensíveis</span>
                        <input type="checkbox" checked={checkTopicosSensiveis} onChange={(e) => setCheckTopicosSensiveis(e.target.checked)} />
                    </div>

                    <span className={styles.titulo_aviso_topicos_sensiveis}>Alerta de Conteúdo Sensível!</span>
                    <span className={styles.aviso_topicos_sensiveis}>Se a presença de algum desses temas for um fator determinante para sua experiência, o Universo do Medo pode não ser um ambiente confortável para você. Caso tenha dúvidas, entre em <Link target="_blank" href={'https://discord.universodomedo.com'}>contato com a Direção</Link> antes de prosseguir</span>

                    {checkTopicosSensiveis && (
                        <>
                            <div className={styles.lista_topicos_sensiveis}>
                                <span>— Descrições detalhadas de ferimentos, incluindo mutilações e outras lesões graves;</span>
                                <span>— Temas ligados a traumas, como água, insetos, assombrações, espaços confinados e sangue;</span>
                                <span>— Efeitos sonoros fragmentados, sussurrantes ou alarmantes;</span>
                                <span>— Representação de transtornos psicológicos e emocionais, incluindo depressão, sociopatia, psicopatia e ansiedade;</span>
                                <span>— Menções a suicídio, violência sexual, conflitos sociais e tortura física/psicológica;</span>
                                <span>— Uso de substâncias e outros vícios;</span>
                                <span>— Discussões filosóficas e existenciais;</span>
                            </div>

                            <div className={styles.recipiente_checkbox}>
                                <span>Confirmo que tenho mais de 16 anos de idade, e estou ciente do conteúdo que pode ser utilizado dentro do Universo do Medo</span>
                                <input type="checkbox" checked={termo1} onChange={(e) => setTermo1(e.target.checked)} />
                            </div>
                        </>
                    )}
                </div>

                <p>
                    Em cada aventura, os temas abordados serão previamente sinalizados e esclarecidos novamente na Etapa de Confirmação de Aventura, garantindo que os jogadores tenham plena consciência do conteúdo antes de participar
                </p>

                <p>
                    Nosso compromisso é contar histórias que se ancorem firmemente na realidade. Os temas abordados no Universo do Medo estão presentes em diversas mídias e na vida real. Esta plataforma não promove, incentiva ou romantiza qualquer um desses comportamentos em nenhum contexto
                </p>
            </div>

            <div className={styles.conteudo_modal_primeiro_acesso_termos_section}>
                <h3>Espaço para Todos e Conteúdo Inapropriado</h3>

                <p>
                    O Universo do Medo não é apenas um jogo — é uma experiência social. Para que todos possam participar plenamente e utilizar nossas ferramentas de forma saudável, é essencial que o ambiente seja acolhedor e respeitoso
                </p>

                <p>
                    Para preservar o bem-estar da comunidade, nomes impróprios ou de duplo sentido, bem como imagens que não representem adequadamente seu personagem ou sejam inapropriadas, não serão permitidos. Nossa equipe de Moderação atua ativamente para garantir o cumprimento dessas diretrizes, podendo revisar e revogar conteúdos que violem esse princípio
                </p>

                <p>
                    O espaço e as ferramentas disponibilizadas são exclusivamente para jogar e discutir o Universo do Medo. Esta é uma plataforma gratuita e utilizá-la para outras finalidades demonstra desrespeito com nossa Direção e com a comunidade
                </p>

                <p>
                    O que acontece fora do Universo do Medo está além do nosso controle, mas pedimos que evitem discussões polêmicas e o uso da plataforma para outros jogos ou sistemas
                </p>

                <p>
                    Não será tolerado qualquer forma de preconceito, discurso de ódio ou atividades alheias ao Universo do Medo. Independentemente de diferenças pessoais, todos aqui buscam o mesmo nível de qualidade e comprometimento com o RPG, e garantiremos que esses padrões sejam mantidos
                </p>
            </div>

            <div className={styles.conteudo_modal_primeiro_acesso_termos_section}>
                <h3>Dedicação à uma Aventura</h3>

                <p>
                    As aventuras do Universo do Medo são construídas a partir da interação entre personagens. Cada jogador tem um papel fundamental no desenrolar da história, e a ausência de qualquer participante pode afetar o rumo da narrativa de maneiras imprevisíveis
                </p>

                <p>
                    Por isso, ao se comprometer com uma Aventura, certifique-se de que sua disponibilidade não afetará sua rotina. Escolha dias de jogo nos quais seja possível manter o compromisso sem imprevistos frequentes, garantindo sua presença pelo tempo integral da aventura em questão. Além disso, recomendamos que esteja disponível alguns minutos antes e depois do horário combinado, para evitar atrasos e manter a imersão da experiência
                </p>

                <p>
                    Para preservar a qualidade da comunidade, faltas e atrasos recorrentes poderão resultar em penalidades, definidas pela Diretoria do Universo do Medo. Dependendo da gravidade e da frequência do problema, as medidas podem variar desde abandono forçado da aventura até a perda definitiva do personagem
                </p>

                <p>
                    Cada participante deve estar ciente do impacto que sua ausência pode causar aos demais. Nossas diretrizes visam manter um espaço organizado e respeitoso, onde o compromisso de cada jogador seja valorizado. Se surgir qualquer imprevisto que possa comprometer sua participação, comunique imediatamente a Diretoria e os demais jogadores da sua Aventura. Isso não é uma obrigação ou punição, mas uma forma de garantir o melhor ambiente possível para todos
                </p>
            </div>

            <div className={styles.disclaimer_centralizado}>
                <div className={styles.recipiente_checkbox}>
                    <span>Eu assumo este compromisso e concordo com possíveis penalidades atribuídas por faltas, atrasos e qualquer comportamento contra as diretrizes aqui citadas</span>
                    <input type="checkbox" checked={termo2} onChange={(e) => setTermo2(e.target.checked)} />
                </div>
            </div>

            <button onClick={onVoltar}>Voltar</button>
        </div>
    );
};