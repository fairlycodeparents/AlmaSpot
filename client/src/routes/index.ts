import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import AssistantView from "@/views/AssistantView.vue";
import PlanView from "@/views/PlanView.vue";

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/signup",
      name: "register",
      component: RegisterPage,
    },
    {
      path: "/assistant",
      name: "assistant",
      component: AssistantView,
    },
    {
      path: "/plan",
      name: "plan",
      component: PlanView,
    },
  ],
});

export default routes;
