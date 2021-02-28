import React, { CSSProperties, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';
interface IMenuProps {
  children: ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}
function Menu({ children, style, show, onCloseModal, closeButton = true }: IMenuProps) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
}

export default Menu;
