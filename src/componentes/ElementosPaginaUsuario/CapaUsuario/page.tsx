import styles from './styles.module.css';
import Image from 'next/image';

import { useContexto__PaginaPerfilUsuario } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';

export default function CapaUsuario() {
    const {urlImagem} = useContexto__PaginaPerfilUsuario()

    return (
            <div className={styles.capa_usuario}>
                <a className={styles.texto_editacao}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.9201 3.38933C14.4096 2.89993 15.0733 2.625 15.7654 2.625C16.1081 2.625 16.4475 2.6925 16.7641 2.82364C17.0807 2.95479 17.3683 3.14701 17.6107 3.38933C17.853 3.63165 18.0452 3.91934 18.1764 4.23595C18.3076 4.55256 18.375 4.8919 18.375 5.23459C18.375 5.57728 18.3076 5.91663 18.1764 6.23324C18.0452 6.54985 17.853 6.83753 17.6107 7.07985L16.6452 8.04533C16.3035 8.38704 15.7495 8.38704 15.4078 8.04534L12.9547 5.59225C12.613 5.25054 12.613 4.69652 12.9547 4.35481L13.9201 3.38933ZM11.7172 6.82969C11.3755 6.48798 10.8215 6.48798 10.4798 6.82969L4.3845 12.925C3.8238 13.4857 3.42603 14.1882 3.23372 14.9575L2.65114 17.2878C2.5766 17.5859 2.66397 17.9014 2.8813 18.1187C3.09863 18.3361 3.41406 18.4234 3.71224 18.3488L6.04252 17.7663C6.81178 17.574 7.51432 17.1762 8.07501 16.6156L14.1703 10.5202C14.5121 10.1785 14.5121 9.62447 14.1703 9.28279L11.7172 6.82969Z" fill="currentColor" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 17.5C10.5 17.0167 10.8917 16.625 11.375 16.625H17.5C17.9833 16.625 18.375 17.0167 18.375 17.5C18.375 17.9833 17.9833 18.375 17.5 18.375H11.375C10.8917 18.375 10.5 17.9833 10.5 17.5Z" fill="currentColor" />
                    </svg>
                    <p>Editar</p>
                </a>
                <div className={styles.filtro_capa} />
                <div className={styles.imagem_capa}>
                    <Image alt='' src={urlImagem} fill unoptimized />
                </div>
            </div>
    )
}