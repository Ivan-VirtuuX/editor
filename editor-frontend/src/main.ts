import { createApp } from "vue";
import "./assets/main.scss";
import App from "./App.vue";
import ConstructorView from "./views/ConstructorView.vue";
import { createRouter, createWebHistory } from "vue-router";
import PageEditorView from "./views/PageEditorView.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faFileAlt,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const routes = [
  { name: "Constructor", path: "/constructor", component: ConstructorView },
  {
    name: "Editor",
    path: "/constructor/editor/id=:id",
    component: PageEditorView,
  },
  {
    name: "PageEditor",
    path: "/constructor/editor/id=:id/itemId=:itemId",
    component: PageEditorView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

library.add(faTrash, faSave, faPlus, faFile, faFileAlt);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
