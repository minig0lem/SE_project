<template>
  <footer>
    <div class="flex-container">
      <div style="font-size: small">Kwangwoon Univ.</div>
      <div class="a-container">
        <a href="/student">Home</a>
        <a href="https://www.youtube.com" target="_blank">Youtube</a>
        <a href="https://github.com/chany0ng/SE_Project" target="_blank"
          >Github</a
        >
      </div>
    </div>
    <hr />
    <span>Copyright 2023. Software Engineering. All Rights Reserved.</span>
  </footer>
</template>

<script setup></script>

<style scoped>
* {
  font-weight: 200;
}
footer {
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--footer);
  color: white;
  text-align: center;
  border-top: 0.1px solid gray;
  margin-top: 10px;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  margin-top: 2px;
  width: 60%;
}
.flex-container > div {
  max-height: 100%;
}
a {
  color: white;
  font-size: x-small;
  text-decoration: none;
  text-decoration: underline;
}
.a-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
}
hr {
  width: 55vw;
  position: absolute;
  bottom: 24px;
  left: 22.7vw;
  margin: 0;
  box-sizing: border-box;
}
span {
  font-size: x-small;
  font-style: italic;
}
</style>
