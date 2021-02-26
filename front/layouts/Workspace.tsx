import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, ReactNode, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
type TWorkspaceProps = {
  children: ReactNode;
};
function Workspace({ children }: TWorkspaceProps) {
  const { data: userData, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then((response) => {
      mutate(false, false);
    });
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
}

export default Workspace;
