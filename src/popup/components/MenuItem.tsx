import { flip, offset, useFloating } from '@floating-ui/react';
import { Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  tip?: string;
}

export default function MenuItem({ children, icon, tip }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [offset(6), flip()],
  });
  return (
    <li className="flex items-center gap-x-2">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      <div
        ref={refs.setReference}
        onPointerEnter={() => setIsOpen(true)}
        onPointerLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="flex grow rounded transition-all hover:bg-gray-200  dark:hover:bg-slate-700"
      >
        {children}
      </div>
      {tip && (
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="text-slate-20 inline-flex rounded bg-slate-900 px-2 text-white dark:bg-slate-200 dark:text-slate-800"
          >
            {tip}
          </div>
        </Transition>
      )}
    </li>
  );
}
