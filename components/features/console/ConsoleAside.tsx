"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SelectSchool from "./SelectSchool";
import CreateSchool from "./CreateSchool";

export function ConsoleAside() {
  const [schoolAction, setSchoolAction] = useState<"select" | "create">(
    "select",
  );

  return (
    <div className="flex w-full flex-col items-center justify-center md:p-8 lg:w-2/3">
      <div className="flex w-full items-center justify-center sm:w-[40rem]">
        <AnimatePresence mode="wait">
          {schoolAction === "select" && (
            <motion.div
              key="select"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-shrink-0 p-4"
            >
              <SelectSchool setSchoolAction={setSchoolAction} />
            </motion.div>
          )}

          {schoolAction === "create" && (
            <motion.div
              key="create"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-shrink-0 p-4"
            >
              <CreateSchool setSchoolAction={setSchoolAction} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
