import React, { ReactNode, useCallback } from 'react';
import { CreateModal, CloseModalButton } from './styles';

interface IModalProps {
  children: ReactNode;
  show: boolean;
  onCloseModal: () => void;
}
function Modal({ children, show, onCloseModal }: IModalProps) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
}

export default Modal;
