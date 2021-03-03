import { ProfileImg } from '@layouts/Workspace/styles';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { CollapseButton, NavLinkWithHover } from './styles';

function DMList() {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [collapse, setCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});
  const [isOnline, setIsOnline] = useState(true);
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
        <span>Direct Message</span>
      </h2>
      <div>
        {!collapse &&
          memberData?.map((member) => {
            const count = countList[member.id] || 0;
            return (
              <NavLinkWithHover
                key={member.id}
                activeStyle={{
                  background: '#1164A3',
                }}
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
                <img src={gravatar.url(member.nickname, { s: '20px', d: 'retro' })} alt={member.nickname} />

                <span className={count > 0 ? 'bold' : undefined}>{member.nickname}</span>
                {member.id === userData?.id && <span>(나)</span>}
                {count > 0 && <span className="count">{count}</span>}
              </NavLinkWithHover>
            );
          })}
      </div>
    </>
  );
}

export default DMList;
