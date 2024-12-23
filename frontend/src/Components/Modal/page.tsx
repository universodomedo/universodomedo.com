// #region Imports
import style from './style.module.css';
import React, { ReactNode } from 'react';

import ReactDOM from 'react-dom';
// #endregion

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: ReactNode; }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className={style.modal_overlay} />
      {/* <div className={style.modal_overlay} onClick={onClose} /> */}
      <div className={style.modal_content}>
        <button className={style.modal_close} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </>,
    document.getElementById('modal-root')!
  );
};

export default Modal;