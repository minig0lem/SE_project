const express = require("express");
const model = require("../models");
const { Readable } = require("stream");

//과제 목록 조회 함수
exports.getAssignmentList = async (req, res, next) => {
  let studentId = req.session.loginId;
  let subjectId = req.params.subject_id;
  let page = req.params.page;
  let perPage = 10;
  //과제 마감 기한이 얼마 남지 않은 순서로 과제 목록 가져오기
  let assignments = await model.assign_register
    .findAll({
      where: { subject_id: subjectId },
      order: [["assign_due_date", "ASC"]],
      limit: perPage,
      offset: (page - 1) * perPage,
      include: [{ model: model.subjects }, { model: model.professors }],
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
  //삭제되지 않은 과제 리스트만 조회
  let assignmentList = assignments.filter(
    (assignment) => assignment.isDeleted === 0
  );
  let assign_submit_List = [];
  //사용자의 과제 제출 여부 확인
  for (let assignment of assignmentList) {
    let file_assignment = [];

    if(assignment.assign_register_file) {
        let fileId = assignment.assign_register_file;
        let file = await model.files.findOne({where: {file_id: fileId}}).catch((err) => console.log(err));
        let filename = file.file_name;
        file_assignment.push({...assignment.get(), file_id: fileId, filename: filename});
    } else {
        file_assignment.push(assignment.get());
    }
    let registerId = assignment.register_id;
    let submits = await model.assign_submit
      .findAll({
        where: { student_id: studentId, assign_id: registerId }
      }).catch((err) => console.log(err));
    //과제 제출 여부가 포함된 새로운 배열 생성
    if (submits.length !== 0) {
      //과제 삭제 여부 확인 
      for (let submit of submits) {
        let file_submit = [];
        if (submit.isDeleted === 0) {
            if(submit.submit_file) {
                let fileId = submit.submit_file;
                let file = await model.files.findOne({
                    where: {file_id: fileId}
                }).catch((err) => console.log(err));
                let filename = file.file_name;
                file_submit.push({...submit.get(), file_id: fileId, filename: filename});
            } else {
                file_submit.push(submit.get());
            }
            assign_submit_List.push({...file_assignment, submit: file_submit});
        }
      }
    } else {
      assign_submit_List.push(file_assignment);
    }
  }
  console.log(assign_submit_List);
  let result = await model.assign_register
    .findAll({
      where: { subject_id: subjectId },
    })
    .catch((err) => console.log(err));
  let count = result.length;
  let data = [assign_submit_List, count];
  return res.status(200).send(data);
};

//과제 제출 함수
exports.submitAssignment = async (req, res, next) => {
  let assignId = req.params.assign_id;
  let fileId = "";
  //업로드 파일이 있을 경우
  if (req.file) {
    let filedata = {
      file_name: decodeURIComponent(req.file.originalname),
      file_content: req.file.buffer,
      file_mimetype: req.file.mimetype,
    };

    let file = await model.files.create(filedata).catch((err) => {
      console.log(err);
      //파일 업로드 오류
      return res.sendStatus(400);
    });
    fileId = file.file_id;
  }

  let datas = {
    student_id: req.session.loginId,
    assign_id: assignId,
    submit_title: req.body.title,
    submit_description: req.body.description,
    submit_file: fileId === "" ? null : fileId,
  };

  let result = await model.assign_submit.create(datas).catch((err) => {
    console.log(err);
    //과제 제출 등록 오류
    return res.sendStatus(400);
  });
  //과제 제출 성공
  return res.sendStatus(200);
};

//제출한 과제 수정 함수
exports.updateAssignment = async (req, res, next) => {
    let submitId = req.params.submit_id;
    //업로드 파일이 있는 경우 파일 정보 업데이트
    if (req.file) {
        let filedata = {
            file_name: req.file.originalname,
            file_content: req.file.buffer,
            file_mimetype: req.file.mimetype,
        };

        let submit = await model.assign_submit
        .findOne({ where: { submit_id: submitId } })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(400);
        });
        let fileId = submit.file_id;
        let file = await model.files
        .update(filedata, { where: { file_id: fileId } })
        .catch((err) => console.log(err));
    }

    let datas = {
        submit_title: req.body.submit_title,
        submit_description: req.body.submit_description,
    };

    let result = await model.assign_submit
        .update(datas, { where: { submit_id: submitId } })
        .catch((err) => console.log(err));

    if (result.length !== 0) {
        //수정 성공
        return res.sendStatus(200);
    } else {
        //수정 실패
        return res.sendStatus(400);
    }
};

//제출한 과제 삭제 함수
exports.deleteAssignment = async (req, res, next) => {
    let submitId = req.params.submit_id;
    let submit = await model.assign_submit
        .findOne({ where: { submit_id: submitId } })
        .catch((err) => console.log(err));

    if (submit) {
        //삭제할 과제 가져오기 성공
        submit.isDeleted = 1;
        await submit.save();
        return res.sendStatus(200);
    } else {
        //삭제 실패
        return res.sendStatus(400);
    }
    };

