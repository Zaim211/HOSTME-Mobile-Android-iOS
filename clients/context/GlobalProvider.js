import { createContext, useContext, useEffect, useState } from "react";
import client from "../app/api/client";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await fetchUserProfile();
        } else {
          router.replace("/LogIn");
        }
      } catch (error) {
        console.error("Error fetching user token:", error);
        router.replace("/LogIn");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await client.get("/api/profile");
      if (data) {
        setUser(data);
        setIsLogged(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      await AsyncStorage.removeItem('token');
      router.replace("/LogIn");
    }
  };

  return (
    <GlobalContext.Provider
      value={{ user, setUser, loading, isLogged, setIsLogged }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;