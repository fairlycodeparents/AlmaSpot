import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import AssistantView from "@/views/AssistantView.vue";
import PlanView from "@/views/PlanView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import ResultsView from "@/views/ResultsView.vue";

const requireAuth = (_to: any, _from: any, next: any) => {
  if (localStorage.getItem("authToken")) {
    next();
  } else {
    next({ name: "login", replace: true });
  }
};

const redirectIfAuthenticated = (_to: any, _from: any, next: any) => {
  if (localStorage.getItem("authToken")) {
    next({ name: "admin-home" });
  } else {
    next();
  }
};

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/results",
      name: "student-results",
      component: ResultsView,
      props: { variant: "student" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: "/signup",
      name: "register",
      component: RegisterView,
      beforeEnter: redirectIfAuthenticated,
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
      name: "admin-home",
      component: AdminDashboardView,
      beforeEnter: requireAuth,
    },
    {
      path: "/admin/results",
      name: "admin-results",
      component: ResultsView,
      props: { variant: "admin" },
      beforeEnter: requireAuth,
    },
    {
      path: "/admin/activities",
      name: "admin-activities",
      component: ResultsView,
      props: { variant: "delete" },
      beforeEnter: requireAuth,
    },
  ],
});

export default routes;