//성적 조회 함수
exports.viewGrade = async (req, res, next) => {
    if (req.session.loginId) {
        let total_grade = 0;
        let avg_total_grade = 0;
        let avg_major_grade = 0;
        let avg_non_major_grade = 0;
        let sum_total_grade = 0;
        let sum_major_grade = 0;
        let sum_non_major_grade = 0;
        let total_count = 0;
        let major_count = 0;
        let non_major_count = 0;
        //해당 유저가 수강한 모든 수강 목록
        let enrollments = await model.enrollments
        .findAll({
            where: { student_id: req.session.loginId },
            include: { model: model.subjects },
        })
        .catch((err) => console.log(err));

        //현재까지의 총 수강 학점 계산
        for (let enrollment of enrollments) {
            //2023학년 2학기 신청 과목은 제외
            if (enrollment.year === 2023 && enrollment.semester === 2) {
                continue;
            } else {
                total_grade += enrollment.subject.subject_grade;
            }
        }
        //학기 당 평균 평점(총 평점, 전공 평점, 전공 외 평점) 계산
        let averageGrades = calculateGrade(enrollments);
        for (let averageGrade of averageGrades) {
            if(!isNaN(averageGrade.total_grade)) {
                sum_total_grade += Number(averageGrade.total_grade);
                total_count += 1;
            }
            if(!isNaN(averageGrade.major_grade)) {
                sum_major_grade += Number(averageGrade.major_grade);
                major_count += 1;
            }
            if(!isNaN(averageGrade.non_major_grade)) {
                sum_non_major_grade += Number(averageGrade.non_major_grade);
                non_major_count += 1;
            }
        }
        avg_total_grade = (sum_total_grade / total_count).toFixed(2);
        avg_major_grade = (sum_major_grade / major_count).toFixed(2);
        avg_non_major_grade = (sum_non_major_grade / non_major_count).toFixed(2); 
        let data = [enrollments, averageGrades, total_grade, avg_total_grade, avg_major_grade, avg_non_major_grade];
        return res.status(200).send(data);
    } else {
        //로그인 돼 있지 않음.
        return res.sendStatus(401);
    }
};

//성적 입력 페이지 들어갔을 때 학생 조회 함수
exports.getStudentList = async(req, res, next) => {
    let subjectId = req.params.subject_id;
    let data = await model.enrollments.findAll({
        where: {subject_id: subjectId},
        include: {model: model.students}
    }).catch((err) => {
        console.log(err);
        return res.sendStatus(400);
    });

    return res.status(200).send(data);
};

//성적 입력 함수
exports.inputGrade = async(req, res, next) => {
    let gradeDatas = req.body.data;
    for(let gradeData of gradeDatas) {
        let enrollmentId = gradeData.enrollment_id;
        let data = {
            grade: gradeData.grade
        };
        let result = await model.enrollments.update(data, {
            where: {enrollment_id: enrollmentId}
        }).catch((err) => {
            console.log(err);
            return res.sendStatus(400);
        });
    }
    return res.sendStatus(200);
}

//학기당 학점 계산하는 함수
function calculateGrade(enrollments) {
  let grades = [];
  let year_semesters = [];
  //학생이 수강한 연도와 학기 확인
  for (let enrollment of enrollments) {
    if (!year_semesters.includes(enrollment.year + "-" + enrollment.semester)) {
      year_semesters.push(enrollment.year + "-" + enrollment.semester);
    }
  }
  //해당하는 학기에 대한 성적 계산
  for (let year_semester of year_semesters) {
    let year = year_semester.split("-")[0];
    let semester = year_semester.split("-")[1];
    let total_grade = 0;
    let weight_grade = 0;
    let major_grade = 0;
    let non_major_grade = 0;
    let total_major_grade = 0;
    let total_non_major_grade = 0;
    //연도, 학기 기준으로 배열 필터링
    let filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.year == year && enrollment.semester == semester
    );
    //한 학기의 평균 과목 학점 계산 (총 평점, 전공 평점, 전공 외 평점)
    for (let filteredEnrollment of filteredEnrollments) {
      if (filteredEnrollment.grade) {
        total_grade += filteredEnrollment.subject.subject_grade;
        if (filteredEnrollment.grade === "A+") {
          weight_grade += 4.5 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 4.5 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 4.5 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "A0") {
          weight_grade += 4.0 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 4.0 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 4.0 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "B+") {
          weight_grade += 3.5 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 3.5 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 3.5 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "B0") {
          weight_grade += 3.0 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 3.0 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 3.0 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "C+") {
          weight_grade += 2.5 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 2.5 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 2.5 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "C0") {
          weight_grade += 2.0 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 2.0 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 2.0 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "D+") {
          weight_grade += 1.5 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 1.5 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 1.5 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "D0") {
          weight_grade += 1.0 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 1.0 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 1.0 * filteredEnrollment.subject.subject_grade;
          }
        } else if (filteredEnrollment.grade === "F") {
          weight_grade += 0 * filteredEnrollment.subject.subject_grade;
          if (filteredEnrollment.subject.subject_type[0] === "전") {
            total_major_grade += filteredEnrollment.subject.subject_grade;
            major_grade += 0 * filteredEnrollment.subject.subject_grade;
          } else {
            total_non_major_grade += filteredEnrollment.subject.subject_grade;
            non_major_grade += 0 * filteredEnrollment.subject.subject_grade;
          }
        }
      }
    }
    //총 학점, 전공 학점, 비전공 학점 계산
    let total_calculatedGrade = (weight_grade / total_grade).toFixed(2);
    let major_calculatedGrade = (major_grade / total_major_grade).toFixed(2);
    let non_major_calculatedGrade = (
      non_major_grade / total_non_major_grade
    ).toFixed(2);
    let gradeInfo = {
      year: year,
      semester: semester,
      total_grade: isNaN(total_calculatedGrade) ? '-': total_calculatedGrade,
      major_grade: isNaN(major_calculatedGrade)? '-' : major_calculatedGrade,
      non_major_grade: isNaN(non_major_calculatedGrade) ? '-': non_major_calculatedGrade,
    };
    grades.push(gradeInfo);
  }
  return grades;
}
