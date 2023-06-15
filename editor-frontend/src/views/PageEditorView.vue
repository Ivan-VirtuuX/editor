<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from "vue";
import PageItem from "../components/PageItem.vue";
import editor from "@tinymce/tinymce-vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import PageCreateItem from "../components/PageCreateItem.vue";
import { IPage } from "../types.ts";
import { tinymceConfig } from "../editor.config.ts";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { convertDate } from "../utils/convertDate.ts";

const API_KEY = import.meta.env.VITE_API_KEY;

const content = ref("");
const currentPageMarkup = ref("");
const currentPageNameInput = ref("");
const activeTab = ref(1);
const tinyMCEEditor = ref();
const pages = ref<IPage[]>([]);
const currentPage = ref<IPage>();

const route = useRoute();
const router = useRouter();

const setActiveTab = (tab: number) => (activeTab.value = tab);

const getAllPages = async () => {
  try {
    const { data } = await axios.get<IPage[]>(
      `https://editor-production-1285.up.railway.app/constructor-document/${route.params.id}/page`
    );

    pages.value = [...data];
  } catch (err) {
    console.warn(err);
  }
};

const getCurrentPage = async () => {
  try {
    const { data } = await axios.get<IPage>(
      `https://editor-production-1285.up.railway.app/constructor-document/${route.params.id}/page/${route.params.itemId}`
    );

    currentPage.value = data as IPage;
    currentPageNameInput.value = data.name;
  } catch (err) {
    console.warn(err);
  }
};

const onClickPage = async (page: IPage) => {
  await router.push(
    `/constructor/editor/id=${route.params.id}/itemId=${page.pageId}`
  );
  await getCurrentPage();
};

const onClickCreatePage = async (pageName: string, markup?: string) => {
  try {
    const { data } = await axios.post(
      `https://editor-production-1285.up.railway.app/constructor-document/${route.params.id}/page`,
      {
        name: pageName,
        author: "Администратор",
        markup,
      }
    );

    pages.value.push(data);

    await router.push(
      `/constructor/editor/id=${route.params.id}/itemId=${data.pageId}`
    );

    await getCurrentPage();

    setActiveTab(1);
  } catch (err) {
    console.warn(err);
  }
};

const onClickCreateTitlePage = () => {
  const markup =
    "<p><strong>Полное наименование организации</strong></p><p><strong>Сокращенное наименование организации</strong></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong>ПРОГРАММА</strong></p><p><strong>ПОВЫШЕНИЯ КВАЛИФИКАЦИИ/ПРОФЕССИОНАЛЬНАЯ ПЕРЕПОДГОТОВКА</strong> (на выбор)</p><p><br></p><p>Количество часов часа</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong>Город 202_</strong></p>";

  content.value = markup;

  setActiveTab(1);
  onClickCreatePage("Титульная страница", markup);
};

const onClickSavePage = async () => {
  try {
    await axios.patch(
      `https://editor-production-1285.up.railway.app/constructor-document/${route.params.id}/page/${route.params.itemId}`,
      {
        name: currentPageNameInput.value,
        markup: currentPageMarkup,
      }
    );
  } catch (err) {
    console.warn(err);
  }
};

const onDeletePage = (pageId: string) => {
  pages.value = [...pages.value.filter((p) => p.pageId !== pageId)];

  content.value = "";
};

onMounted(() => {
  getAllPages();
  getCurrentPage();
});

watchEffect(() => {
  content.value = currentPage.value?.markup || "";
});

watch(content, () => {
  currentPageMarkup.value = content.value;
});
</script>

<template>
  <div class="container">
    <div class="left-side">
      <p class="left-side-header-title">test</p>
      <div class="left-side-buttons">
        <button :class="activeTab === 1 && 'active'" @click="setActiveTab(1)">
          Структура
        </button>
        <button
          class="add-page-button"
          :class="activeTab === 2 && 'active'"
          @click="setActiveTab(2)"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="icon" /><span
            >Добавить</span
          >
        </button>
      </div>
      <div class="left-side-documents-list" v-if="activeTab === 1">
        <page-item
          v-for="page in pages"
          :key="page.pageId"
          :page="page"
          @click="onClickPage(page)"
          @delete-page="onDeletePage"
        />
      </div>
      <div v-else class="left-side-document-create-block">
        <p>Основная</p>
        <page-create-item
          title="Пустой лист"
          @click="onClickCreatePage('Пустой лист')"
        />
        <page-create-item
          title="Титульная страница"
          @click="onClickCreateTitlePage"
        />
      </div>
    </div>

    <!--    <draggable />-->

    <div class="right-side">
      <div class="right-side-head">
        <a href="#">
          <font-awesome-icon icon="fa-solid fa-file-alt" class="icon" />
        </a>
        <div>
          <input
            type="text"
            class="form-control"
            v-model="currentPageNameInput"
          />
          <p class="updated-at">
            Дата изменения:
            {{ currentPage ? convertDate(currentPage.updatedAt) : "" }}
          </p>
        </div>
      </div>
      <div class="editor">
        <editor
          v-model="content"
          :api-key="API_KEY"
          :init="tinymceConfig"
          :ref="tinyMCEEditor"
          file_picker_types="image"
        />
        <div class="editor-footer">
          <button @click="onClickSavePage" class="editor-footer-save-button">
            <font-awesome-icon icon="fa-solid fa-save" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  -webkit-column-gap: 20px;
  -moz-column-gap: 20px;
  column-gap: 20px;
  padding: 20px;
  height: 700px;
}

.left-side {
  width: 540px;
}

.right-side {
  width: 1100px;
}

.left-side,
.right-side {
  background: #ffffff;
  border-radius: 5px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
}

.left-side-header-title {
  padding: 1.25rem;
  border-bottom: 1px solid #f0f3f6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-size: 17px;
}

.left-side-buttons {
  border-bottom: 2px solid rgba(152, 166, 173, 0.2);
  display: flex;
}

.add-page-button {
  display: flex;
  align-items: center;
  -webkit-column-gap: 5px;
  -moz-column-gap: 5px;
  column-gap: 5px;
}

.left-side-buttons button {
  padding: 8px 16px;
  background-color: #fff;
  margin-bottom: -1px;
  font-size: 13px;
}

.ti-plus {
  font-family: "themify", sans-serif;
  speak: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.active {
  border-bottom: 2px solid #019ff8;
}

.right-side-head {
  padding: 20px;
  display: flex;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
}

.right-side-head div {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  width: 100%;
}

.right-side-head a {
  width: 48px;
  height: 48px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.updated-at {
  color: #a1a4b5;
  font-size: 12px;
}

.icon {
  color: #3b4477;
}

.right-side-head a:hover .icon {
  color: #4791ff;
}

.form-control {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  height: 17px;
}

.form-control,
.form-select {
  box-shadow: none;
  background-color: #f6f9fb;
  border-color: #f6f9fb;
}

.form-control,
.form-select {
  padding: 0.45rem 0.9rem;
}

.editor {
  width: 1100px;
  height: 100%;
  position: relative;
}

.editor-footer {
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 2;
}

.editor-footer-save-button {
  background: #019ff8;
  color: #fff;
  padding: 10px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.left-side-documents-list {
  overflow-y: auto;
}

.left-side-documents-list,
.left-side-document-create-block {
  padding: 20px;
}

.left-side-document-create-block p {
  font-size: 13px;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #f00;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
