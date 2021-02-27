import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, ReactNode, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

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
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>C_slack</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
}

export default Workspace;
