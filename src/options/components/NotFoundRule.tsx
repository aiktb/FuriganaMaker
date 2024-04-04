import { Icon } from "@iconify/react";

export default function NotFoundRule() {
  return (
    <div className="flex flex-col items-center px-6 pb-24 pt-16 text-center">
      <Icon className="size-20 text-sky-500" icon="fluent:location-not-found-24-regular" />
      <h1 className="space-x-[2px] pt-3 text-xl font-bold leading-5 text-sky-500">
        NOT FOUND RULE
      </h1>
      <div className="mx-auto mb-[18px] mt-6 h-[1px] w-16 bg-sky-500" />
      <p className="mx-auto my-0 max-w-[256px] text-base font-[500]">
        Please add a new rule, or import an existing configuration file (in JSON format), otherwise
        this extension will not do anything.
      </p>
    </div>
  );
}
