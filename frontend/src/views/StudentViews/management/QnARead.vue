<template>
  <div v-if="isRendered">
    <StudentHeader />
    <Background>
      <template v-slot:title>
        <h4>강의묻고 답하기</h4>
      </template>
      <template v-slot:content>
        <div id="form-container">
          <button type="button" id="deleteBtn" @click.prevent="deleteQnA">
            삭제
          </button>
          <div id="title-container">
            <div style="font-size: larger">
              {{ selectedPost.QnA_title }}
            </div>
            <span>작성자: {{ selectedPost.student.name }}</span>
            <span>등록일: {{ formatDate(selectedPost.createdAt) }}</span>
          </div>
          <div id="content-container">
            {{ selectedPost.QnA_description }}
          </div>
        </div>
      </template>
      <template v-slot:pagination>
        <div id="comment-container">
          <div id="exist-comment">
            <!-- <div v-for="comment in comments" :key="comment.id">
              <h3>{{ comment.name }}</h3>
              <p>{{ comment.content }}</p>
              <hr />
            </div> -->
          </div>
          <div id="new-comment">
            <form id="commentForm" method="post" action="">
              <textarea
                id="commentInput"
                placeholder="댓글을 작성하세요"
                v-model="newComment"
                required
              ></textarea>
              <button type="submit" id="submitBtn">등록</button>
            </form>
          </div>
        </div>
        <button id="returnBtn">
          <router-link :to="`/student/subject/qna/${subjectId}/1`"
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
  const loggedIn = await loginCheck("/api/student/subject/qna");
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
// 댓글 관련 변수
const comments = ref([]);
const newComment = ref("");
// url에 포함된 params를 읽어오기
const route = useRoute();
const subjectId = computed(() => route.params.id);
const postId = computed(() => route.params.number);
const selectedPost = ref();

// QnA_id에 해당하는 게시글 객체 얻기
function getPost(number) {
  const qnaList = computed(() => store.getters["qnaInfo/getQna"]);
  const post = qnaList.value.find((qna) => qna.QnA_id == number);
  return post;
}

// 게시물 삭제 버튼 함수
async function deleteQnA() {
  const qnaId = { QnA_id: null };
  qnaId.QnA_id = postId.value;
  const answer = confirm("게시물을 삭제하겠습니까?");
  if (answer) {
    const { postData } = usePostAxios(
      `/api/student/subject/qna/${subjectId.value}/delete`,
      qnaId
    );
    const response = await postData();
    if (response.status === 200) {
      alert("게시물이 삭제되었습니다!");
      router.push(`/student/subject/qna/${subjectId.value}/1`);
    } else {
      alert("게시물 삭제 에러!");
    }
  }
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
#returnBtn {
  float: right;
  border: 1px solid var(--main2-color);
  background-color: var(--main3-color);
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
span {
  font-size: small;
  font-weight: lighter;
  margin: 5px 10px 5px 0px;
}
</style>
