import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Modal from '../Modal';

interface ICreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

function CreateChannelModal({ show, onCloseModal }: ICreateChannelModalProps) {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { data: userData } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data: channelData, revalidate: revalidateChannel } = useSWR(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannel();
          onCloseModal();
          setNewChannel('');
          toast.success('채널 생성 성공!');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data);
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}

export default CreateChannelModal;
