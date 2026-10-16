import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // أول ما الـ pathname أو الـ URL يتغير (حتى لو بين يوزرز مختلفين)، انزل على أول الصفحة فوق خالص
    window.scrollTo({
      top: 0,
      behavior: "smooth", // ممكن تخليها "auto" لو عايزها تنط فوق فوراً من غير ناعم
    });
  }, [pathname, search]);

  return null;
}