import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './styles';

function Channel() {
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log(chat);
  }, []);
  return (
    <Container>
      <Header>Channels</Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default Channel;
