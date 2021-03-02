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
  const { workspace } = useParams<{ workspace: string }>();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { revalidate: revalidateChannels } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) return;
      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannel }, { withCredentials: true })
        .then(() => {
          revalidateChannels();
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
