const express = require("express");
const model = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

//수강 신청 함수
exports.enrollment = async (req, res, next) => {
    let subjectId = req.body.subject_id;
    let studentId = req.session.loginId;
    let subjectName = req.body.subject_name;

    //이미 수강한 과목인지 확인 (동일한 이름)
    let check_enrollments = await model.enrollments.findAll({
        where: {student_id: studentId},
        include: {model: model.subjects}
    }).catch((err) => console.log(err));


    for(let check_enrollment of check_enrollments) {
        if(check_enrollment.subject.subject_name === subjectName) {
          //이미 수강한 과목
          return res.sendStatus(401);
        }
    }

    //이미 수강한 과목인지 확인 (동일한 과목번호)
    let check = await model.enrollments
    .findOne({
      where: { student_id: studentId, subject_id: subjectId },
    })
    .catch((err) => console.log(err));

    if (check) {
      //이미 수강한 과목
      return res.sendStatus(401);
    } else {
      //처음 수강하는 과목
      //신청한 과목 시간 가져오기
      let subjectTime = req.body.subject_time;

      //학생이 수강 중인 과목의 시간 정보 가져오기
      let enrollments = await model.enrollments
        .findAll({
          where: { student_id: studentId, year: 2023, semester: 2},
          include: model.subjects,
        })
        .catch((err) => console.log(err));

      //신청한 과목 시간과 기존의 시간표와 겹치는지 확인
      for (let enrollment of enrollments) {
        let enrollmentTime = enrollment.subject.subject_time;
        if (checkTime(enrollmentTime, subjectTime) === true) {
          //수강 신청 실패 (시간 겹침)
          return res.sendStatus(400);
        }
      }

      let datas = {
        subject_id: subjectId,
        student_id: studentId,
        year: 2023,
        semester: 2,
      };
      //수강 테이블에 정보 입력
      let result = await model.enrollments
        .create(datas)
        .catch((err) => console.log(err));

      if (result.length !== 0) {
        //수강 신청 성공
        //로그인 유저의 변경된 수강 정보
        let data = await model.enrollments
          .findAll({
            where: { student_id: studentId },
            include: [
              {
                model: model.subjects,
                include: { model: model.professors },
              },
            ],
          })
          .catch((err) => console.log(err));
        return res.status(200).send(data);
      } else {
        //수강 신청 실패
        return res.sendStatus(400);
      }
    }
};

//수강 삭제 함수
exports.deleteEnrollment = async (req, res, next) => {
  let studentId = req.session.loginId;
  let subjectId = req.body.subject_id;
  let enrollment = await model.enrollments
    .findOne({ where: { student_id: studentId, subject_id: subjectId } })
    .catch((err) => console.log(err));

  let result = await model.enrollments
    .destroy({
      where: { enrollment_id: enrollment.enrollment_id },
    })
    .catch((err) => console.log(err));

  if (result.length !== 0) {
    //수강 삭제 성공
    //로그인 유저의 변경된 수강 정보
    let data = await model.enrollments
      .findAll({
        where: { student_id: studentId },
        include: [
          {
            model: model.subjects,
            include: { model: model.professors },
          },
        ],
      })
      .catch((err) => console.log(err));
    return res.status(200).send(data);
  } else {
    //수강 삭제 실패
    return res.sendStatus(400);
  }
};

//과목 목록 가져오는 함수
exports.getSubjectList = async (req, res, next) => {
  let page = req.params.page;
  let keyword = req.params.keyword;
  let perPage = 10;
  let result = "";
  let count = "";
  //page가 숫자가 아닌 경우
  if (isNaN(page)) {
    return res.sendStatus(400); //Bad request
  }

  if (keyword) {
    //검색어가 있는 경우
    result = await model.subjects
      .findAll({
        where: {
          subject_name: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        order: [["subject_id", "ASC"]],
        limit: perPage,
        offset: (page - 1) * perPage,
        include: { model: model.professors },
      })
      .catch((err) => console.log(err));
    //검색한 결과 총 개수
    count = result.length;
  } else {
    //과목이름 오름차순 정렬
    result = await model.subjects
      .findAll({
        order: [["subject_id", "ASC"]],
        limit: perPage,
        offset: (page - 1) * perPage,
        include: { model: model.professors },
      })
      .catch((err) => console.log(err));
    //과목 전체 개수
    count = await model.subjects.count();
  }
  if (result.length !== 0) {
    //과목 가져오기 성공
    let data = [result, count];
    return res.status(200).send(data);
  } else {
    //과목 가져오기 실패
    return res.sendStatus(404); //Not Found
  }
};

//수강 신청 시 겹치는 시간이 있는지 확인하는 함수
function checkTime(existingTime, newTime) {
  let existing_time = [];
  let new_time = [];
  let duplication = false;
  //ex) 월1,7,8/수2 => 월1,7,8  수2 로 /를 기준으로 split 하는 작업
  let split_existingTime = existingTime.split("/");
  let split_newTime = newTime.split("/");
  //기존 수강 시간 변환
  //ex) 월1,7,8 => 월1, 월7, 월8 로 변환하는 작업
  for (let i = 0; i < split_existingTime.length; i++) {
    let day = split_existingTime[i][0];
    for (let j = 0; j < split_existingTime[i].length; j++) {
      if (!isNaN(split_existingTime[i][j])) {
        //숫자인 경우
        existing_time.push(day + split_existingTime[i][j]);
      }
    }
  }
  //새롭게 신청한 수강 시간 변환
  //ex) 월1,7,8 => 월1, 월7, 월8 로 변환하는 작업
  for (let i = 0; i < split_newTime.length; i++) {
    let day = split_newTime[i][0];
    for (let j = 0; j < split_newTime[i].length; j++) {
      if (!isNaN(split_newTime[i][j])) {
        //숫자인 경우
        new_time.push(day + split_newTime[i][j]);
      }
    }
  }
  //수강 시간이 중복되는지 비교
  for (let i = 0; i < existing_time.length; i++) {
    if (new_time.includes(existing_time[i])) {
      //중복되는 경우
      duplication = true;
      break;
    }
  }

  return duplication;
}
