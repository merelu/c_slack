import { NavLinkWithHover } from '@components/DMList/styles';
import { IUser } from '@typings/db';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

interface IEachDMProps {
  member: IUser;
  isOnline: boolean;
}
function EachDM({ member, isOnline }: IEachDMProps) {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [location.pathname, member.id, mutate, workspace]);

  return (
    <NavLinkWithHover
      key={member.id}
      activeStyle={{ background: '#1164A3' }}
      to={`/workspace/${workspace}/dm/${member.id}`}
    >
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <img src={gravatar.url(member.email, { s: '20px', d: 'retro' })} alt={member.nickname} />
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span>(나)</span>}
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLinkWithHover>
  );
}

export default EachDM;
