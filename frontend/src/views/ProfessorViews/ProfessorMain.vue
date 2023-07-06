<template>
  <router-view></router-view>
  <div v-if="isRendered">
    <ProfessorHeader />
    <Background>
      <template v-slot:content>
        <div class="container">
          <div class="inner-container1">
            <div class="item" style="width: 100%">
              <h2 style="margin-bottom: 20px">
                <span style="font-size: 20px; font-weight: bold">{{
                  professorData.name
                }}</span>
                교수님 반갑습니다.
              </h2>
              <table class="tg">
                <thead>
                  <tr>
                    <th class="tg-baqh">학과/학부</th>
                    <th class="tg-baqh">이메일</th>
                    <th class="tg-baqh">전화번호</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td class="tg-baqh">{{ professorData.major }}</td>
                    <td class="tg-baqh">{{ professorData.email }}</td>
                    <td class="tg-baqh">{{ professorData.phone_number }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="inner-container2">
            <h1>담당 과목</h1>
            <div
              v-for="(course, index) of subjectData"
              :key="index"
              class="subject-block"
            >
              <div class="item">
                <h2>{{ course.subject_name }}</h2>
              </div>
              <div class="item">
                <button class="my-button">
                  <router-link
                    :to="`/professor/subject/notice/${course.subject_id}/1`"
                  >
                    공지사항 →</router-link
                  >
                </button>
              </div>
              <div class="item">
                <button class="my-button">
                  <router-link :to="`/professor/subject/syllabus/`">
                    강의계획서 →</router-link
                  >
                </button>
              </div>
              <div class="item">
                <button class="my-button">
                  <router-link :to="`/professor/subject/qna/`">
                    강의 묻고 답하기 →</router-link
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch, reactive } from "vue";
import { loginCheck, useGetAxios } from "@/composable";
import MainFooter from "../../layouts/MainFooter.vue";
import ProfessorHeader from "../../layouts/ProfessorHeader.vue";
import Background from "@/components/Background.vue";
import router from "@/router";
import store from "@/store";

//로그인 유무 받아오기
onBeforeMount(async () => {
  const loggedIn = await loginCheck("/api/login");
  if (loggedIn === true) {
    alert("학생로그인 되어있습니다!");
    router.push("/student");
  } else if (loggedIn === false) {
    router.push("/professor");
  } else {
    router.push("/login");
  }
  await getSubject();
  store.dispatch("subjectInfo/setSubject", subjectData.value);
});

const isRendered = ref(true);
const subjectData = ref();
const professorData = ref();

async function getSubject() {
  const { getData } = useGetAxios("/api/professor");
  const response = await getData();
  if (response.status === 200) {
    professorData.value = response.data[0];
    subjectData.value = response.data[1];
  } else {
    alert("로그인을 해주세요!");
    router.push("/login");
  }
}
</script>

<style scoped>
h1 {
  font-size: 15px;
  margin-bottom: 20px;
  margin-left: 20px;
  text-align: left;
}

h2 {
  font-size: 12px;
  margin-bottom: 20px;
  text-align: left;
}
a {
  color: var(--main-color);
  text-decoration: none;
}

.container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  text-align: center;
}

.inner-container1 {
  width: 550px;
  padding-right: 100px;
  display: flex;
  align-items: center;
  justify-content: left;
}

.inner-container2 {
  width: 580px;
  padding-right: 100px;
  text-align: center;
  margin-top: 15px;
}

.item {
  margin: 0 10px;
  display: inline-block;
}

.subject-block {
  width: 550px;
  height: 50px;
  border: 1px solid #000;
  border-radius: 10px;
  text-align: center;
  display: flex;
  margin: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
}
h2 {
  margin: 0px;
}
.tg {
  border-collapse: collapse;
  border-spacing: 0;
  width: 550px;
}
.inner-background {
  width: 95%;
}
.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 11px;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
  height: 10px;
}

.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: normal;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
  height: 20px;
}

.tg .tg-baqh {
  text-align: center;
  vertical-align: middle;
}

.my-button {
  font-size: 12px;
  border: none;
  border-radius: 5px;
  background-color: var(--main3-color);
}
</style>
