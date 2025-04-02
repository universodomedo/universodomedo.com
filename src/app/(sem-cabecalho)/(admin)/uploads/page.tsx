'use client';

import { useState } from "react";
import { uploadImagem } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

export default function PaginaUpload() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert('Por favor, selecione um arquivo primeiro.');
            return;
        }

        try {
            // Agora passamos o arquivo para a função uploadImagem
            const response = await uploadImagem(file);

            if (response.sucesso) {
                alert('Upload realizado com sucesso!\nNome do arquivo');
            } else {
                alert(`Erro no upload: ${response.erro}`);
            }
        } catch (error) {
            alert('Erro ao fazer upload da imagem.');
            console.error(error);
        }
    };

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

                <button type="submit">
                    Enviar Imagem
                </button>
            </form>
        </div>
    );
};