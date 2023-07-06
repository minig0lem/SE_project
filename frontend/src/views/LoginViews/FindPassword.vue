<template>
  <div class="container input-bg col-md-4">
    <h1>비밀번호 찾기</h1>
    <form ref="formRef" @submit.prevent="submitForm">
      <div class="form-group flex-box">
        <div class="flex-container" v-show="showQuestion">
          <label for="userName">이름</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            name="userName"
            placeholder="이름을 입력하세요"
            :required="showQuestion"
            v-model="formData.name"
          />
        </div>
        <div class="flex-container" v-show="showQuestion">
          <label for="userNumber">학번</label>
          <input
            type="text"
            class="form-control"
            id="userNumber"
            name="userNumber"
            placeholder="학번을 입력하세요"
            :required="showQuestion"
            v-model="formData.userNumber"
          />
        </div>
        <div class="flex-container" v-show="!showQuestion">
          <label for="userPwQ">비밀번호 찾기 질문</label>
          <select class="form-select" name="question" id="userPwQ">
            <option value="school">
              {{ pw_question }}
            </option>
          </select>
        </div>
        <div class="flex-container" v-show="!showQuestion">
          <label for="userPwA">비밀번호 찾기 답변</label>
          <input
            type="text"
            class="form-control"
            id="userPwA"
            name="answer"
            placeholder="비밀번호 찾기 질문 답변"
            :required="!showQuestion"
            v-model="answer"
          />
        </div>
        <button type="submit" class="btn">Submit</button>
      </div>
    </form>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { usePostAxios } from "@/composable";
import { useRouter } from "vue-router";
const router = useRouter();
const showQuestion = ref(true);
const formRef = ref(null);
const pw_question = ref("");
const answer = ref("");
const formData = reactive({
  name: "",
  userNumber: "",
});

// submit 후 로그인화면으로 redirection
function redirection() {
  formRef.value.reset();
  router.push({ name: "Login" });
}

// submit 제출
async function submitForm() {
  // 이름,학번 제출
  if (showQuestion.value) {
    const { postData } = usePostAxios("/api/login/findpw", formData);
    const response = await postData();
    if (response.status === 200) {
      pw_question.value = response.data;
      showQuestion.value = !showQuestion.value;
    } else alert("이름 혹은 학번이 일치하지 않습니다!");
  }
  // 비밀번호 찾기 답변 제출
  else {
    const { postData } = usePostAxios("/api/login/findpw_process", {
      userPwA: answer.value,
      userNumber: formData.userNumber,
    });
    const response = await postData();
    if (response.status === 200) {
      alert(`비밀번호는 ${response.data}입니다.`);
      showQuestion.value = !showQuestion.value;
      redirection();
    } else {
      alert(`답변이 일치하지 않습니다!`);
    }
  }
}
</script>

<style scoped>
div {
  background-color: white;
}
input,
select {
  border-color: #fa9884;
  width: 60%;
}
h1 {
  margin-top: 10px;
  margin-bottom: 20px;
  color: var(--main-color);
  font-weight: bold;
}
.flex-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}
.flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  white-space: nowrap;
  width: 90%;
  padding: 5px;
}
label {
  color: black;
  margin-bottom: 10px;
  font-size: large;
}

.btn {
  background-color: rgba(250, 152, 133, 0.3);
  width: 30%;
  color: var(--main-color);
  font-weight: bold;
}

.btn:hover {
  background-color: var(--main2-color);
  color: rgba(231, 70, 70, 0.9);
}
</style>
