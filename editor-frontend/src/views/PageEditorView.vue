<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { Modal } from "usemodal-vue3";

import PageItem from "../components/PageItem.vue";

import editor from "@tinymce/tinymce-vue";
import { tinymceConfig } from "../editor.config.ts";

import axios from "axios";

import { IPage } from "../types.ts";

import { convertDate } from "../utils/convertDate.ts";

import PageCreateItem from "../components/PageCreateItem.vue";
import { numberValidator } from "../numberValidator.ts";

const API_KEY = import.meta.env.VITE_API_KEY;

const content = ref<string>("");
const currentPageMarkup = ref<string>("");
const currentPageNameInput = ref<string>("");
const activeTab = ref<number>(1);
const tinyMCEEditor = ref();
const pages = ref<IPage[]>([]);
const currentPage = ref<IPage>();
const isVisible = ref<boolean>(false);
const yearAttributeInput = ref<string>("");
const fullOrgNameAttributeInput = ref<string>("");
const shortOrgNameAttributeInput = ref<string>("");
const hoursAttributeInput = ref<string>("");
const cityAttributeInput = ref<string>("");

const attributes = computed<{ attributeName: string; value: string }[]>(() => [
  {
    attributeName: "year",
    value: yearAttributeInput.value,
  },
  {
    attributeName: "fullOrgName",
    value: fullOrgNameAttributeInput.value,
  },
  {
    attributeName: "shortOrgName",
    value: shortOrgNameAttributeInput.value,
  },
  {
    attributeName: "hours",
    value: hoursAttributeInput.value,
  },
  {
    attributeName: "city",
    value: cityAttributeInput.value + " ",
  },
]);

const route = useRoute();
const router = useRouter();

const setActiveTab = (tab: number) => (activeTab.value = tab);

const getAllPages = async () => {
  try {
    const { data } = await axios.get<IPage[]>(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        route.params.id
      }/page`
    );

    pages.value = [...data];
  } catch (err) {
    console.warn(err);
  }
};

const getCurrentPage = async () => {
  try {
    const { data } = await axios.get<IPage>(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        route.params.id
      }/page/${route.params.itemId}`
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
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        route.params.id
      }/page`,
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
    "<p><strong id='fullOrgName'>Полное наименование организации</strong></p><p><strong id='shortOrgName'>Сокращенное наименование организации</strong></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong>ПРОГРАММА</strong></p><p><strong>ПОВЫШЕНИЯ КВАЛИФИКАЦИИ/ПРОФЕССИОНАЛЬНАЯ ПЕРЕПОДГОТОВКА</strong> (на выбор)</p><p><br></p><p id='hours'>Количество часов часа</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong id='city'>Город </strong><strong id='year'>202_</strong></p>";

  content.value = markup;

  setActiveTab(1);
  onClickCreatePage("Титульная страница", markup);
};

const onClickSavePage = async () => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        route.params.id
      }/page/${route.params.itemId}`,
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

const onClickSaveField = (attributeName: string) => {
  const domParser = new DOMParser();
  const convertedEditorContent = domParser.parseFromString(
    content.value,
    "text/html"
  );
  const attributeTag = convertedEditorContent.body.querySelector(
    `#${attributeName}`
  );

  attributeTag.innerHTML = attributes.value.find(
    (el) => el.attributeName === attributeName
  ).value;
  content.value = convertedEditorContent.body.innerHTML;
};

onMounted(async () => {
  await getAllPages();

  if (pages.value.length) await getCurrentPage();
});

watchEffect(() => {
  content.value = currentPage.value?.markup || "";

  if (pages.value.length && pages.value[0].pageId)
    router.push(
      `/constructor/editor/id=${route.params.id}/itemId=${pages.value[0].pageId}`
    );
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
          <font-awesome-icon icon="fa-solid fa-plus" class="icon" />
          <span>Добавить</span>
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
          <button
            @click="isVisible = true"
            class="editor-footer-add-attribute-button"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
          </button>
          <button @click="onClickSavePage" class="editor-footer-save-button">
            <font-awesome-icon icon="fa-solid fa-save" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <Modal
    v-model:visible="isVisible"
    :cancelButton="{ text: 'Закрыть' }"
    title="Атрибуты"
  >
    <div class="attributes">
      <div class="attribute">
        <label for="1">Год</label>
        <input
          id="1"
          type="text"
          v-model="yearAttributeInput"
          @keypress="numberValidator"
        />
        <button
          class="save-button"
          @click="onClickSaveField('year')"
          v-show="yearAttributeInput"
        >
          <font-awesome-icon icon="fa-solid fa-save" />
        </button>
      </div>
      <div class="attribute">
        <label for="2">Наименование организации</label>
        <input id="2" type="text" v-model="fullOrgNameAttributeInput" />
        <button
          class="save-button"
          @click="onClickSaveField('fullOrgName')"
          v-show="fullOrgNameAttributeInput"
        >
          <font-awesome-icon icon="fa-solid fa-save" />
        </button>
      </div>
      <div class="attribute">
        <label for="3">Сокращенное наименование организации</label>
        <input id="3" type="text" v-model="shortOrgNameAttributeInput" />
        <button
          class="save-button"
          @click="onClickSaveField('shortOrgName')"
          v-show="shortOrgNameAttributeInput"
        >
          <font-awesome-icon icon="fa-solid fa-save" />
        </button>
      </div>
      <div class="attribute">
        <label for="4">Количество часов</label>
        <input
          id="4"
          type="text"
          v-model="hoursAttributeInput"
          @keypress="numberValidator"
        />
        <button
          class="save-button"
          @click="onClickSaveField('hours')"
          v-show="hoursAttributeInput"
        >
          <font-awesome-icon icon="fa-solid fa-save" />
        </button>
      </div>
      <div class="attribute">
        <label for="5">Город</label>
        <input id="5" type="text" v-model="cityAttributeInput" />
        <button
          class="save-button"
          @click="onClickSaveField('city')"
          v-show="cityAttributeInput"
        >
          <font-awesome-icon icon="fa-solid fa-save" />
        </button>
      </div>
    </div>
  </Modal>
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
  display: flex;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
}

.editor-footer-save-button,
.editor-footer-add-attribute-button {
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
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #01bef8;
  }
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

.attributes {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.attribute {
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
  position: relative;

  label {
    color: #3b4477;
    font-weight: 700;
  }

  input {
    font-size: 15px;
    border: 1px solid rgba(51, 54, 66, 0.1);
    padding: 5px 30px 5px 10px;
    border-radius: 5px;
    color: #3b4477;

    &::placeholder {
      color: #9c9c9c;
    }
  }
}

.save-button {
  position: absolute;
  right: 0;
  padding: 10px;
  background: transparent;
  font-size: 15px;
  color: #3b4477;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #019ff8;
  }
}
</style>
