import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;

  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
    }
  `};
`;

export const NavLinkWithHover = styled(NavLink)`
  &:hover {
    background: #350d36;
  }
  ,
  & img {
    margin-right: 10px;
  }
`;
