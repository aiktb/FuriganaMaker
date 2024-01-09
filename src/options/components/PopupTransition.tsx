import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface PopupTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

export default function PopupTransition({ show, children }: PopupTransitionProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-10">
        {/* Background overlay */}
        <div className="fixed inset-0 backdrop-blur backdrop-filter" />
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition>
  );
}
