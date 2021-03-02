import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface IInviteChannelModlaProps {
  show: boolean;
  onCloseModal: () => void;
}

function InviteChannelModal({ show, onCloseModal }: IInviteChannelModlaProps) {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { revalidate: revalidateMembers } = useSWR<IUser[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;
      axios
        .post(
          `/api/workspaces/${workspace}/channels/${channel}/member`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateMembers();
          onCloseModal();
          setNewMember('');
          toast.success('채널 초대 성공!');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data);
        });
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 맴버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}

export default InviteChannelModal;
