import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react';
import useSWR from 'swr';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IDM } from '@typings/db';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: chatData, revalidate } = useSWR<IDM[]>(
    userData ? `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1` : null,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/dms/${id}/chats`,
          {
            content: chat,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidate();
          setChat('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data);
        });
    },
    [chat, id, revalidate, setChat, workspace],
  );

  if (!myData || !userData) return null;
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default DirectMessage;
