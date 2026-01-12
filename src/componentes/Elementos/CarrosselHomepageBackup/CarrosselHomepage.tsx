import styles from './styles.module.css';

export default function CarrosselHomepage() {
    return (
        <div>
            <section className={styles.section1}>

                <div className={styles.carrossel_homepage}>
                        <div className={styles.recipiente_carrossel_homepage}>
                            <input type="text" className={styles.radio_btn1} id={styles.radio1}/>
                            <input type="text" className={styles.radio_btn3} id={styles.radio3}/>
                            <input type="text" className={styles.radio_btn2} id={styles.radio2}/>

                            <div className={`${styles.slide_images} ${styles.first}`}>
                                <img src="/imagensFigma/capa-nahid.png" alt="#" />
                            </div>
                
                            <div className={`${styles.slide_images}`}>
                                <img src="/imagensFigma/T3-E26.png" alt="#" />
                            </div>
                
                            <div className={`${styles.slide_images}`}>
                                <img src="/imagensFigma/T3-E29.png" alt="#" />
                            </div>
                            <div className={styles.navigation_auto}>
                                <div className={styles.auto_btn1}></div>
                                <div className={styles.auto_btn2}></div>
                                <div className={styles.auto_btn3}></div>
                            </div>
                    </div>

                    <div className={styles.bg_manual}>
                
                        <div className={styles.manual_navigation}>
                            <label htmlFor="radio1" className={styles.manual_btn}></label>
                            <label htmlFor="radio2" className={styles.manual_btn}></label>
                            <label htmlFor="radio3" className={styles.manual_btn}></label>
                        </div>
                    </div>

                    <div className={styles.recipiente_bordas}>
                        <div className={styles.border1}>
                            <div className={styles.borda_slide1}></div>
                        </div>
                        <div className={styles.slide_principal}>
                        
                            <div className={styles.borda_slide2}></div>
                        
                            <img className={styles.side_bl} src="/imagensFigma/crystal-botao-esquerda.svg" alt="#"></img>
                            <img className={styles.side_br} src="/imagensFigma/crystal-azul-direita.svg" alt="#"></img>
                        
                            <a href="#"><img className={styles.over_b_l} src="/imagensFigma/slide_b_over_l.svg" alt="#"></img></a>
                            <a href="#"><img className={styles.over_b_r} src="/imagensFigma/slide_b_over_r.svg" alt="#"></img></a>
                        
                        
                            <img className={styles.adesivos} src="/imagensFigma/adesivos.svg" alt="#"></img>
                        
                        
                            <img className={styles.moldura_carrossel} src="/imagensFigma/moldura_carrossel.svg" alt="#"></img>
                        </div>
                        <div className={styles.border3}>
                            <div className={styles.borda_slide3}>
                                <a className={styles.side_btn2} href="#"></a>
                            </div>
                        </div>
                    </div>
                </div>

            </section>


        </div>
    )
}