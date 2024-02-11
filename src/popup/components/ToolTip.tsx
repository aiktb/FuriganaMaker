import {
  arrow,
  flip,
  FloatingArrow,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { Transition } from '@headlessui/react';
import React, { Fragment, useRef, useState } from 'react';

interface ToolTipProps {
  tip: string;
  children: React.ReactNode;
}

export default function ToolTip({ tip, children }: ToolTipProps) {
  const arrowRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    strategy: 'fixed',
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  const hover = useHover(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role]);
  return (
    <>
      <div
        ref={refs.setReference}
        onFocus={(event) => {
          if (event.target.matches(':focus-visible')) {
            setIsOpen(true);
          }
        }}
        onBlur={(event) => {
          if (!event.target.matches(':hover')) {
            setIsOpen(false);
          }
        }}
        {...getReferenceProps()}
        className="flex flex-1"
      >
        {children}
      </div>
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
          {...getFloatingProps()}
          className="text-slate-20 z-50 inline-flex rounded bg-slate-900 px-2 text-white dark:bg-slate-200  dark:text-slate-800"
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            tipRadius={3}
            height={6}
            className="fill-slate-800 dark:fill-slate-200"
          />
          {tip}
        </div>
      </Transition>
    </>
  );
}
