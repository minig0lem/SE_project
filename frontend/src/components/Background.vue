<template>
  <div class="background">
    <div id="title">
      <slot name="title"></slot>
    </div>
    <div class="inner-background">
      <div id="content">
        <slot name="content"></slot>
      </div>
      <div id="pagination">
        <slot name="pagination"></slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
* {
  font-family: "Nanum Gothic";
}
#title {
  text-align: left;
  padding: 25px 20px 20px 30px;
}

#pagination {
  color: var(--main-color);
  align-self: center;
  padding-top: 20px;
}
.background {
  background-color: white;
  width: 60vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-bottom: 20px;
  min-height: 70vh;
  margin-top: 5vh;
}
.inner-background {
  background-color: var(--main4-color);
  width: 90%;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-self: center;
  font-weight: 500;
  padding: 5px;
  border-radius: 10px;
}
</style>
