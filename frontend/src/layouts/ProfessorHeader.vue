<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <router-link to="/professor" class="navbar-brand" id="title"
        >KW학사관리</router-link
      >
      <ul>
        <li>
          <button><router-link to="/professor">메인 화면</router-link></button>
        </li>
        <li>
          <button>강의 종합 정보</button>
          <ul>
            <li>
              <router-link
                :to="`/professor/subject/notice/${subjectData[0].subject_id}/1`"
                >공지사항 관리</router-link
              >
            </li>
            <li>
              <router-link
                :to="`/professor/subject/syllabus/${subjectData[0].subject_id}/1`"
                >강의계획서 관리</router-link
              >
            </li>
            <li>
              <router-link
                :to="`/professor/subject/qna/${subjectData[0].subject_id}/1`"
                >강의 묻고 답하기</router-link
              >
            </li>
          </ul>
        </li>
        <li>
          <button>성적 관리</button>
          <ul>
            <li>
              <router-link
                :to="`/professor/studying/grade/${subjectData[0].subject_id}`"
                >성적 입력/수정</router-link
              >
            </li>
          </ul>
        </li>
        <li>
          <button>
            <router-link to="/professor/mypage/information"
              >마이페이지</router-link
            >
          </button>
        </li>
      </ul>
      <button
        type="button"
        @click="confirmLogout"
        id="logout"
        style="
          color: white;
          font-size: small;
          font-weight: 300;
          margin-right: 10px;
          margin-bottom: 20px;
        "
      >
        Logout ->
      </button>
    </div>
  </nav>
</template>

<script setup>
import { defineExpose, computed } from "vue";
import { useRouter } from "vue-router";
import { usePostAxios } from "@/composable";
import store from "@/store";
const router = useRouter();

const subjectData = computed(() => store.getters["subjectInfo/getSubject"]);
// 로그아웃 버튼 클릭 시 실행 함수
async function confirmLogout() {
  if (confirm("로그아웃 하시겠습니까?")) {
    const { postData } = usePostAxios("/api/login/logout");
    const response = await postData();
    if (response.status === 200) {
      logout(); // vuex초기화
      router.push("/login");
    } else {
      alert("로그아웃 에러!!");
    }
  }
}
const logout = () => {
  // Clear user information from the Vuex store
  store.dispatch("userInfo/setUser", null);
  // store.dispatch("subjectInfo/setSubject", null);
  store.dispatch("qnaInfo/setQna", null);
  store.dispatch("noticeInfo/setNotice", null);
  store.dispatch("assignmentInfo/setAssignment", null);
  localStorage.removeItem("vuex");
};
defineExpose({ router });
</script>

<style scoped>
nav button {
  border: none;
  outline: none;
  cursor: pointer;
  background-color: rgba(250, 152, 132, 0.6);
  color: var(--main-color);
  border-radius: 5px;
  padding: 3px 25px;
  font-size: 1rem;
}

ul {
  display: flex;
  justify-content: space-between;
}
#title {
  font-size: xx-large;
  font-weight: bold;
  color: var(--main-color);
  border: 2px solid var(--main-color);
  padding: 2px 5px;
  margin-top: 10px;
  cursor: pointer;
}
nav li {
  margin-right: 3rem;
  position: relative;
}

nav a {
  display: block;
  text-decoration: none;
  color: var(--main-color);
}
nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
nav ul ul {
  display: none;
  position: absolute;
  top: 100%;
  left: -10%;
  background-color: rgb(255, 185, 171);
  padding: 10px;
  box-shadow: blur spread;
  width: 120%;
  font-size: 1rem;
}
nav ul ul li {
  margin: 10px 0px;
  padding: 0px;
}
nav ul li:hover > ul {
  display: block;
  border-radius: 5px;
}
nav ul ul li a:hover {
  font-weight: bold;
}
#logout {
  padding: 1px;
  width: 80px;
  height: 30px;
  color: yello;
  font-weight: bold;
  cursor: pointer;
}
</style>
