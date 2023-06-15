<script setup lang="ts">
import { convertDate } from "../utils/convertDate.ts";
import { IDocument } from "../types.ts";

const { document } = defineProps<{ document: IDocument }>();
const { name, updatedAt } = document;
</script>

<template>
  <div class="document-item-container">
    <div class="document-item-left-side">
      <font-awesome-icon icon="fa-solid fa-file" class="file-icon" />
      <p class="document-name">{{ name }}</p>
    </div>
    <span class="document-item-updated-at">{{ convertDate(updatedAt) }}</span>
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
</style>
