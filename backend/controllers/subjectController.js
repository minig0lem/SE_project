const express = require("express");
const model = require("../models");
const { Readable } = require("stream");
const fs = require("fs");

//과목에 해당하는 공지사항 리스트 주는 함수
exports.getNoticeList = async (req, res, next) => {
    let subjectId = req.params.id;
    let page = req.params.page;
    let perPage = 10;
    let notices = await model.notices
      .findAll({
        where: { subject_id: subjectId },
        order: [["createdAt", "DESC"]],
        limit: perPage,
        offset: (page - 1) * perPage,
        include: { model: model.professors },
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(400); //Bad request
      });
    //삭제되지 않은 공지사항만 조회
    let noticeList = notices.filter((notice) => notice.isDeleted === 0);
    let result = await model.notices
      .findAll({
        where: { subject_id: subjectId },
        include: { model: model.professors },
      })
      .catch((err) => console.log(err));
    let count = result.length;
    let data = [noticeList, count];
    return res.status(200).send(data);
};

//공지사항 조회 함수
exports.getNotice = async (req, res, next) => {
  let noticeId = req.params.id;
  let notice = await model.notices
    .findOne({
      where: { notice_id: noticeId },
      include: { model: model.professors },
    })
    .catch((err) => console.log(err));

  if (notice) {
    //공지사항 조회 성공
    let file_notice = [];
    //조회 수 1 증가
    notice.notice_views += 1;
    await notice.save();
    if (notice.notice_file) {
      let fileId = notice.notice_file;
      let file = await model.files
        .findOne({
          where: { file_id: fileId },
        })
        .catch((err) => console.log(err));
      let filename = file.file_name;
      file_notice.push({
        ...notice.get(),
        file_id: fileId,
        filename: filename,
      });
    } else {
      file_notice.push({ ...notice.get() });
    }
    let data = file_notice;
    console.log(data);
    return res.status(200).send(data);
  } else {
    //공지사항 조회 오류
    return res.sendStatus(400); //Bad request
  }
};

//공지사항 작성 함수
exports.writeNotice = async (req, res, next) => {
  let fileId = "";
  //업로드 파일이 있을 경우
  if (req.file) {
    let filedata = {
      file_name: req.file.originalname,
      file_content: req.file.buffer,
      file_mimetype: req.file.mimetype,
    };

    let file = await model.files.create(filedata).catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });

    fileId = file.file_id;
  }

  let datas = {
    professor_id: req.session.loginId,
    subject_id: req.body.subject_id,
    notice_title: req.body.title,
    notice_description: req.body.description,
    notice_file: fildId === "" ? null : fileId,
  };

  let result = await model.notices.create(datas).catch((err) => {
    console.log(err);
    return res.sendStatus(400);
  });

  return res.sendStatus(200);
};

//다운로드 함수
exports.Download = async (req, res, next) => {
  let fileId = req.params.id;
  let file = await model.files
    .findOne({ where: { file_id: fileId } })
    .catch((err) => console.log(err));
  res.setHeader("Content-Type", file.file_mimetype);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(file.file_name)}"`
  );
  // 파일을 스트림 형태로 응답한다.
  const fileStream = new Readable();
  fileStream.push(file.file_content);
  fileStream.push(null);
  fileStream.pipe(res);
};

//묻고 답하기 목록 함수
exports.getQnAList = async (req, res, next) => {
  let studentId = req.session.loginId;
  let subjectId = req.params.id;
  let perPage = 10;
  let page = req.params.page;
  let qnas = await model.QnAs.findAll({
    where: { subject_id: subjectId, student_id: studentId },
    order: [["createdAt", "DESC"]],
    limit: perPage,
    offset: (page - 1) * perPage,
    include: { model: model.students },
  }).catch((err) => {
    console.log(err);
    return res.sendStatus(400); //Bad request
  });
  //삭제되지 않은 묻고 답하기만 조회
  let qnaList = qnas.filter((qna) => qna.isDeleted === 0);
  let result = await model.QnAs.findAll({
    where: { subject_id: subjectId, student_id: studentId },
  }).catch((err) => console.log(err));
  let count = result.length;
  let data = [qnaList, count];
  return res.status(200).send(data);
};

