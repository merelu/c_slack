import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useRef } from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher);
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const scrollbarRef = useRef<Scrollbars>(null);

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
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
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data);
          });
      }
    },
    [chat, chatData, id, mutateChat, myData, revalidate, setChat, userData, workspace],
  );

  const onMessage = useCallback(
    (data: IDM) => {
      //id: 상대방 아이드
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              scrollbarRef.current.scrollToBottom();
            } else {
              toast.success('새 메시지가 도착했습니다.', {
                onClick() {
                  scrollbarRef.current?.scrollToBottom();
                },
                closeOnClick: true,
              });
            }
          }
        });
      }
    },
    [id, mutateChat, myData.id],
  );
  //socket 연결
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [onMessage, socket]);
  //로딩시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);
  if (!myData || !userData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollbarRef={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default DirectMessage;
