import { defineStore } from "pinia";
import { useCookie } from "#app";
import { useRuntimeConfig } from "#app";
import { vdbFetchData } from "@/api/api";

export const useUserStore = defineStore("userStore", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.baseUrl;
  const tokenDuration = 60 * 30;

  const token = useCookie("latestToken", {
    maxAge: tokenDuration,
    default: () => null,
  });

  const user = ref(null);
  const fetching = ref(false);

  // +++ login +++
  async function login(email, password) {
    fetching.value = true;
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(`Login fehlgeschlagen! (${res.status})`);

      const data = await res.json();
      token.value = data.accessToken;
      console.log("✅ Token gespeichert:", token.value);

      await getUser();
    } catch (error) {
      console.error("❌ Login-Fehler:", error);
    } finally {
      fetching.value = false;
    }
  }

  // +++ get User +++
  async function getUser() {
    if (!token.value) {
      console.warn("🔸 Kein Token vorhanden. getUser wird nicht ausgeführt.");
      return;
    }

    fetching.value = true;
    try {
      console.log("📡 getUser aufgerufen. Aktueller Token:", token.value);
      user.value = await vdbFetchData("user", "GET", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch (error) {
      console.error("❌ Fehler beim Abrufen des Nutzers:", error);
    } finally {
      fetching.value = false;
    }
  }

  // +++ logout +++
  function logout() {
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    fetching,
    login,
    getUser,
    logout,
  };
});
