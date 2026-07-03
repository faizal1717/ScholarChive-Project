import { GraduationCapIcon } from "lucide-react";

export default function TotalSemesters() {
  return (
    <div className="w-full p-2 text-gray-700">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="p-2 w-1/2 bg-purple-200 rounded-lg flex justify-center">
          <GraduationCapIcon
            width={36}
            height={36}
            className="text-purple-700"
          />
        </div>
        <div className="font-semibold py-2 md:text-base text-sm text-center text-gray-500">
          Total Semesters
        </div>
      </div>
      <div className="font-semibold text-gray-700 md:text-xl text-lg lg:text-3xl">
        <span>2</span>
      </div>
    </div>
  );
}
