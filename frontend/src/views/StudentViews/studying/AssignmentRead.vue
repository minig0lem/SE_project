<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>과제 제출</h4>
      </template>
      <template v-slot:content>
        <div id="form-container">
          <p
            style="
              color: var(--main-color);
              font-size: large;
              font-weight: bold;
            "
          >
            출제 과제 정보
          </p>
          <div class="title-container">
            <div style="font-size: larger">
              {{ selectedPost[0].assign_title }}
            </div>
            <span>작성자: {{ selectedPost[0].professor.name }}</span>
            <span>등록일: {{ formatDate(selectedPost[0].createdAt) }}</span>

            <span
              >마감일: {{ formatDate(selectedPost[0].assign_due_date) }}</span
            >
            <span>상태: {{ selectedPost.submit ? "제출" : "미제출" }}</span>
          </div>
          <div id="file-container">
            파일:
            <a
              :href="`/api/student/subject/download/${selectedPost[0].file_id}`"
            >
              {{ selectedPost[0].filename }}</a
            >
          </div>
          <div id="content-container">
            {{ selectedPost[0].assign_description }}
          </div>
        </div>

        <div class="form-container" v-if="!isSubmit">
          <form
            @submit.prevent="submitHandler"
            method="post"
            enctype="multipart/form-data"
          >
            <p
              style="
                color: var(--main-color);
                font-size: large;
                font-weight: bold;
              "
            >
              과제 제출란
            </p>
            <div class="mb-3 input-container">
              <label class="form-label">과제 제목</label>
              <input
                type="text"
                name="title"
                class="form-control"
                v-model="writeData.title"
                placeholder="제목을 입력하세요"
                required
              />
            </div>
            <div class="mb-3 input-container">
              <label class="form-label">파일 제출</label>

              <input type="file" class="form-control" ref="fileInput" />
            </div>
            <div class="mb-3 input-container">
              <label class="form-label">과제 내용</label>
              <textarea
                class="form-control"
                rows="10"
                required
                name="description"
                v-model="writeData.description"
              ></textarea>
            </div>
            <button type="submit" id="writeBtn">제출</button>
          </form>
          <button type="button" id="returnBtn">
            <router-link :to="`/student/studying/assignment/${subjectId}/1`"
              >목록으로</router-link
            >
          </button>
        </div>

        <div v-if="isSubmit">
          <p
            style="
              color: var(--main-color);
              font-size: large;
              font-weight: bold;
            "
          >
            제출한 과제 정보
          </p>
          <table style="width: 100%; border: 1px solid black">
            <colgroup>
              <col style="width: 30%" />
            </colgroup>
            <tbody>
              <tr>
                <th>제목</th>
                <td>{{ find.submit[0].submit_title }}</td>
              </tr>
              <tr>
                <th>파일</th>
                <td>
                  <a
                    :href="`/api/student/subject/download/${find.submit[0].file_id}`"
                  >
                    {{ find.submit[0].filename }}</a
                  >
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>{{ find.submit[0].submit_description }}</td>
              </tr>
            </tbody>
          </table>
          <button type="button" id="returnBtn">
            <router-link :to="`/student/studying/assignment/${subjectId}/1`"
              >목록으로</router-link
            >
          </button>
        </div>
      </template>
    </Background>
    <MainFooter />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive, watch } from "vue";

import { loginCheck, useGetAxios, usePostAxios } from "@/composable";
import MainFooter from "@/layouts/MainFooter.vue";
import StudentHeader from "@/layouts/StudentHeader.vue";
import Background from "@/components/Background.vue";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/student/studying/assignment");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    selectedPost.value = getPost(postId.value);
    isRendered.value = true;
  }
});

const router = useRouter();
const isRendered = ref(false);
const fileInput = ref(null);
// url에 포함된 params를 읽어오기
const route = useRoute();
const subjectId = computed(() => route.params.id);
const postId = computed(() => route.params.number);
const selectedPost = ref(getPost(postId.value));
// 선택된 게시물의 assign_id
const register_id = computed(() => selectedPost.value[0].register_id);

// 과제제출 시 필요한 입력 값
const writeData = reactive({
  title: "",
  description: "",
});

// 과제 제출 여부
const isSubmit = ref(false);
const assignments = computed(() => {
  return store.getters["assignmentInfo/getAssignment"];
});
const find = assignments.value.find(
  (obj) => obj[0].register_id === register_id.value
);
if (find.submit !== undefined) {
  isSubmit.value = true;
}

const submitHandler = async () => {
  const formData = new FormData();
  formData.append("title", writeData.title);
  formData.append("description", writeData.description);
  if (fileInput.value.files.length > 0) {
    formData.append(
      "file",
      fileInput.value.files[0],
      encodeURIComponent(fileInput.value.files[0].name)
    );
  }

  const { postData } = usePostAxios(
    `/api/student/studying/assignment/${register_id.value}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const response = await postData();
  if (response.status === 200) {
    router.push(`/student/studying/assignment/${subjectId.value}/1`);
  } else {
    alert("게시물 등록 에러!");
  }
};
// register_id에 해당하는 게시글 객체 얻기
function getPost(number) {
  const assignmentList = computed(
    () => store.getters["assignmentInfo/getAssignment"]
  );
  const post = assignmentList.value.find(
    (assignment) => assignment[0].register_id == number
  );
  return post;
}

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
#deleteBtn {
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
  color: var(--main-color);
  width: 5%;
  align-self: end;
  margin: 5px;
}
#submitBtn {
  float: right;
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
  color: var(--main-color);
}
#submitBtn {
  width: 10%;
}
#comment-container {
  width: 100%;
  padding: 10px;
}
#comment {
  border: 0.5px solid black;
  border-collapse: collapse;
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
#comment span {
  border-collapse: collapse;
  margin: 0;
  font-size: medium;
  color: black;
}
button {
  margin: 5px;
}

tr,
td {
  border: 1px solid black;
  height: 5vh;
}

#commentForm {
  display: flex;
  justify-content: center;
}
textarea {
  width: 100%;
  border: 1px solid var(--main2-color);
  padding: 5px;
}
a {
  text-decoration: none;
  color: var(--main-color);
}
#returnBtn {
  float: right;
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
}
.form-control {
  border: 1px solid var(--main2-color);
}
#form-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.title-container {
  background-color: var(--main3-color);
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  padding: 10px;
}
#content-container {
  height: 30vh;
  text-align: left;
  line-height: 1.8rem;
  border-bottom: 1px solid black;
  padding: 10px;
}
#file-container {
  text-align: left;
  border-bottom: 1px solid black;
  padding: 5px;
}
span {
  font-size: small;
  font-weight: lighter;
  margin: 5px 10px 5px 0px;
}
</style>
