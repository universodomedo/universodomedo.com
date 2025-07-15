'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import Link from 'next/link';
import { LinkDto, SessaoDto } from 'types-nora-api';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

export function AreaLinkTrailer({ linkTrailer }: { linkTrailer: LinkDto }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <div id={styles.recipiente_area_link_trailer}>
                {linkTrailer ? (
                    <Link href={linkTrailer.urlCompleta} target='_blank'><p>Tem Trailer</p></Link>
                ) : (
                    <button onClick={openModal}>Configurar Trailer</button>
                )}
            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content title={'Configurando Trailer da Aventura'}>
                    <ConteudoModalTrailer />
                </Modal.Content>
            </Modal>
        </>
    );
};

function ConteudoModalTrailer() {
    return (
        <></>
    );
};

export function AreaEpisodios({ episodios }: { episodios: SessaoDto[] }) {
    return (
        <div id={styles.recipiente_area_episodios}>
            <h1>{episodios.length} Episódios</h1>
            <div id={styles.recipiente_area_lista_episodios}>
                {episodios.sort((a, b) => a.id - b.id).map(episodio => (
                    <Link key={episodio.id} href={`/admin/sessao/${episodio.id}`}>{episodio.episodioPorExtenso}</Link>
                ))}
            </div>
        </div>
    );
};