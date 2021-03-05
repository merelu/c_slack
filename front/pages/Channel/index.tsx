import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { Container, Header } from './styles';

function Channel() {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: chatData, revalidate } = useSWR<IChat[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=10&page=1` : null,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `/api/workspaces/${workspace}/channels/${channel}/chats`,
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
      }
    },
    [chat],
  );

  return (
    <Container>
      <Header>Channels</Header>
      <ChatList>
        {chatData?.map((data) => {
          return <div key={data.id}>{data.content}</div>;
        })}
      </ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default Channel;
