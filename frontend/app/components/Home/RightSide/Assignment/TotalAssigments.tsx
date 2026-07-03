import { ClipboardListIcon } from "lucide-react";

export default function TotalAssigments() {
  return (
    <div className="w-full p-2 text-gray-700">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="p-2 w-1/2 bg-orange-200 rounded-lg flex justify-center">
          <ClipboardListIcon
            width={36}
            height={36}
            className="text-orange-700"
          />
        </div>
        <div className="font-semibold py-2 text-center md:text-base text-sm text-gray-500">
          Total Assignments
        </div>
      </div>
      <div className="font-semibold text-gray-700 md:text-xl text-lg lg:text-3xl">
        <span>8</span>
      </div>
    </div>
  );
}
