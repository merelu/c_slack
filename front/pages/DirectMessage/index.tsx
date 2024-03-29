import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import { Container, DragOver, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IDM, IUser } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const [dragOver, setDragOver] = useState(false);
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR<IUser>(myData ? `/api/workspaces/${workspace}/users/${id}` : null, fetcher);
  const date = localStorage.getItem(`${workspace}-${id}`) || 0;
  const { mutate: countMutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${id}/unreads?after=${date}` : null,
    fetcher,
  );
  const { data: chatData, mutate: mutateChat, revalidate: revalidateChat, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
    {
      onSuccess(data) {
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
          countMutate(0);
          localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
        }
      },
    },
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const scrollbarRef = useRef<Scrollbars>(null);

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && userData) {
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
          localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
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
            revalidateChat();
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data);
          });
      }
    },
    [chat, chatData, id, mutateChat, myData, revalidateChat, setChat, userData, workspace],
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
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
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
  const onDrop = useCallback(
    (e) => {
      e.preventDefault(e);
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i]);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
        revalidateChat();
      });
    },
    [id, revalidateChat, workspace],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);
  //socket 연결
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [onMessage, socket]);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  }, [id, workspace]);

  if (!myData || !userData) {
    return null;
  } else {
    console.log(userData);
  }

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
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
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
}

export default DirectMessage;
