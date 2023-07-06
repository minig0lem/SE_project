<template>
  <div id="flex-container">
    <nav aria-label="Page navigation example">
      <ul class="pagination pagination-sm">
        <li class="page-item">
          <router-link
            :to="getLink(currentPage - 1)"
            class="page-link"
            @click="prevPage"
            :class="{ 'disabled-link': currentPage === 1 }"
            >이전으로</router-link
          >
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page">
          <router-link
            :to="getLink(page)"
            @click="movePage(page)"
            class="page-link"
          >
            {{ page }}
          </router-link>
        </li>
        <li class="page-item">
          <router-link
            :to="getLink(currentPage + 1)"
            class="page-link"
            @click="nextPage"
            :class="{ 'disabled-link': currentPage === totalPages }"
            >다음으로</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  defineProps,
  defineEmits,
  toRef,
  watch,
} from "vue";
import { useGetAxios } from "@/composable";
import { useRouter } from "vue-router";
const currentPage = ref(1);
const perPage = 10; // Number of courses per page
const lists = ref([]);
const totalPages = ref(0);
const totalLists = ref(0);
const router = useRouter();
// 부모로 부터 받은 경로 설정
const props = defineProps({
  path: String,
  subject_id: String,
});
// 넘어온 원본 경로
const currentPath = toRef(props, "path");
// 넘어온 과목 Id
const subjectId = toRef(props, "subject_id");
// axios요청 할 서버 경로
const serverPath = "/api" + currentPath.value;
// 부모에게 보낼 게시물 리스트 정보
const emits = defineEmits(["update-lists"]);

watch(subjectId, async (newId) => {
  if (newId) {
    subjectId.value = newId;
    await getLists();
    calculateTotalPages(totalLists.value); // 게시물 총 개수 / 10 = page개수
    router.push(`${currentPath.value}/${subjectId.value}/1`);
  }
});

// 페이지 로드될 때, 초기 실행 함수
onBeforeMount(async () => {
  // 초기 게시물 목록과 페이지 개수 설정
  await getLists();
  calculateTotalPages(totalLists.value); // 게시물 총 개수 / 10 = page개수
});

// 페이지에 해당하는 강의목록 받아오기
const getLists = async () => {
  // 페이지별 get요청

  const { getData } = useGetAxios(
    `${serverPath}/${subjectId.value}/${currentPage.value}`
  );
  const response = await getData();
  // 경로 제대로 받아올 때
  if (response.status === 200) {
    lists.value = response.data[0];
    // 부모에게 게시물 리스트 전송
    totalLists.value = response.data[1];
    emits("update-lists", lists.value);
  } else {
    alert("일치하는 검색결과가 없습니다!");
  }
};

// 동적 경로 설정 함수
const getLink = (page) => {
  return `${currentPath.value}/${subjectId.value}/${page}`;
};

// 전체 페이지 수 계산을 위한 함수
const calculateTotalPages = (totalLists) => {
  totalPages.value = Math.ceil(totalLists / perPage);
};

// 이전으로 클릭 시 실행 함수
const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await getLists();
  }
};
// 숫자 페이지 클릭 시 실행 함수
const movePage = async (page) => {
  if (page > 0 && page < totalPages.value + 1) {
    currentPage.value = page;
    await getLists();
  }
};
// 다음으로 클릭 시 실행 함수
const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await getLists();
  }
};
</script>

<style scoped>
a {
  color: var(--main-color);
}
a:hover {
  opacity: 0.8;
  color: var(--main-color);
}
.disabled-link {
  color: gray;
  cursor: default;
  pointer-events: none;
}
.page-link:focus,
.page-link:active {
  box-shadow: none;
  color: var(--main-color);
}
#flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
