import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, ReactNode, useCallback, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import useSWR from 'swr';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser, IWorkspace } from '@typings/db';
import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import CreateChannelModal from '@components/CreateChannelModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

function Workspace() {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>(
    'http://localhost:3095/api/users',
    fetcher,
  );
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then((response) => {
      mutate(false, false);
    });
  }, []);

  const toggleUserProfileMenu = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);
  const toggleWorkspaceMenu = useCallback(() => {
    setShowWorkspaceMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspaceModal = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);
  const onClickCreateChannelModal = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span onClick={toggleUserProfileMenu}>
              <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseMenu={toggleUserProfileMenu}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws: IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspaceModal}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceMenu}>C_slack</WorkspaceName>
          {showWorkspaceMenu && (
            <MenuScroll>
              <Menu style={{ top: 95, left: 80 }} show={showWorkspaceMenu} onCloseMenu={toggleWorkspaceMenu}>
                <WorkspaceModal>
                  <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2>
                  {/* <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button> */}
                  <button onClick={onClickCreateChannelModal}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
            </MenuScroll>
          )}
          {channelData?.map((c) => (
            <div>{c.name}</div>
          ))}
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal show={showCreateWorkspaceModal} onCloseModal={onCloseModal} />
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} />
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
}

export default Workspace;
