<script setup lang="ts">
import { convertDate } from "../utils/convertDate.ts";

import { IDocument } from "../types.ts";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import axios from "axios";

const { document } = defineProps<{ document: IDocument }>();
const { name, updatedAt } = document;

const isActionsVisible = ref<boolean>(false);

const emit = defineEmits(["delete-document"]);

const onClickDeleteDocument = async () => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document/${
        document.documentId
      }`
    );

    await emit("delete-document", document.documentId);
  } catch (err) {
    console.warn(err);
  }
};
</script>

<template>
  <div
    class="document-item-container"
    @mouseenter="isActionsVisible = true"
    @mouseleave="isActionsVisible = false"
  >
    <div
      class="document-item-left-side"
      @click="
        $router.push(
          document.pages[0]
            ? `/constructor/editor/id=${document.documentId}/itemId=${document.pages[0].pageId}`
            : `/constructor/editor/id=${document.documentId}`
        )
      "
    >
      <font-awesome-icon icon="fa-solid fa-file" class="file-icon" />
      <p class="document-name">{{ name }}</p>
    </div>
    <span class="document-item-updated-at">{{ convertDate(updatedAt) }}</span>
    <div class="document-actions" :style="isActionsVisible ? 'opacity: 1' : ''">
      <button class="delete-document-button" @click="onClickDeleteDocument">
        <font-awesome-icon icon="fa-solid fa-trash" class="icon" />
        <span class="tooltip" data-tooltip="Удалить" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.document-item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  -webkit-transition: 0.1s ease-in-out;
  -moz-transition: 0.1s ease-in-out;
  -ms-transition: 0.1s ease-in-out;
  -o-transition: 0.1s ease-in-out;
  transition: 0.1s ease-in-out;
  position: relative;
}

.document-item-container:hover {
  background: #f0f3f6;
}

.document-item-left-side {
  display: flex;
  align-items: center;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 30px;
}

.document-name {
  color: #7f839a;
  font-size: 13px;
}

.document-item-updated-at {
  font-size: 13px;
  color: #191d33;
}

.file-icon {
  color: #58baab;
  font-size: 15px;
}

.document-actions {
  position: absolute;
  right: 5px;
  top: 18px;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}

.delete-document-button {
  background-color: transparent;
  font-size: 12px;
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

.delete-document-button:hover .tooltip {
  opacity: 1;
}
</style>
