import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginViews/LoginPage.vue";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login/findpw",
    name: "FindPW",
    component: () => import("../views/LoginViews/FindPassword"),
  },
  {
    path: "/login/signup",
    name: "SignUp",
    component: () => import("../views/LoginViews/NewJoin"),
  },
  {
    path: "/student/subject/notice/:id/:page",
    name: "공지사항 조회",
    component: () => import("../views/StudentViews/management/StudentNotice"),
  },
  {
    path: "/student/subject/notice/:id/:number/read",
    name: "공지사항 상세 페이지",
    component: () => import("../views/StudentViews/management/NoticeRead"),
  },
  {
    path: "/student/subject/qna/:id/:page",
    name: "강의 묻고 답하기",
    component: () => import("../views/StudentViews/management/StudentQnA"),
  },
  {
    path: "/student/subject/qna/:id/write",
    name: "강의 묻고 답하기 작성",
    component: () => import("../views/StudentViews/management/QnAWrite"),
  },
  {
    path: "/student/subject/qna/:id/:number/read",
    name: "강의 묻고 답하기 상세 페이지",
    component: () => import("../views/StudentViews/management/QnARead"),
  },
  {
    path: "/student/subject/syllabus/:id",
    name: "강의 계획서 조회",
    component: () => import("../views/StudentViews/management/StudentSyllabus"),
  },
  {
    path: "/student/studying/assignment/:id/:page",
    name: "과제 제출",
    component: () => import("../views/StudentViews/studying/StudentAssignment"),
  },
  {
    path: "/student/studying/assignment/:id/:number/read",
    name: "과제 상세 페이지",
    component: () => import("../views/StudentViews/studying/AssignmentRead"),
  },
  {
    path: "/student/studying/grade",
    name: "성적 조회",
    component: () => import("../views/StudentViews/studying/StudentGrade"),
  },
  {
    path: "/student/mypage/information",
    name: "내 정보 조회/수정",
    component: () =>
      import("../views/StudentViews/mypage/StudentInformation.vue"),
  },
  {
    path: "/student/mypage/friends",
    name: "친구 추가",
    component: () => import("../views/StudentViews/mypage/StudentFriends.vue"),
  },
  {
    path: "/student/enrollment/:page/:keyword?",
    name: "수강 신청",
    component: () =>
      import("../views/StudentViews/enrollment/StudentEnrollment"),
  },
  {
    path: "/student",
    name: "학생 메인화면",
    component: () => import("../views/StudentViews/StudentMain.vue"),
  },

  {
    path: "/professor",
    name: "교수 메인화면",
    component: () => import("../views/ProfessorViews/ProfessorMain"),
  },
  {
    path: "/professor/subject/notice/:id/:page",
    name: "교수 공지사항 조회",
    component: () =>
      import("../views/ProfessorViews/management/ProfessorNotice"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
