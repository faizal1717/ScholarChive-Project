"use client";

import { useState } from "react";
import SliderSemesters from "./SliderSemesters";
import AddButton from "./AddSemesters/AddButton";

export default function SemesterSection() {
  const [reload, setReload] = useState(false);

  return (
    <div className="flex gap-4 items-stretch rounded-lg">
      <SliderSemesters reload={reload} />

      <div className="w-[180px]">
        <AddButton
          onSuccess={() =>
            setReload((prev) => !prev)
          }
        />
      </div>
    </div>
  );
}