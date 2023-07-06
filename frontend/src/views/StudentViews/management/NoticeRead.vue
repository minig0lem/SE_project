<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>강의 공지사항</h4>
      </template>
      <template v-slot:content>
        <div id="form-container">
          <div id="title-container">
            <div style="font-size: larger">
              {{ selectedPost.notice_title }}
            </div>
            <span>작성자: {{ selectedPost.professor.name }}</span>
            <span>조회수: {{ selectedPost.notice_views }}</span>
            <span>등록일: {{ formatDate(selectedPost.createdAt) }}</span>
          </div>
          <div id="file-container">파일: <a :href="`/api/student/subject/download/${selectedPost.file_id}`">{{ selectedPost.filename }}</a></div>
          <div id="content-container">
            {{ selectedPost.notice_description }}
          </div>
        </div>
        <button id="returnBtn">
          <router-link :to="`/student/subject/notice/${subjectId}/1`"
            >목록으로</router-link
          >
        </button>
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

//로그인 유무 받아오기
onMounted(async () => {
  const loggedIn = await loginCheck("/api/student/subject/notice");
  if (loggedIn === false) {
    alert("로그인 해야합니다!");
    router.push("/login");
  } else {
    const { getData } = useGetAxios(
      `/api/student/subject/notice_view/${postId.value}`
    );
    const response = await getData();
    if (response.status === 200) {
      selectedPost.value = response.data[0];
    } else {
      alert("게시물 조회 에러!");
      router.push(`/student/subject/notice/${subjectId.value}/1`);
    }
    isRendered.value = true;
  }
});

const router = useRouter();
const isRendered = ref(false);

// url에 포함된 params를 읽어오기
const route = useRoute();
const subjectId = computed(() => route.params.id);
const postId = computed(() => route.params.number);
const selectedPost = ref();

// notice_id에 해당하는 게시글 객체 얻기
function getPost(number) {
  const noticeList = computed(() => store.getters["noticeInfo/getNotice"]);

  const post = noticeList.value.find((notice) => notice.notice_id == number);
  return post;
}
// createdAt 출력 변경
const formatDate = (createdAt) => {
  const dateObj = new Date(createdAt);
  return dateObj.toLocaleString(); // Modify the format as desired
};
</script>

<style scoped>
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
#commentForm {
  display: flex;
  justify-content: center;
}
textarea {
  width: 40vw;
  border: 1px solid var(--main2-color);
  padding: 5px;
  margin-right: 3px;
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
#form-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
#title-container {
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
