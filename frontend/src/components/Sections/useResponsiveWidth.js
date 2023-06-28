import { useEffect, useState } from "react";

export default function useResponsiveWidth() {
  const [responsiveWidth, setResponsiveWidth] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setResponsiveWidth(width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { responsiveWidth };
}
