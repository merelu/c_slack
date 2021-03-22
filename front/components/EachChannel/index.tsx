import { NavLinkWithHover } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useSWR from 'swr';
interface IEachChannelProps {
  channel: IChannel;
}
function EachChannel({ channel }: IEachChannelProps) {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [channel.name, location.pathname, mutate, workspace]);

  return (
    <NavLinkWithHover
      key={channel.name}
      activeStyle={{
        background: '#1164A3',
      }}
      to={`/workspace/${workspace}/channel/${channel.name}`}
    >
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLinkWithHover>
  );
}

export default EachChannel;
