import { createRouter, createWebHistory } from "vue-router";

import ConstructorView from "./views/ConstructorView.vue";
import PageEditorView from "./views/PageEditorView.vue";

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

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
