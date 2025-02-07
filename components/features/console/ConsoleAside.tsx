"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChooseSchool from "./ChooseSchool";
import CreateSchool from "./CreateSchool";

export function ConsoleAside() {
  const [carouselIndex, setCarouselIndex] = useState<0 | 1>(0);

  return (
    <div className="flex w-full flex-col items-center justify-center md:p-8 lg:w-2/3">
      <div className="relative w-full overflow-hidden sm:w-[40rem]">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: carouselIndex ? "-50%" : "0%" }}
          transition={{ type: "tween", duration: 0.5 }}
          className="flex w-[200%] items-center"
        >
          <div className="w-1/2 flex-shrink-0 p-4">
            <ChooseSchool setCarouselIndex={setCarouselIndex} />
          </div>
          <div className="w-1/2 flex-shrink-0 p-4">
            <CreateSchool setCarouselIndex={setCarouselIndex} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
