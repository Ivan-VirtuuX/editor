<script setup lang="ts">
import { onMounted, ref } from "vue";
import DocumentItem from "../components/DocumentItem.vue";
import axios from "axios";
import { IDocument } from "../types.ts";

const documents = ref<IDocument[]>([]);

onMounted(async () => {
  try {
    const { data } = await axios.get<IDocument[]>(
      "http://localhost:7777/constructor-document"
    );

    documents.value = JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.warn(err);
  }
});
</script>

<template>
  <div class="container">
    <div class="documents">
      <div v-if="documents.length">
        <document-item
          v-for="document in documents"
          @click="
            $router.push(
              `/constructor/editor/id=${document.documentId}/itemId=${document.pages[0].pageId}`
            )
          "
          :document="document"
          :key="document.documentId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  background: #ffffff;
  border-radius: 5px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  -webkit-box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  width: 1000px;
  padding: 20px;
  margin: 100px auto 0;
  cursor: pointer;
  user-select: none;
}
</style>
