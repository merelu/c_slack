import React, { ReactNode } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
interface IChatListProps {
  children: ReactNode;
}
function ChatList({ children }: IChatListProps) {
  return (
    <ChatZone>
      <Section>
        <StickyHeader>stickyheader</StickyHeader>
        {children}
      </Section>
    </ChatZone>
  );
}
export default ChatList;
