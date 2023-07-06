<template>
  <div class="container input-bg col-md-4">
    <h1>회원가입</h1>
    <form ref="formRef" @submit.prevent="submitHandler">
      <div class="form-group flex-box">
        <div class="flex-container">
          <label for="userType">회원가입 유형</label>
          <select
            class="form-select"
            required
            name="userType"
            id="userType"
            v-model="formData.userType"
          >
            <option value="student">학생</option>
            <option value="professor">교수</option>
            <option value="admin">관리자</option>
          </select>
        </div>
        <div class="flex-container" v-if="!isAdmin">
          <label for="userNumber">이름</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            name="userName"
            placeholder="이름을 입력하세요"
            required
            v-model="formData.userName"
          />
        </div>
        <div class="flex-container">
          <label for="userNumber">이용자 번호</label>
          <input
            type="text"
            class="form-control"
            id="userNumber"
            name="userNumber"
            placeholder="학번 혹은 교수번호를 입력하세요"
            required
            v-model="formData.userNumber"
          />
        </div>
        <div class="flex-container">
          <label for="password">비밀번호</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            required
            v-model="formData.password"
          />
        </div>
        <div class="flex-container">
          <label for="userPwCheck">비밀번호 확인</label>
          <input
            type="password"
            class="form-control"
            id="userPwCheck"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            required
            v-model="formData.passwordCheck"
          />
        </div>
        <div class="flex-container" v-if="isAdmin">
          <label for="adminNumber">관리자 인증번호</label>
          <input
            type="text"
            class="form-control"
            id="adminNumber"
            name="adminNumber"
            placeholder="관리자 전용번호를 입력하세요"
            required
            v-model="formData.adminNumber"
          />
        </div>
        <div class="flex-container" v-if="!isAdmin">
          <label for="userPwQ">비밀번호 찾기 질문</label>
          <select
            class="form-select"
            required
            name="question"
            id="userPwQ"
            v-model="formData.question"
          >
            <option value="">선택해주세요</option>
            <option value="졸업한 초등학교 이름">졸업한 초등학교 이름</option>
            <option value="졸업한 중학교 이름">졸업한 중학교 이름</option>
          </select>
        </div>
        <div class="flex-container" v-if="!isAdmin">
          <label for="userPwA">비밀번호 찾기 답변</label>
          <input
            type="text"
            class="form-control"
            id="userPwA"
            name="answer"
            placeholder="비밀번호 찾기 질문 답변"
            required
            v-model="formData.answer"
          />
        </div>
        <div class="flex-container" v-if="!isAdmin">
          <label for="userBirth">생년월일</label>
          <input
            type="date"
            class="form-control"
            id="userBirth"
            name="birth"
            placeholder="이름을 입력하세요"
            required
            v-model="formData.birth"
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
        <div class="flex-container" v-if="!isAdmin">
          <label for="userMajor">학과</label>
          <input
            type="text"
            class="form-control"
            id="userMajor"
            name="major"
            placeholder="학과(학부)를 입력하세요"
            required
            v-model="formData.major"
          />
        </div>
        <div class="flex-container" v-if="isProfessor">
          <label for="userRoom">연구실</label>
          <input
            type="text"
            class="form-control"
            id="userRoom"
            name="room"
            placeholder="연구실(교수실) 입력하세요"
            required
            v-model="formData.room"
          />
        </div>
        <div class="flex-container" v-if="!isAdmin">
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
        <button type="submit" class="btn">Submit</button>
      </div>
    </form>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { usePostAxios } from "@/composable";
import { useRouter } from "vue-router";

const formRef = ref(null);
const formData = reactive({
  userType: "student",
  userName: "",
  userNumber: "",
  password: "",
  passwordCheck: "",
  adminNumber: "",
  question: "",
  answer: "",
  birth: "",
  phoneNumber: "",
  major: "",
  room: "",
  email: "",
});
// 교수 선택시 -> 연구실 입력
const isStudent = ref(true);
const isProfessor = ref(false);
const isAdmin = ref(false);
watch(formData, () => {
  if (formData.userType === "professor") {
    isProfessor.value = true;
    isStudent.value = true;
    isAdmin.value = false;
  } else if (formData.userType === "admin") {
    isAdmin.value = true;
    isProfessor.value = false;
    isStudent.value = false;
  } else {
    isAdmin.value = false;
    isProfessor.value = false;
  }
});
// submit 후 홈으로 리다이렉트
const router = useRouter();
function redirection() {
  formRef.value.reset();
  router.push({ name: "Login" });
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

// 중복된 계정인지 post요청 후 응답
async function duplicationCheck() {
  const { postData } = usePostAxios("/api/login/signup", formData);
  const response = await postData();
  if (response.status == 200) return true;
  else return false;
}
// submit전에 해야하는 동작
const submitHandler = async () => {
  const bothCheck =
    intCheck(formData.phoneNumber) && intCheck(formData.userNumber);
  if (!sameCheck()) {
    alert("비밀번호 동일 여부를 확인해주세요!");
  } else if (!bothCheck) {
    alert("학번과 전화번호에는 숫자만 입력가능합니다!");
  } else if (isAdmin.value) {
    if (formData.adminNumber != 1111) {
      alert("관리자 인증번호가 일치하지 않습니다!");
    }
  } else {
    const response = await duplicationCheck();
    if (response === true) {
      alert("회원가입 완료!");
      redirection();
    } else {
      alert("이미 가입된 회원입니다!");
    }
  }
};
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
  width: 30%;
  color: var(--main-color);
  font-weight: bold;
}

.btn:hover {
  background-color: var(--main2-color);
  color: rgba(231, 70, 70, 0.9);
}
</style>
