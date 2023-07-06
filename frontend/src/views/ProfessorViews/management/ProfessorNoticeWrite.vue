<template>
  <div v-if="isRendered">
    <ProfessorHeader />
    <Background>
      <template v-slot:title>
        <h4>공지사항/ 글 작성</h4>
      </template>
      <template v-slot:content>
        <div id="form-container">
          <form @submit.prevent="submitHandler" method="post" ref="formRef">
            <div class="mb-3 input-container">
              <label class="form-label">글 제목</label>
              <input
                type="text"
                class="form-control"
                v-model="writeData.title"
                placeholder="제목을 입력하세요"
                required
              />
            </div>
            <hr />
            <div class="mb-3 input-container">
              <label class="form-label">글 내용</label>
              <textarea
                class="form-control"
                rows="10"
                v-model="writeData.description"
                required
              ></textarea>
            </div>
            <button type="submit" id="writeBtn">등록하기</button>
          </form>
        </div>
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from "vue";
import { loginCheck, useGetAxios, usePostAxios } from "@/composable";
import MainFooter from "@/layouts/MainFooter.vue";
import StudentHeader from "@/layouts/StudentHeader.vue";
import Background from "@/components/Background.vue";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import ProfessorHeader from "@/layouts/ProfessorHeader.vue";

//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/student/subject/qna");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    isRendered.value = true;
  }
});

// 로그인 시 필요한 입력 값
const writeData = reactive({
  title: "",
  description: "",
});
const router = useRouter();
const isRendered = ref(false);
// url에 포함된 params를 읽어오기
const route = useRoute();
const subjectId = computed(() => route.params.id);

// 글 등록하기 함수
const submitHandler = async () => {
  const { postData } = usePostAxios(
    `/api/student/subject/qna/${subjectId.value}/write`,
    writeData
  );
  const response = await postData();
  if (response.status === 200) {
    router.push(`/student/subject/qna/${subjectId.value}/1`);
  } else {
    alert("게시물 등록 에러!");
  }
};
</script>

<style scoped>
#writeBtn {
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
  color: var(--main-color);
}
a {
  text-decoration: none;
  color: var(--main-color);
}
#form-container {
  display: flex;
  flex-direction: column;
  height: 50vh;
}
.input-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-size: larger;
}
.form-label {
  width: 10%;
  margin-right: 10px;
}
.form-control {
  width: 90%;
  margin-right: 10px;
}
.form-control:focus {
  border-color: var(--main-color);
  box-shadow: none;
}
</style>
