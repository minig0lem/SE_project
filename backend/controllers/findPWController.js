const express = require('express');
const model = require('../models');

//학번 체크 함수
exports.CheckId = async (req, res, next) => {
    let name = req.body.name;
    let id = req.body.userNumber;
  id_check = await model.students.findAll({ where: { name: name, student_id: id } }).catch((err) => console.log(err)); //학번 체크
  if (id_check.length !== 0) {
    //학번 일치 (회원)
    let result = await model.students
      .findAll({ where: { student_id: id } })
      .catch((err) => console.log(err));
        let pw_question = result[0].pw_question;
        return res.status(200).send(pw_question);  //비밀번호 찾기 질문
    } else {
        return res.sendStatus(400);                //일치하는 학번이 없음 (비회원) Bad request
    }

};
//비밀번호 찾기 함수
exports.findPW = async (req, res, next) => {
    let id = req.body.userNumber;
    let answer = req.body.userPwA;
    result = await model.students.findAll({where: {student_id: id, pw_answer: answer }}).catch((err) => console.log(err)); 

    if (result.length !== 0) {
      //비밀번호 찾기 답변 일치
          let pw = result[0].pw;
          return res.status(200).send(pw);
      } else {
          //비밀번호 찾기 답변 불일치
          return res.sendStatus(400);    
      }
}