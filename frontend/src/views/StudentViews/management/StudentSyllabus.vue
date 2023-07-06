<template>
  <div class=".container" v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>강의 계획서 조회</h4>
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
        <table class="tg">
          <thead>
            <tr>
              <th class="tg-c3ow">교과목명</th>
              <th class="tg-c3ow">{{ syllabus.subject.subject_name }}</th>
              <th class="tg-c3ow">교과목 개요</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="tg-c3ow">학정번호</th>
              <td class="tg-c3ow">{{ syllabus.subject_id }}</td>
              <td class="tg-c3ow" rowspan="3">
                {{ syllabus.syllabus_outline }}
              </td>
            </tr>
            <tr>
              <th class="tg-c3ow">강의구성</th>
              <td class="tg-c3ow">
                {{ syllabus.subject.subject_grade }}
              </td>
            </tr>
            <tr>
              <th class="tg-c3ow">강의시간</th>
              <td class="tg-c3ow">
                {{ syllabus.subject.subject_time }}
              </td>
            </tr>
            <tr>
              <th class="tg-c3ow">담당교수</th>
              <td class="tg-c3ow">{{ syllabus.professor.name }}</td>
              <td class="tg-c3ow">학습목표 및 학습방법</td>
            </tr>
            <tr>
              <th class="tg-c3ow">연락처</th>
              <td class="tg-c3ow">{{ syllabus.professor.phone_number }}</td>
              <td class="tg-c3ow" rowspan="5">
                {{ syllabus.syllabus_details }}
              </td>
            </tr>
            <tr>
              <th class="tg-c3ow">이수구분</th>
              <td class="tg-c3ow">{{ syllabus.subject.subject_type }}</td>
            </tr>
            <tr>
              <th class="tg-c3ow">수강인원</th>
              <td class="tg-c3ow">{{ syllabus.subject.subject_capacity }}</td>
            </tr>
            <tr>
              <th class="tg-c3ow">이메일</th>
              <td class="tg-c3ow">{{ syllabus.professor.email }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch, onBeforeMount } from "vue";
import { loginCheck, useGetAxios } from "@/composable";
import MainFooter from "@/layouts/MainFooter.vue";
import StudentHeader from "@/layouts/StudentHeader.vue";
import Background from "@/components/Background.vue";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import NoserachPagination from "@/components/Noserach-Pagination.vue";

//로그인 유무 받아오기
onBeforeMount(async () => {
  const loggedIn = await loginCheck("/api/student/subject/qna");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    getArray();
    await getSyllabus();
    isRendered.value = true;
  }
});

const router = useRouter();
const isRendered = ref(false);
const subjectData = computed(() => store.getters["subjectInfo/getSubject"]);
// const yearSemester = ref(
//   `${subjectData.value[0].year}/${subjectData.value[0].semester}`
// );
const yearSemester = ref("2023/1");
const year = computed(() => yearSemester.value.split("/")[0]);
const semester = computed(() => yearSemester.value.split("/")[1]);

const filteredSubject = ref(); // 학기 선택 후, 그 학기의 과목배열
const route = useRoute();
const subjectId = computed(() => route.params.id);
// 옵션으로 선택한 과목
const selectedSubject = ref();

// syllabus 데이터 저장할 변수
const syllabus = ref();

// 서버에 요청해서 데이터 얻는 함수
async function getSyllabus() {
  const { getData } = useGetAxios(
    `/api/student/subject/syllabus/${subjectId.value}`
  );
  const response = await getData();
  if (response.status === 200) {
    console.log(response.data);
    syllabus.value = response.data;
  } else {
    alert("강의계획서 미등록");
    router.push("/student");
  }
}

// 그 학기에 해당하는 과목 배열 리턴해주는 함수
function getArray() {
  filteredSubject.value = subjectData.value.filter((course) => {
    return course.year == year.value && course.semester == semester.value;
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
    // 그 과목에 해당하는
    const selectedSubjectId = filteredSubject.value.find(
      (subject) => subject.subject.subject_name === newValue
    )?.subject.subject_id;
    if (selectedSubjectId) {
      subjectId.value = selectedSubjectId;
    }
  }
});
</script>

<style scoped>
.container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  text-align: center;
}

h1 {
  font-size: 15px;
  margin-bottom: 20px;
  text-align: left;
}

.tg {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 2px solid black;
}

.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow: hidden;
  padding: 9px 9px;
  word-break: normal;
}

.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  padding: 9px 9px;
  word-break: normal;
}

.tg .tg-c3ow {
  border-color: inherit;
  text-align: center;
  vertical-align: middle;
}
</style>
