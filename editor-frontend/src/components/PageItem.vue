<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import axios from "axios";

import { IPage } from "../types.ts";

import { convertDate } from "../utils/convertDate.ts";

const { page } = defineProps<{ page: IPage }>();

const route = useRoute();
const router = useRouter();

const isActionsVisible = ref<boolean>(false);

const emit = defineEmits(["delete-page"]);

const onClickDeletePage = async () => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        route.params.id
      }/page/${route.params.itemId}`
    );

    await emit("delete-page", page.pageId);

    await router.push(`/constructor/editor/id=${route.params.id}`);
  } catch (err) {
    console.warn(err);
  }
};
</script>

<template>
  <div
    class="page-item-container"
    @mouseenter="isActionsVisible = true"
    @mouseleave="isActionsVisible = false"
  >
    <div class="page-item-left-side">
      <font-awesome-icon icon="fa-solid fa-file-alt" class="icon" />
      <div class="page-item-left-side-text">
        <div class="page-item-name">{{ page.name }}</div>
        <div class="page-item-author">{{ page.author }}</div>
      </div>
    </div>
    <div class="page-item-updated-at">
      {{ convertDate(page.updatedAt) }}
    </div>
    <div class="page-actions" :style="isActionsVisible ? 'opacity: 1' : ''">
      <button class="delete-page-button" @click="onClickDeletePage">
        <font-awesome-icon icon="fa-solid fa-trash" class="icon" />
        <span class="tooltip" data-tooltip="Удалить" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-item-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 7px;
  margin: 3px;
}

.page-item-left-side {
  display: flex;
  align-items: center;
  -webkit-column-gap: 5px;
  -moz-column-gap: 5px;
  column-gap: 5px;
  position: relative;
}

.page-item-left-side .icon {
  font-size: 15px;
}

.icon {
  color: #3b4477 !important;
}

.page-item-name {
  font-weight: 600;
  color: #3b4477;
}

.page-item-author {
  color: #191d33;
}

.page-item-name,
.page-item-author {
  font-size: 14px;
}

.fa-file-text-o:before {
  font-size: 13px;
  color: #3b4477;
}

.page-item-updated-at {
  font-size: 12px;
  color: #7f839a;
}

.page-item-left-side-text {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}

.page-actions {
  position: absolute;
  right: -10px;
  top: 15px;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}

.icon {
  color: #000;
}

.delete-page-button {
  background-color: transparent;
}

.icon {
  font-size: 11px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #000 !important;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 0;
  right: -20px;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.3s;
}

.delete-page-button:hover .tooltip {
  opacity: 1;
}
</style>
