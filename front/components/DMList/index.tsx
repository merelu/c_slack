import React, { useCallback, useState } from 'react';
import { CollapseButton } from './styles';

interface IDMListProps {}
function DMList() {
  const [collapse, setCollapse] = useState(false);
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
        <span>Direct Message</span>
      </h2>
      <div></div>
    </>
  );
}

export default DMList;
