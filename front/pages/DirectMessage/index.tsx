import fetcher from '@utils/fetcher';
import React from 'react';
import useSWR from 'swr';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  console.log('userdata', userData);

  if (!myData || !userData) return null;
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
    </Container>
  );
}

export default DirectMessage;
