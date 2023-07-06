<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>수강신청</h4>
        <select id="select" v-model="yearSemester" style="margin-top: 5px">
          <option value="2023/2" selected>2023학년도 2학기</option>
        </select>
      </template>
      <template v-slot:content>
        <table>
          <thead>
            <th scope="col">학정번호</th>
            <th scope="col">과목명</th>
            <th scope="col">이수</th>
            <th scope="col">학점</th>
            <th scope="col">담당교수</th>
            <th scope="col">수강인원</th>
            <th scope="col">강의시간</th>
            <th scope="col">강의실</th>
          </thead>
          <tbody>
            <tr
              v-for="course of courses"
              :key="course.subject_id"
              @click="applySubject(course)"
            >
              <td>{{ course.subject_id }}</td>
              <td>{{ course.subject_name }}</td>
              <td>{{ course.subject_type }}</td>
              <td>{{ course.subject_grade }}</td>
              <td>{{ course.professor.name }}</td>
              <td>{{ course.subject_capacity }}</td>
              <td>{{ course.subject_time }}</td>
              <td>{{ course.subject_room }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:pagination>
        <Pagination :path="currentPath" @update-courses="updateCourses" />
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { loginCheck, usePostAxios } from "@/composable";
import MainFooter from "@/layouts/MainFooter.vue";
import StudentHeader from "@/layouts/StudentHeader.vue";
import router from "@/router";
import store from "@/store";
import Background from "@/components/Background.vue";
import Pagination from "@/components/Pagination.vue";

//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/student/enrollment");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    isRendered.value = true;
  }
});

const currentPath = ref("/student/enrollment");
const isRendered = ref(false);
const courses = ref();
const yearSemester = ref("2023/2"); // 초기 값 설정

// updateCourses 이벤트 핸들러를 정의
const updateCourses = (newCourses) => {
  courses.value = newCourses;
};

async function applySubject(course) {
  const response = confirm("과목을 신청하시겠습니까?");
  if (response === true) {
    // post로 서버에 subject객체 전체를 보냄 -> 수강하는 과목 받기
    const { postData } = usePostAxios("/api/student/enrollment", course);
    const response = await postData();
    // 수강신청 성공했을 때
    if (response.status === 200) {
      // 여기서 수강과목 리스트 받기
      alert("수강신청에 성공했습니다!");
      const mySubject = response.data;
      store.dispatch("subjectInfo/setSubject", mySubject);
    } else if (response.status === 401) {
      alert("이미 수강신청한 과목입니다!");
    } else {
      alert("과목 시간이 중복됩니다!");
    }
  }
}

// const userData = computed(() => store.getters["userInfo/getUser"]);
// const subjectData = computed(() => store.getters["subjectInfo/getSubject"]);
</script>
<style scoped>
li {
  list-style: none;
}
table {
  width: 100%;
  border: 2px solid var(--main2-color);
}
thead {
  font-size: smaller;
  background-color: var(--main2-color);
}
tr {
  border-bottom: 2px solid var(--main2-color);
}
tr:hover {
  background-color: var(--main3-color);
}
tbody,
td,
tfoot,
th,
thead,
tr {
  padding: 7px;
}
Pagination {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
