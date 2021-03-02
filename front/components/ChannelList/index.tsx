import { CollapseButton } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import React, { useCallback, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
interface IChannelList {
  channelData?: IChannel[];
  userData?: IUser;
}
function ChannelList({ userData, channelData }: IChannelList) {
  const { workspace } = useParams<{ workspace: string }>();
  const [collapse, setCollpase] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});
  const toggleCollapse = useCallback((prev) => !prev, []);
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
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span className={count !== undefined && count >= 0 ? 'bold' : undefined}>#{channel.name}</span>
                {count !== undefined && count > 0 && <span className="count">{count}</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
}

export default ChannelList;
