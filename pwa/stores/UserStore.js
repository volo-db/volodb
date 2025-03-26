import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { vdbFetchData } from "@/api/api";

const BASE_URL = "https://volodb.urner.dev/api/v1";
// const router = useRouter();

const state = useStorage("user-store", {
  latestToken: null,
  tokenRefreshTime: null,
  user: null,
  fetching: false,
});

export const useUserStore = defineStore("userStore", {
  state: () => state,
  actions: {
    async login(email, password) {
      this.fetching = true;
      await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok)
            throw Error(`VoloDB-ERROR\n🙅‍♀️ login failed! (${res.status}`);
          return res.json();
        })
        .then((res) => {
          this.latestToken = res.accessToken;
          this.tokenRefreshTime = Date.now();
          this.getUser();
        })
        // .catch((error) => {
        //   this.loginErrorMessage = error
        // })
        .finally(() => (this.fetching = false));
    },
    async getUser() {
      this.fetching = true;
      this.user = await vdbFetchData("user", "GET");
      this.fetching = false;
    },
    logout() {
      this.latestToken = null;
      this.user = null;
      router.replace({ name: "login" });
    },
    refreshToken() {
      // exit if token is less then half an hour old
      const tokenDuration = 1000 * 60 * Number("30"); // Duration in Milliseconds
      if (this.tokenRefreshTime > Date.now() - tokenDuration) return;

      console.log(this.latestToken);

      fetch(`${BASE_URL}/auth/refresh`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.latestToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            this.logout();
            throw Error(
              `VoloDB-ERROR\n🙅‍♀️ upsi! invalid token: Token has probably expired. (${res.status})`
            );
          }
          return res.json();
        })
        .then((token) => {
          this.latestToken = token.accessToken;
          this.tokenRefreshTime = Date.now();
        });
    },
  },
  getters: {
    loggedIn(state) {
      return Boolean(state.latestToken);
    },
    token(state) {
      this.refreshToken();
      return state.latestToken;
    },
  },
});

// import { defineStore } from "pinia";
// import { useStorage } from "@vueuse/core";
// // import { useRouter } from "vue-router";
// import { useRuntimeConfig } from "#app";
// import { vdbFetchData } from "@/api/api";

// export const useUserStore = defineStore("userStore", () => {
//   const config = useRuntimeConfig();
//   const apiUrl = config.public.baseUrl;
//   const tokenDur = config.public.tokenDuration;
//   const router = useRouter();

//   const fetching = ref(false);
//   const user = ref(null);
//   const latestToken = useStorage("latestToken", null);
//   const tokenRefreshTime = useStorage("tokenRefreshTime", null);

//   async function login(email, password) {
//     fetching.value = true;

//     try {
//       const res = await fetch(`${apiUrl}/auth/login`, {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         throw new Error(`VoloDB-ERROR\n🙅‍♀️ login failed! (${res.status})`);
//       }

//       const data = await res.json();
//       latestToken.value = data.accessToken;
//       tokenRefreshTime.value = Date.now();
//       await getUser();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       fetching.value = false;
//     }
//   }

//   async function getUser() {
//     fetching.value = true;
//     console.log("Sending request with token:", latestToken.value);
//     user.value = await vdbFetchData("user", "GET");
//     fetching.value = false;
//   }

//   function logout() {
//     latestToken.value = null;
//     user.value = null;
//     router.replace({ name: "login" });
//   }

//   function refreshToken() {
//     console.log("Trying to refresh token:", latestToken.value);
//     const tokenDuration = 1000 * 60 * Number(tokenDur);
//     if (tokenRefreshTime.value > Date.now() - tokenDuration) return;

//     fetch(`${apiUrl}/auth/refresh`, {
//       method: "GET",
//       headers: {
//         "content-type": "application/json",
//         authorization: `Bearer ${latestToken.value}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           logout();
//           throw new Error(
//             `VoloDB-ERROR\n🙅‍♀️ invalid token: Token expired. (${res.status})`
//           );
//         }
//         return res.json();
//       })
//       .then((token) => {
//         console.log("New token received:", token.accessToken);
//         latestToken.value = token.accessToken;
//         tokenRefreshTime.value = Date.now();
//       });
//   }

//   // const loggedIn = computed(() => Boolean(latestToken.value));

//   // const token = computed(() => {
//   //   refreshToken();
//   //   return latestToken.value;
//   // });

//   const loggedIn = computed(() => Boolean(latestToken.value));
//   const token = computed(() => latestToken.value);

//   watchEffect(() => {
//     if (latestToken.value) {
//       console.log("Checking token refresh...");
//       refreshToken();
//     }
//   });

//   return {
//     latestToken,
//     tokenRefreshTime,
//     user,
//     fetching,
//     login,
//     getUser,
//     logout,
//     refreshToken,
//     loggedIn,
//     token,
//   };
// });
