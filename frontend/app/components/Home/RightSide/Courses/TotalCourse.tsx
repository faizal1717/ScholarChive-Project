import { BookOpenIcon } from "lucide-react";

export default function TotalCourse() {
  return (
    <div className="w-full p-2 text-gray-700">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="p-2 w-1/2 bg-red-200 rounded-lg flex justify-center">
          <BookOpenIcon width={36} height={36} className="text-red-700" />
        </div>
        <div className="font-semibold py-2 text-center md:text-base text-sm text-gray-500">
          Total Courses
        </div>
      </div>
      <div className="font-semibold text-gray-700 md:text-xl text-lg lg:text-3xl">
        <span>11</span>
      </div>
    </div>
  );
}
