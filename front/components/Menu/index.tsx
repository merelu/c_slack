import React, { CSSProperties, ReactNode, useCallback } from 'react';
import { CloseMenuButton, CreateMenu } from './styles';
interface IMenuProps {
  children: ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseMenu: () => void;
  closeButton?: boolean;
}
function Menu({ children, style, show, onCloseMenu, closeButton = true }: IMenuProps) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateMenu onClick={onCloseMenu}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseMenuButton onClick={onCloseMenu}>&times;</CloseMenuButton>}
        {children}
      </div>
    </CreateMenu>
  );
}

export default Menu;
