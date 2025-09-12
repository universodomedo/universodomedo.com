'use client';

import { useEffect, useState } from "react";
import { TipoImagemDto } from "types-nora-api";
import { uploadImagem } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { obtemTiposImagem } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

export default function PaginaUpload() {
    const [tipoImagemSelecionado, setTipoImagemSelecionado] = useState<TipoImagemDto | null>(null);
    const [tiposImagem, setTiposImagem] = useState<TipoImagemDto[]>([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchTiposImagem = async () => {
            const tipos = await obtemTiposImagem();

            if (tipos) setTiposImagem(tipos);
        };

        fetchTiposImagem();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        const tipo = tiposImagem.find(t => t.id === selectedId) || null;
        setTipoImagemSelecionado(tipo);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert('Selecione um arquivo primeiro');
            return;
        }

        if (!tipoImagemSelecionado) {
            alert('Selecione um tipo de imagem');
            return;
        }

        try {
            const response = await uploadImagem(file, tipoImagemSelecionado.nome);

            if (response) {
                alert(`Upload de [${tipoImagemSelecionado.nome}] realizado com sucesso!`);

                window.location.reload();
            } else {
                alert(`Erro no upload`);
            }
        } catch (error) {
            alert('Erro ao fazer upload da imagem.');
            console.error(error);
        }
    };

    if (!tiposImagem) return <div>Carregando tipos</div>;

    return (
        <div className="container">
            <h1>Upload de Imagem</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Selecione uma imagem:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Tipo da imagem:</label>
                    <select
                        value={tipoImagemSelecionado?.id ?? ""}
                        onChange={handleTipoChange}
                    >
                        <option value="">Selecione um tipo...</option>
                        {tiposImagem.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">
                    Enviar Imagem
                </button>
            </form>
        </div>
    );
};