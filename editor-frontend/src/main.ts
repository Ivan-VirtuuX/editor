import "./assets/main.scss";

import App from "./App.vue";

import { createApp } from "vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faFileAlt,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { router } from "./router.ts";

library.add(faTrash, faSave, faPlus, faFile, faFileAlt, faPlus);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
