import React from 'react';

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

export default function MenuItem({ children, icon }: MenuItemProps) {
  return (
    <li className="flex items-center gap-x-1.5">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      {children}
    </li>
  );
}
