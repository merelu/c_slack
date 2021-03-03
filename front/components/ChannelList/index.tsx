import { CollapseButton, NavLinkWithHover } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useSWR from 'swr';

function ChannelList() {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const [collapse, setCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});
  const toggleCollapse = useCallback(() => {
    setCollapse((prev) => !prev);
  }, []);
  return (
    <>
      <h2>
        <CollapseButton collapse={collapse} onClick={toggleCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!collapse &&
          channelData?.map((channel) => {
            const count = countList[`c-${channel.id}`];
            return (
              <NavLinkWithHover
                key={channel.name}
                activeStyle={{
                  background: '#1164A3',
                }}
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span className={count !== undefined && count >= 0 ? 'bold' : undefined}>#{channel.name}</span>
                {count !== undefined && count > 0 && <span className="count">{count}</span>}
              </NavLinkWithHover>
            );
          })}
      </div>
    </>
  );
}

export default ChannelList;
