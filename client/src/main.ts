import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./routes";

const app = createApp(App);
const pinia = createPinia();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("sw registered successfully:", registration.scope);
      })
      .catch((err) => {
        console.error("Error in sw registration:", err);
      });
  });
}

app.use(pinia);
app.use(router);

app.mount("#app");
