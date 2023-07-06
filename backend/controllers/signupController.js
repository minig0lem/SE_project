const express = require("express");
const model = require("../models");

//회원가입 함수
exports.Signup = async (req, res, next) => {
  let id = req.body.userNumber;
  let type = req.body.userType;
  //회원가입 유형: 학생
  if (type === "student") {
    let check = await model.students
      .findAll({ where: { student_id: id } })
      .catch((err) => console.log(err)); //학번 중복 체크
    if (check.length === 0) {
      //회원가입 성공
      let datas = {
        student_id: req.body.userNumber,
        pw: req.body.password,
        name: req.body.userName,
        email: req.body.email,
        birth: req.body.birth,
        major: req.body.major,
        pw_question: req.body.question,
        pw_answer: req.body.answer,
        phone_number: req.body.phoneNumber,
      };
      let result = await model.students
        .create(datas)
        .catch((err) => console.log(err));
      return res.sendStatus(200);
    } else {
      //중복된 학번 -> 회원가입 실패
      return res.sendStatus(400); //Bad request
    }
    //회원가입 유형: 교수
  } else if (type === "professor") {
    let check = await model.professors
      .findAll({ where: { professor_id: id } })
      .catch((err) => console.log(err)); //학번 중복 체크
    if (check.length === 0) {
      //회원가입 성공
      let datas = {
        professor_id: req.body.userNumber,
        pw: req.body.password,
        name: req.body.userName,
        room: req.body.room,
        email: req.body.email,
        birth: req.body.birth,
        major: req.body.major,
        pw_question: req.body.question,
        pw_answer: req.body.answer,
        phone_number: req.body.phoneNumber,
      };
      let result = await model.professors
        .create(datas)
        .catch((err) => {
          console.log(err);
          return res.sendStatus(400);
        });
      return res.sendStatus(200);
    } else {
      //중복된 학번 -> 회원가입 실패
      return res.sendStatus(400); //Bad request
    }
    //회원가입 유형: 관리자
  } else if (type === "admin") {
    //check = await model.admins.findAll({where: {student_id: id}}).catch((err) => console.log(err)); //학번 중복 체크
  } else {
    //일치하는 type 없음
    return res.sendStatus(400);
  }
};
