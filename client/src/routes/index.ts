import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import AssistantView from "@/views/AssistantView.vue";
import PlanView from "@/views/PlanView.vue";
import AdminDashboardPage from "@/views/AdminDashboardPage.vue";
import StudentHomePage from "@/views/StudentHomePage.vue";
import ResultsPage from "@/views/ResultsPage.vue";

const requireAuth = (_to: any, _from: any, next: any) => {
  if (localStorage.getItem("authToken")) {
    next();
  } else {
    next({ name: "login", replace: true });
  }
};

const redirectIfAuthenticated = (_to: any, _from: any, next: any) => {
  if (localStorage.getItem("authToken")) {
    next({ name: "admin-home", replace: true });
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
      component: StudentHomePage,
    },
    {
      path: "/results",
      name: "student-results",
      component: ResultsPage,
      props: { variant: "student" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: "/signup",
      name: "register",
      component: RegisterPage,
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
      component: AdminDashboardPage,
      beforeEnter: requireAuth,
    },
    {
      path: "/admin/results",
      name: "admin-results",
      component: ResultsPage,
      props: { variant: "admin" },
      beforeEnter: requireAuth,
    },
    {
      path: "/admin/activities",
      name: "admin-activities",
      component: ResultsPage,
      props: { variant: "delete" },
      beforeEnter: requireAuth,
    },
  ],
});

export default routes;
