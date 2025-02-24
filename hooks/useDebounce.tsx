import { useEffect, useState } from "react";

export const useDebounce = (content: string, time = 500) => {
  const [debouncedContent, setDebouncedContent] = useState(content);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, time);
    return () => {
      clearTimeout(handler);
    };
  }, [content, time]);
  return debouncedContent;
};
