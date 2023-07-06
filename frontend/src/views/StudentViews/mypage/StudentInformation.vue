<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>내 정보 조회/수정</h4>
      </template>
      <template v-slot:content>
        <form ref="formRef" @submit.prevent="submitHandler">
          <div class="form-group flex-box">
            <div class="flex-container">
              <label for="userType">회원가입 유형</label>
              <select
                class="form-select"
                disabled
                name="userType"
                id="userType"
                v-model="formData.userType"
              >
                <option value="">선택해주세요</option>
                <option value="student" selected>학생</option>
              </select>
            </div>
            <div class="flex-container">
              <label for="userNumber">이름</label>
              <input
                type="text"
                class="form-control"
                id="userName"
                name="userName"
                disabled
                v-model="userData.name"
              />
            </div>
            <div class="flex-container">
              <label for="userNumber">학번</label>
              <input
                type="text"
                class="form-control"
                id="userNumber"
                name="userNumber"
                disabled
                v-model="userData.student_id"
              />
            </div>
            <div class="flex-container">
              <label for="password">새 비밀번호</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                placeholder="비밀번호 수정을 원할때만 입력하세요"
                v-model="formData.password"
              />
            </div>
            <div class="flex-container">
              <label for="userPwCheck">새 비밀번호 확인</label>
              <input
                type="password"
                class="form-control"
                id="userPwCheck"
                name="passwordCheck"
                placeholder="비밀번호 수정을 원할때만 입력하세요"
                v-model="formData.passwordCheck"
              />
            </div>
            <div class="flex-container">
              <label for="userPwQ">비밀번호 찾기 질문</label>
              <select
                class="form-select"
                name="question"
                id="userPwQ"
                disabled
                v-model="userData.pw_question"
              >
                <option value="">선택해주세요</option>
                <option value="졸업한 초등학교 이름">
                  졸업한 초등학교 이름
                </option>
                <option value="졸업한 중학교 이름">졸업한 중학교 이름</option>
              </select>
            </div>
            <div class="flex-container">
              <label for="userPwA">비밀번호 찾기 답변</label>
              <input
                type="text"
                class="form-control"
                id="userPwA"
                name="answer"
                placeholder="비밀번호 찾기 질문 답변"
                disabled
                v-model="userData.pw_answer"
              />
            </div>
            <div class="flex-container">
              <label for="userBirth">생년월일</label>
              <input
                type="date"
                class="form-control"
                id="userBirth"
                name="birth"
                placeholder="이름을 입력하세요"
                disabled
                v-model="userData.birth"
              />
            </div>
            <div class="flex-container">
              <label for="userPhone">전화번호</label>
              <input
                type="text"
                class="form-control"
                id="userPhone"
                name="phoneNumber"
                placeholder="숫자로만 입력해주세요"
                required
                v-model="formData.phoneNumber"
              />
            </div>
            <div class="flex-container">
              <label for="userMajor">학과</label>
              <input
                type="text"
                class="form-control"
                id="userMajor"
                name="major"
                placeholder="학과(학부)를 입력하세요"
                disabled
                v-model="userData.major"
              />
            </div>
            <div class="flex-container">
              <label for="userEmail">이메일</label>
              <input
                type="email"
                class="form-control"
                id="userEmail"
                name="email"
                placeholder="Email을 입력하세요"
                required
                v-model="formData.email"
              />
            </div>
            <button type="submit" class="btn">수정하기</button>
          </div>
        </form>
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
import router from "@/router";
import store from "@/store";
import { useRouter } from "vue-router";

//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/student");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    const { getData } = useGetAxios("/api/student/mypage/information");
    const response = await getData();
    if (response.status === 200) {
      userData = response.data;
    } else if (response.status === 401) {
      alert("로그아웃 상태입니다!");
    } else {
      alert("유저 정보가 없습니다!");
    }
    formData.phoneNumber = userData.phone_number;
    formData.email = userData.email;
    isRendered.value = true;
  }
});
const isRendered = ref(false);
let userData = reactive({});
const formRef = ref(null);
const formData = reactive({
  userType: "student",
  password: "",
  passwordCheck: "",
  phoneNumber: "",
  email: "",
});

// submit전에 해야하는 동작
const submitHandler = async () => {
  const bothCheck = intCheck(userData.phone_number);
  if (!sameCheck()) {
    alert("비밀번호 동일 여부를 확인해주세요!");
  } else if (!bothCheck) {
    alert("전화번호에는 숫자만 입력가능합니다!");
  } else {
    const response = await infoUpdate();
    if (response === true) {
      alert("내 정보 수정 완료!");
      // store.dispatch("userInfo/setUser", userData);
      redirection();
    } else {
      alert("내 정보 수정 에러!");
    }
  }
};

// 서버한테 수정 가능한지 요청.
async function infoUpdate() {
  setPw();
  const { postData } = usePostAxios(
    "/api/student/mypage/information/update",
    formData
  );
  const response = await postData();
  if (response.status == 200) return true;
  else return false;
}
// 새로 바꾼 내 정보를 vuex userData에 집어넣기
function setPw() {
  // 비밀번호를 바꾸지 않을 때
  if (formData.password === "" && formData.passwordCheck === "") {
    formData.password = userData.pw;
  } else if (formData.password === "" || formData.passwordCheck === "") {
    alert("새로운 비밀번호를 확인해주세요!");
  }
}
// submit 후 학생메인으로 리다이렉트
const mainRouter = useRouter();
function redirection() {
  formRef.value.reset();
  mainRouter.push({ name: "학생 메인화면" });
}

// 비밀번호 동일 여부 확인
const sameCheck = () => {
  if (formData.password !== formData.passwordCheck) return false;
  else return true;
};

// 학번, 핸드폰 번호 숫자 입력인지 확인
function intCheck(num) {
  if (!isNaN(num)) return true;
  else return false;
}
</script>

<style scoped>
form {
  width: 80%;
  margin: 0 auto;
}
input,
select {
  border-color: #fa9884;
  width: 50%;
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
  margin: 40px;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  white-space: nowrap;
  width: 90%;
  padding: 5px;
}
label {
  margin-left: 10px;
  margin-left: 40px;
  color: black;
}

.btn {
  background-color: rgba(250, 152, 133, 0.3);
  width: 20%;
  color: var(--main-color);
  font-weight: bold;
  margin-top: 10px;
}

.btn:hover {
  background-color: var(--main2-color);
  color: rgba(231, 70, 70, 0.9);
}
</style>
