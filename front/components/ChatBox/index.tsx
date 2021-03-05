import React, { useCallback } from 'react';
import { Mention } from 'react-mentions';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './styles';

interface IChatBoxProps {
  chat?: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
}
function ChatBox({ chat, onSubmitForm, onChangeChat }: IChatBoxProps) {
  const onKeyDownChat = useCallback((e) => {
    console.log(e);
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, []);
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea id="editor-chat" value={chat} onKeyDown={onKeyDownChat}></MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}

export default ChatBox;
