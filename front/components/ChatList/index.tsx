import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { useCallback, useRef, forwardRef, RefObject } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
interface IChatList {
  chatSections: { [key: string]: IDM[] };
  setSize: (size: number | ((size: number) => number)) => Promise<IDM[][] | undefined>;
  scrollbarRef: RefObject<Scrollbars>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}
function ChatList({ chatSections, setSize, scrollbarRef, isEmpty, isReachingEnd }: IChatList) {
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log('가장 위');
      setSize((prevSize) => prevSize + 1).then(() => {
        //스크롤 위치 유지
        scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
      });
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
}
export default ChatList;
