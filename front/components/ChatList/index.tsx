import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import React from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
interface IChatList {
  chatData?: IDM[];
}
function ChatList({ chatData }: IChatList) {
  if (chatData) {
    console.log(chatData);
  }
  return (
    <ChatZone>
      {chatData?.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
}
export default ChatList;