//묻고 답하기 글 조회 함수
exports.getQnA = async (req, res, next) => {
  let qnaId = req.params.id;
  let qna = await model.QnAs.findOne({ where: { QnA_id: qnaId } }).catch(
    (err) => console.log(err)
  );
  if (qna) {
    let comments = await model.comments
      .findAll({
        where: { qna_id: qnaId },
        include: [{ model: model.students }, { model: model.professors }],
      })
      .catch((err) => console.log(err));

    let data = [qna, comments];
    return res.status(200).send(data);
  } else {
    return res.sendStatus(400);
  }
};

//묻고 답하기 작성 함수
exports.writeQnA = async (req, res, next) => {
  let studentId = req.session.loginId;
  let subjectId = req.params.id;
  let datas = {
    student_id: studentId,
    subject_id: subjectId,
    QnA_title: req.body.title,
    QnA_description: req.body.description,
  };
  //묻고 답하기 작성
  let result = await model.QnAs.create(datas).catch((err) => console.log(err));

  if (result) {
    //작성 성공
    return res.sendStatus(200);
  } else {
    //작성 실패
    return res.sendStatus(400); //Bad request
  }
};

//묻고 답하기 수정 함수
exports.updateQnA = async (req, res, next) => {
  let id = req.body.QnA_id;
  let datas = {
    QnA_title: req.body.title,
    QnA_description: req.body.description,
  };
  let result = await model.QnAs.update(datas, { where: { QnA_id: id } }).catch(
    (err) => console.log(err)
  );

  if (result.length !== 0) {
    //수정 성공
    return res.sendStatus(200);
  } else {
    //수정 실패
    return res.sendStatus(400);
  }
};

//묻고 답하기 삭제 함수
exports.deleteQnA = async (req, res, next) => {
  let id = req.body.QnA_id;
  let qna = await model.QnAs.findOne({ where: { QnA_id: id } }).catch((err) =>
    console.log(err)
  );

  if (qna) {
    //삭제할 Q&A 가져오기 성공
    //isDeleted 변수를 1로 주어 삭제 표시
    qna.isDeleted = 1;
    await qna.save();
    //삭제 성공
    return res.sendStatus(200);
  } else {
    //삭제할 Q&A 가져오기 실패
    return res.sendStatus(400);
  }
};

//강의계획서 조회 함수
exports.getSyllabus = async (req, res, next) => {
  let subjectId = req.params.id;
  let syllabus = await model.syllabus
    .findOne({
      where: { subject_id: subjectId },
      include: [{ model: model.subjects }, { model: model.professors }],
    })
    .catch((err) => console.log(err));
  if (syllabus) {
    //강의계획서 조회 성공
    return res.status(200).send(syllabus);
  } else {
    //강의계획서 조회 실패
    return res.sendStatus(400);
  }
};

//강의계획서 작성 함수
exports.writeSyllabus = async (req, res, next) => {
  let datas = {
    professor_id: req.session.loginId,
    subject_id: req.params.subject_id,
    syllabus_outline: req.body.outline,
    syllabus_purpose: req.body.purpose,
    syllabus_details: req.body.details,
  };

  let result = await model.syllabus.create(datas).catch((err) => {
    console.log(err);
    return res.sendStatus(400);
  });
  return res.sendStatus(200);
};

//강의계획서 수정 함수
exports.updateSyllabus = async (req, res, next) => {
  let datas = {
    syllabus_outline: req.body.outline,
    syllabus_purpose: req.body.purpose,
    syllabus_details: req.body.details,
  };

  let result = await model.syllabus
    .update(datas, {
      where: { syllabus_id: req.params.syllabus_id },
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });

  return res.sendStatus(200);
};

//댓글 작성 함수
exports.writeComment = async (req, res, next) => {
  let qnaId = req.params.id;
  let type = req.sessions.userType;
  let datas = "";
  if (type === "student") {
    datas = {
      qna_id: qnaId,
      student_id: req.sessions.loginId,
      description: req.body.description,
    };
  } else if (type === "professor") {
    datas = {
      qna_id: qnaId,
      professor_id: req.session.loginId,
      description: req.body.description,
    };
  }
  let result = await model.comments.create(datas).catch((err) => {
    console.log(err);
    return res.sendStatus(400);
  });
  return res.sendStatus(200);
};
