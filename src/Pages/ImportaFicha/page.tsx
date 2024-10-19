// #region Imports
import style from './style.module.css';
import { useState, useEffect } from 'react';
import { Personagem } from 'Types/classes2.tsx';
// #endregion

const Modal = ({
    onClose,
    onConfirm
  }: {
    onClose: () => void;
    onConfirm: (importString: string) => void;
  }) => {
    const [importString, setImportString] = useState("");
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Importar Personagem</h2>
          <textarea
            placeholder="Insira a string de importação"
            value={importString}
            onChange={(e) => setImportString(e.target.value)}
            rows={4}
            cols={50}
          />
          <div className="modal-actions">
            <button onClick={onClose}>Cancelar</button>
            <button onClick={() => onConfirm(importString)}>Confirmar</button>
          </div>
        </div>
      </div>
    );
  };

const ImportaFicha: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(true);

    const handleConfirm = (importString: string) => {
      try {
        const importedPersonagem = Personagem.importar(importString);
        console.log("Personagem importado:", importedPersonagem);
        setModalOpen(false); // Fecha o modal após a confirmação
      } catch (error) {
        console.error("Erro ao importar personagem:", error);
      }
    };
  
    return (
      <div className="App">
        <h1>Aplicação Personagem</h1>
  
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)} onConfirm={handleConfirm} />
        )}
  
        <p>Confira o console para ver o personagem importado.</p>
      </div>
    );
};

export default ImportaFicha;