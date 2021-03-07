import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import React, { useCallback, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
interface IChatList {
  chatData?: IDM[];
}
function ChatList({ chatData }: IChatList) {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
}
export default ChatList;
