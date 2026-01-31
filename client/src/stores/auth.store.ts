import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authService } from "@/services/auth.service";
import { useRouter } from "vue-router";
import type { LoginDto, SignUpDto } from "@/types/api";
import { translateError } from "@/utils/errorTranslator";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const token = ref<string | null>(localStorage.getItem("authToken"));
  const user = ref<any>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(creds: LoginDto) {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await authService.login(creds);

      token.value = data.token;
      localStorage.setItem("authToken", data.token);

      return true;
    } catch (err: any) {
      const rawMsg = err.error || err.message || "Unknown error";
      // @ts-ignore
      error.value = translateError(rawMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function signUp(payload: SignUpDto) {
    isLoading.value = true;
    error.value = null;
    try {
      await authService.signUp(payload);
      return true;
    } catch (err: any) {
      let rawMsg = "";
      if (err.errors) {
        const emailErr = err.errors.email?._errors?.[0];
        const passwordErr = err.errors.password?._errors?.[0];

        rawMsg = emailErr || passwordErr || "Invalid data provided";
      } else {
        rawMsg = err.error || err.message || "An error occurred";
      }
      // @ts-ignore
      error.value = translateError(rawMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("authToken");
    router.replace({ name: "login" });
  }

  return {
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    signUp,
    logout,
  };
});
