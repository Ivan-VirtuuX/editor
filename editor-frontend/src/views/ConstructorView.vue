<script setup lang="ts">
import { onMounted, ref } from "vue";

import axios from "axios";

import DocumentItem from "../components/DocumentItem.vue";

import { IDocument } from "../types.ts";

const documents = ref<IDocument[]>([]);
const documentName = ref<string>("");

const onClickCreateDocument = async () => {
  if (documentName.value) {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/constructor-document`,
        {
          name: documentName.value,
        }
      );
      documents.value.push(data);
      documentName.value = "";
    } catch (err) {
      console.warn(err);
    }
  }
};

const onDeleteDocument = (documentId: string) => {
  documents.value = [
    ...documents.value.filter((d) => d.documentId !== documentId),
  ];
};

onMounted(async () => {
  try {
    const { data } = await axios.get<IDocument[]>(
      `${import.meta.env.VITE_SERVER_URL}/constructor-document`
    );

    documents.value = JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.warn(err);
  }
});
</script>

<template>
  <div class="constructor-container">
    <div class="create-document">
      <input
        type="text"
        placeholder="Название документа"
        class="create-document-input"
        v-model="documentName"
      />
      <button class="create-document-button" @click="onClickCreateDocument">
        Создать
      </button>
    </div>
    <div class="documents">
      <div v-if="documents.length">
        <document-item
          v-for="document in documents"
          :document="document"
          :key="document.documentId"
          @delete-document="onDeleteDocument"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.constructor-container {
  background: #ffffff;
  border-radius: 5px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  -webkit-box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  width: 1000px;
  padding: 20px;
  margin: 100px auto 0;
  user-select: none;
  cursor: pointer;
}

.create-document {
  display: flex;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
  margin-bottom: 20px;
}

.create-document-input {
  padding: 10px 15px;
  border: 1px solid #58baab;
  border-radius: 5px;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;

  &:focus {
    &::placeholder {
      -webkit-transition: all 0.2s ease-in-out;
      -moz-transition: all 0.2s ease-in-out;
      -ms-transition: all 0.2s ease-in-out;
      -o-transition: all 0.2s ease-in-out;
      transition: all 0.2s ease-in-out;
      color: #000;
    }
  }
}

.create-document-button {
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #58baab;
  color: #fff;
  font-size: 13px;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #64c7b9;
  }
}
</style>
