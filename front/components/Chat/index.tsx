import React from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import { IDM, IChat, IUser } from '@typings/db';

interface IChatProps {
  data: IDM;
}
function Chat({ data }: IChatProps) {
  const user = data.Sender;
  console.log('chat');
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{data.createdAt}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
}

export default Chat;
