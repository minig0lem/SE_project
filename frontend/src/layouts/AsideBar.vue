<template>
  <aside>
    <p>{{ currentName }}</p>
    <p>{{ currentPath }}</p>
  </aside>
</template>

<script setup>
// import { inject } from "vue";
// const message = inject("message");
// console.log(message.value); // 'Hello from parent!'

import { usePageName, usePagePath } from "@/composable";

// 현재 페이지 이름 받아오기
const currentName = usePageName();
const currentPath = usePagePath();
</script>

<style scoped>
aside {
  background-color: aquamarine;
}
</style>
