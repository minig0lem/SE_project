const express = require('express');
const model = require('../models');


//유저 정보 주는 함수
exports.getUserInfo = async(req, res, next) => {
    let id = req.session.loginId;
    let type = req.session.userType;
    let data = '';
    if(id) {
        //로그인 상태
        if(type === 'student') {
            //학생인 경우
            data = await model.students.findOne({where: {student_id: id}}).catch((err) => console.log(err));
        } else if (type === 'professor') {
            //교수인 경우
            data = await model.professors.findOne({where: {professor_id: id}}).catch((err) => console.log(err));
        } else {
            //관리자인 경우
        }
        if(data) {
            //유저 정보 전송
            return res.status(200).send(data);
        } else {
            //유저 정보 없음
            return res.sendStatus(400);     //Bad request
        }
        
    } else {
        //로그아웃 상태
        return res.sendStatus(401);
    }
}

//내 정보 수정 함수
exports.updateUser = async(req, res, next) => {
    let id = req.session.loginId;
    let result = '';
    let datas = {
        pw: req.body.password,
        email: req.body.email,
        phone_number: req.body.phoneNumber
    };
    if(req.session.userType === 'student'){
        result = await model.students.update(datas, {where: {student_id: id}}).catch((err) => console.log(err));
    } else if(req.session.userType === 'professor') {
        result = await model.professors.update(datas, {where: {professor_id: id}}).catch((err) => console.log(err));
    }

    if(result.length !== 0) {
        //수정 성공
        return res.sendStatus(200);
    } else {
        //수정 실패
        return res.sendStatus(400);        //Bad request
    }
};

//친구 목록 조회 함수
exports.getFriendList = async(req, res, next) => {
    let studentId = req.session.loginId;
    let friends = await model.friends.findAll({
        where: {student_id: studentId}
    }).catch((err) => console.log(err));
    

};