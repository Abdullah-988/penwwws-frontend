"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { FileText } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border-border z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const teacherRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLDivElement>(null);

  const studentOneRef = useRef<HTMLDivElement>(null);
  const studentTwoRef = useRef<HTMLDivElement>(null);
  const studentThreeRef = useRef<HTMLDivElement>(null);
  const studentFourRef = useRef<HTMLDivElement>(null);
  const studentFiveRef = useRef<HTMLDivElement>(null);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReversed((prev) => !prev);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isReversed]);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
        className,
      )}
      ref={sceneContainerRef}
    >
      <div className="flex size-full max-w-4xl flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center text-3xl">
          <Circle ref={teacherRef}>👩‍🏫</Circle>
        </div>

        <div className="flex flex-col justify-center">
          <Circle ref={fileRef} className="size-14">
            <FileText className="size-10" />
          </Circle>
        </div>

        <div className="flex flex-col justify-center gap-2 text-3xl">
          <Circle ref={studentOneRef}>🧑</Circle>
          <Circle ref={studentTwoRef}>👩‍🦱</Circle>
          <Circle ref={studentThreeRef}>👨</Circle>
          <Circle ref={studentFourRef}>🧑‍🦱</Circle>
          <Circle ref={studentFiveRef}>🧓</Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={sceneContainerRef}
        fromRef={teacherRef}
        toRef={fileRef}
        reverse={isReversed}
      />

      {[
        studentOneRef,
        studentTwoRef,
        studentThreeRef,
        studentFourRef,
        studentFiveRef,
      ].map((studentRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={sceneContainerRef}
          fromRef={fileRef}
          toRef={studentRef}
          reverse={isReversed}
        />
      ))}
    </div>
  );
}
