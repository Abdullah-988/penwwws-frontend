"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChooseSchool from "./ChooseSchool";
import CreateSchool from "./CreateSchool";

export function ConsoleAside() {
  const [schoolAction, setSchoolAction] = useState<"choose" | "create">(
    "choose",
  );

  return (
    <div className="flex w-full flex-col items-center justify-center md:p-8 lg:w-2/3">
      <div className="flex w-full items-center justify-center sm:w-[40rem]">
        <AnimatePresence mode="wait">
          {schoolAction === "choose" ? (
            <motion.div
              key="choose"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-shrink-0 p-4"
            >
              <ChooseSchool setSchoolAction={setSchoolAction} />
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
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
