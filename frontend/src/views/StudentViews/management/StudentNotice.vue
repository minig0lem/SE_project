<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>강의 공지사항</h4>
        <select id="select" v-model="yearSemester" style="margin-right: 10px">
          <option value="2023/2">2023학년도 2학기</option>
          <option value="2023/1" selected>2023학년도 1학기</option>
          <option value="2022/2">2022학년도 2학기</option>
          <option value="2022/1">2022학년도 1학기</option>
          <option value="2021/2">2021학년도 2학기</option>
          <option value="2021/1">2021학년도 1학기</option>
          <option value="2020/2">2020학년도 2학기</option>
          <option value="2020/1">2020학년도 1학기</option>
        </select>
        <select class="select" v-model="selectedSubject">
          <option v-for="(subject, index) of filteredSubject" :key="index">
            {{ subject.subject.subject_name }}
          </option>
        </select>
      </template>
      <template v-slot:content>
        <div>
          <table>
            <thead>
              <th scope="col" style="width: 10%">번호</th>
              <th scope="col">제목</th>
              <th scope="col">작성자</th>
              <th scope="col">작성일</th>
              <th scope="col">조회수</th>
            </thead>
            <tbody>
              <tr v-for="(notice, index) of noticeList" :key="index">
                <td>{{ noticeList.length - index }}</td>
                <td>
                  <router-link
                    :to="`/student/subject/notice/${subjectId}/${notice.notice_id}/read`"
                  >
                    {{ notice.notice_title }}</router-link
                  >
                </td>
                <td>{{ notice.professor.name }}</td>
                <td>{{ formatDate(notice.createdAt) }}</td>
                <td>{{ notice.notice_views }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:pagination>
        <NoserachPagination
          :path="currentPath"
          :subject_id="subjectId"
          @update-lists="updateLists"
        />
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onBeforeMount, computed, ref, watch } from "vue";
import { loginCheck, useGetAxios } from "@/composable";
import MainFooter from "@/layouts/MainFooter.vue";
import StudentHeader from "@/layouts/StudentHeader.vue";
import Background from "@/components/Background.vue";
import store from "@/store";
import { useRouter } from "vue-router";
import NoserachPagination from "@/components/Noserach-Pagination.vue";
NoserachPagination;

//로그인 유무 받아오기
onBeforeMount(async () => {
  const loggedIn = await loginCheck("/api/student/subject/notice");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    getArray();
    isRendered.value = true;
  }
});

const router = useRouter();
const isRendered = ref(false);
const currentPath = ref("/student/subject/notice");
const noticeList = ref();
const subjectData = computed(() => store.getters["subjectInfo/getSubject"]);
// 학기 선택
const yearSemester = ref(
  `${subjectData.value[0].year}/${subjectData.value[0].semester}`
);
const year = yearSemester.value.split("/")[0];
const semester = yearSemester.value.split("/")[1];
const filteredSubject = ref(); // 학기 선택 후, 그 학기의 과목배열
const subjectId = ref();

// updateLists 이벤트 핸들러를 정의
const updateLists = (newList) => {
  noticeList.value = newList;
  // store.dispatch("noticeInfo/setNotice", noticeList.value);
};
// 옵션으로 선택한 과목
const selectedSubject = ref();

// 그 학기에 해당하는 과목 배열 리턴해주는 함수
function getArray() {
  filteredSubject.value = subjectData.value.filter((course) => {
    return course.year == year && course.semester == semester;
  });
  selectedSubject.value = filteredSubject.value[0].subject.subject_name;
}
// 학기 선택하고, 그 학기의 과목배열 얻기
watch(yearSemester, (newValue) => {
  const year = newValue.split("/")[0];
  const semester = newValue.split("/")[1];
  // 학기가 바뀌었을 때, 그 학기에 해당하는 과목만 subjectData에서 추출하고 filteredSubject에 저장.
  if (newValue) {
    filteredSubject.value = subjectData.value.filter((course) => {
      return course.year == year && course.semester == semester;
    });
    selectedSubject.value = filteredSubject.value[0].subject.subject_name;
  } else {
    alert("학기 변경 에러!");
  }
});

// 과목 선택 시 실행되는 함수
watch(selectedSubject, (newValue) => {
  if (newValue) {
    // Access the selected subject's subject_id
    const selectedSubjectId = subjectData.value.find(
      (subject) => subject.subject.subject_name === newValue
    )?.subject.subject_id;
    if (selectedSubjectId) {
      subjectId.value = selectedSubjectId;
    }
  }
});
// createdAt 출력 변경
const formatDate = (createdAt) => {
  const dateObj = new Date(createdAt);
  return dateObj.toLocaleString(); // Modify the format as desired
};
</script>

<style scoped>
#writeBtn {
  float: right;
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
}
a {
  text-decoration: none;
  color: var(--main-color);
}
li {
  list-style: none;
}
table {
  width: 100%;
  border: 2px solid var(--main2-color);
  table-layout: fixed;
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
h4 {
  margin-bottom: 10px;
}
NoserachPagination {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
