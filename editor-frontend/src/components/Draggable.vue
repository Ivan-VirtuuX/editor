<script setup lang="ts">
import { ref } from "vue";

const myArray = ref([
  "Bat wing soup",
  "Spicy Octopus",
  "Anything from Taco Bell",
]);
</script>

<template>
  <!--  <draggable v-model="myArray" tag="ul" group="myArray">-->
  <!--    <template #item="{ element: el }">-->
  <!--      <li>{{ el }}</li>-->
  <!--    </template>-->
  <!--  </draggable>-->
</template>

<style scoped lang="scss"></style>
