// import { createContext, useState, useEffect, ReactNode } from "react";

// interface AuthContextType {
//   token: string | null;
//   saveToken: (token: string) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// export const AuthContext = createContext<AuthContextType>({
//   token: null,
//   saveToken: () => {},
//   logout: () => {},
//   isLoading: true,
// });

// export default function AuthContextProvider({ children }: { children: ReactNode }) {
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // قراءة التوكين عند تحميل التطبيق لأول مرة
//     const storedToken = localStorage.getItem("userToken");
//     if (storedToken) {
//       setToken(storedToken);
//     }
    
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const saveToken = (newToken: string) => {
//     localStorage.setItem("userToken", newToken);
//     setToken(newToken); // هنا التغيير اللي هيخلي الـ App يعمل Re-render فوراً!
//   };

//   const logout = () => {
//     localStorage.removeItem("userToken");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, saveToken, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }