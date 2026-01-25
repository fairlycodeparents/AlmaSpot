import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import AssistantView from "@/views/AssistantView.vue";
import PlanView from "@/views/PlanView.vue";
import AdminDashboardPage from "@/views/AdminDashboardPage.vue";
import AdminResultsPage from "@/views/AdminResultsPage.vue";

const requireAuth = (_to: any, _from: any, next: any) => {
  if (localStorage.getItem("authToken")) {
    next();
  } else {
    next("/login");
  }
};

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
    {
      path: "/admin",
      component: AdminDashboardPage,
      beforeEnter: requireAuth,
    },
    {
      path: "/admin/results",
      component: AdminResultsPage,
      beforeEnter: requireAuth,
    },
  ],
});

export default routes;
