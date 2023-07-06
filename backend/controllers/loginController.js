const express = require("express");
const model = require("../models");

//로그인 체크 함수
exports.CheckLogin = async (req, res, next) => {
  if (req.session.loginId) {
      if(req.session.userType === 'student') {
          return res.sendStatus(200);
      } else if (req.session.userType === 'professor'){
          return res.sendStatus(201);
      }
  } else {
          return res.sendStatus(401); //로그아웃 상태
  }
};
//로그인 함수
exports.Login = async (req, res, next) => {
  let id = req.body.userNumber;
  let pw = req.body.password;
  let type = req.body.userType;
  let user = "";

  if (type === "student") {
    //학생인 경우
    user = await model.students
      .findOne({ where: { student_id: id, pw: pw } })
      .catch((err) => console.log(err));
    if (user) {
      let data = [];
      req.session.loginId = id;
      req.session.userType = type;
      let enrollments = await model.enrollments
        .findAll({
          where: { student_id: req.session.loginId },
          include: { model: model.subjects },
          order: [
            ["year", "DESC"],
            ["semester", "DESC"],
          ],
        })
        .catch((err) => console.log(err));

      for (let enrollment of enrollments) {
        let notice_count = 0;
        let not_submit_count = 0;
        //공지사항 개수
        let notices = await model.notices
          .findAll({
            where: { subject_id: enrollment.subject_id },
          })
          .catch((err) => console.log(err));
        notice_count = notices.length;

        let assignments = await model.assign_register
          .findAll({
            where: { subject_id: enrollment.subject_id },
          })
          .catch((err) => console.log(err));

        //미제출 과제 개수
        for (let assignment of assignments) {
          let submit_check = await model.assign_submit
            .findOne({
              where: { assign_id: assignment.register_id },
            })
            .catch((err) => console.log(err));

          if (!submit_check) {
            //과제 안 낸 경우
            not_submit_count += 1;
          }
        }
        data.push({
          ...enrollment.get(),
          notice_count: notice_count,
          not_submit_count: not_submit_count,
        });
      }
      return res.status(200).send(data);
    } else {
      return res.sendStatus(401);
    }
  } else if (type === "professor") {
    //교수인 경우
    user = await model.professors
      .findOne({ where: { professor_id: id, pw: pw } })
      .catch((err) => console.log(err));
    if (user) {
      req.session.loginId = id;
      req.session.userType = type;
      return res.sendStatus(201);
    } else {
      return res.sendStatus(401);
    }
  } else if (type === "admin") {
    user = await model.admins
      .findOne({
        where: { admin_id: id, pw: pw },
      })
      .catch((err) => console.log(err));
    if (user) {
      return res.status(202).send(user);
    } else {
      return res.sendStatus(400);
    }

  }
};

//로그아웃 함수
exports.Logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendStatus(401); //Unauthorized
    } else {
      // 로그아웃 성공
      req.session = null;
      return res.sendStatus(200);
    }
  });
};

//학생 메인 페이지 접속 시 필요한 정보 주는 함수
exports.getStudentPage = async (req, res, next) => {
  let data = [];
  if (req.session.loginId) {
    //로그인 상태
    let enrollments = await model.enrollments
      .findAll({
        where: { student_id: req.session.loginId },
        include: { model: model.subjects },
        order: [
          ["year", "DESC"],
          ["semester", "DESC"],
        ],
      })
      .catch((err) => console.log(err));

    for (let enrollment of enrollments) {
      let notice_count = 0;
      let not_submit_count = 0;
      //공지사항 개수
      let notices = await model.notices
        .findAll({
          where: { subject_id: enrollment.subject_id },
        })
        .catch((err) => console.log(err));
      notice_count = notices.length;
      let assignments = await model.assign_register
        .findAll({
          where: { subject_id: enrollment.subject_id },
        })
        .catch((err) => console.log(err));

      //미제출 과제 개수

      if(assignments.length !== 0){
        for (let assignment of assignments) {
            let submit_check = await model.assign_submit
              .findOne({
                where: { assign_id: assignment.register_id },
              })
              .catch((err) => console.log(err));

            if (!submit_check) {
              //과제 안 낸 경우
              not_submit_count += 1;
            }
          }

      }
      data.push({
        ...enrollment.get(),
        notice_count: notice_count,
        not_submit_count: not_submit_count,
      });
    }
    return res.status(200).send(data);
  } else {
    //로그아웃 상태
    return res.sendStatus(401);
  }
};

exports.getProfessorPage = async (req, res, next) => {
  if (req.session.loginId) {
    let user = await model.professors
      .findOne({
        where: { professor_id: req.session.loginId },
      })
      .catch((err) => console.log(err));

    let subjects = await model.subjects
      .findAll({
        where: { subject_professor: req.session.loginId },
      })
      .catch((err) => console.log(err));
    let data = [user, subjects];
    return res.status(200).send(data);
  } else {
    return res.sendStatus(400);
  }
};
