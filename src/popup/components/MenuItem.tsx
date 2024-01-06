import React from 'react';

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  tip?: string;
}

export default function MenuItem({ children, icon, tip }: MenuItemProps) {
  return (
    <li className="group relative flex items-center gap-x-2">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      <div className="peer relative flex grow rounded transition-all hover:bg-gray-200  dark:hover:bg-slate-700">
        {children}
      </div>
      {tip && (
        <div className="invisible absolute -top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-900 px-2 text-slate-200 opacity-0 transition-opacity delay-200 duration-500 group-first:top-[150%] peer-focus-within:visible peer-focus-within:opacity-100 peer-hover:visible peer-hover:opacity-100 dark:bg-slate-200 dark:text-slate-800">
          {tip}
        </div>
      )}
    </li>
  );
}
