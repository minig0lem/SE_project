<template>
  <router-view></router-view>
  <div class="container">
    <div class="col-flex">
      <div id="title" class="font">학사관리 시스템</div>
      <div class="col-md-6">
        <form action="/api/login" method="post" ref="formRef">
          <div class="form-group">
            <label for="userNumber"></label>
            <input
              type="text"
              class="form-control"
              id="userNumber"
              name="userNumber"
              placeholder="이용자 번호를 입력하세요"
              required
              v-model="loginData.userNumber"
            />
          </div>
          <div class="form-group">
            <label for="password"></label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              required
              v-model="loginData.password"
            />
          </div>
          <router-link to="/login/findpw" id="forgot"
            >Forgot your password?</router-link
          >
          <div class="row-flex">
            <button
              type="button"
              ref="studentButton"
              @click="setUserType('student')"
              class="btn for-btn font"
            >
              For student
            </button>
            <button
              type="button"
              ref="professorButton"
              @click="setUserType('professor')"
              class="btn for-btn font"
            >
              For professor
            </button>
            <button
              type="button"
              ref="adminButton"
              @click="setUserType('admin')"
              class="btn for-btn font"
            >
              For admin
            </button>
            <input type="hidden" name="userType" :value="loginData.userType" />
          </div>
          <button
            type="submit"
            ref="loginButton"
            class="btn lgn-btn font"
            @click.prevent="loginSubmit"
          >
            Login
          </button>
        </form>
        <router-link to="/login/signup" style="color: var(--brown1)"
          >New to us? Join now!</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { usePostAxios, loginCheck } from "@/composable";
import { useRouter } from "vue-router";
import store from "@/store";

// 로그인 시 필요한 입력 값
const loginData = reactive({
  userNumber: "",
  password: "",
  userType: "",
});
const formRef = ref(null);
const studentButton = ref(null);
const professorButton = ref(null);
const adminButton = ref(null);
const loginButton = ref(null);
// 유저 타입 Setter
let setUserType = (type) => {
  if (loginData.userType === type) {
    // 이미 선택된 유형인 경우 선택 해제
    loginData.userType = "";
    studentButton.value.blur();
    professorButton.value.blur();
    adminButton.value.blur();
  } else {
    // 선택되지 않은 유형인 경우 선택
    loginData.userType = type;
  }
};

// 입력 값 초기화 후 메인페이지 이동
const router = useRouter();
function redirection(path) {
  formRef.value.reset();
  router.push(path);
}

// 로그인 양식 제출
async function loginSubmit() {
  if (loginData.userType === "") {
    alert("로그인 유형을 선택하세요!!");
    loginButton.value.blur();
  } else {
    const { postData } = usePostAxios("/api/login", loginData);
    const response = await postData();
    if (response.status == 200) {
        // 학생로그인 성공 시
        const subjectData = response.data;
        store.dispatch("subjectInfo/setSubject", subjectData); // 과목정보
        redirection("/student");
    } else if (response.status == 201) {
        redirection("/professor");
    } else if (response.status == 202) {
        redirection("/admin");
    } else {
        loginData.userType = "";
        loginButton.value.blur();
        alert("존재하지 않는 계정입니다!");
    }
  }
}
//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/login");
  if (loggedIn === true) {
    alert("학생 로그인 되어있습니다!");
    router.push("/student");
  } else if (loggedIn === false) {
    alert("교수 로그인 되어있습니다!");
    router.push("/professor");
  } else {
    router.push("/login");
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Noto+Sans+KR:wght@300;400&display=swap");
#title {
  font-weight: 700;
  font-size: 80px;
  color: var(--main-color);
  margin-bottom: 20px;
}
.container {
  position: relative;
  top: 20vh;
}
.col-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.row-flex {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 20px;
}
input {
  border-color: #fa9884;
  width: 80%;
  margin: 0 auto;
}
#forgot {
  margin-right: 50%;
  margin-bottom: 50px;
  color: var(--brown1);
}

.btn {
  background-color: rgba(250, 152, 133, 0.3);
  width: 25%;
  color: var(--main-color);
  font-weight: bold;
}

.btn:hover {
  background-color: #fa9884;
  transition: background-color 0.5s;
  color: var(--main-color);
}

.btn:focus {
  background-color: #fa9884;
  color: var(--main3-color);
}

.lgn-btn {
  margin-top: 30px;
  border-radius: 30px;
  margin-bottom: 10px;
  width: 50%;
}
</style>
