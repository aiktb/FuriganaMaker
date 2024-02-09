import React from 'react';

import ToolTip from './ToolTip';

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  tip?: string;
}

export default function MenuItem({ children, icon, tip }: MenuItemProps) {
  return (
    <li className="flex items-center gap-x-1.5">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      {tip ? <ToolTip tip={tip}>{children}</ToolTip> : children}
    </li>
  );
}
