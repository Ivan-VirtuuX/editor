<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="document-create-item-container">
    <span class="document-create-item-text">
      <font-awesome-icon icon="fa-solid fa-file" class="icon" />
      <span>
        {{ title }}
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.document-create-item-container {
  font-size: 14px;
  font-weight: 600;
  color: #191d33;
  padding: 10px 0;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.document-create-item-container:hover {
  background: #f0f3f6;
}

.document-create-item-text {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  -webkit-column-gap: 5px;
  -moz-column-gap: 5px;
  column-gap: 5px;
}

.document-create-item-text:hover {
  color: #019ff8;
}
</style>
