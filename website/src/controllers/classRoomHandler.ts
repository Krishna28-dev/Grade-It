import { Handler } from "express";
import { Classroom } from "../models/classRoom";
import { User } from "../models/user";

const createClassroomFormHandler: Handler = (req, res, next) => {
  res.send("New classroom form");
};

const newClassroomHandler: Handler = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const userId = (req.session as any).userId;

    const classRoom = await Classroom.create({
      name,
      description,
      createdBy: userId,
    });
    console.log("created a new class-room", classRoom);
    return res.send("Created class-room");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

// apply for a class

const applyForClassRoomHandler: Handler = async (req, res, next) => {
  try {
    const userId = (req.session as any).user.id;
    const classroomId = req.params.classId;

    const classroom = await Classroom.findById(classroomId);
    const studentType = classroom.checkStudentStatus(userId);

    if (studentType) {
      return res.send(
        `Cannot apply again because the student is already ${studentType}`
      );
    }
    classroom.applicants.push(userId);
    classroom.save();
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const acceptApplicant: Handler = async (req, res, next) => {
  try {
    const userId = (req.session as any).user.id;

    const classroom = await Classroom.findById(req.params.classId);
    const studentType = classroom.checkStudentStatus(userId);

    if (studentType == "applicant") {
      classroom.applicants.splice(classroom.applicants.indexOf(userId, 1));
      classroom.participants.push(userId);
      await classroom.save();
      return res.status(200).send("Applicant Accepted");
    } else {
      // student is not applicant
      return res.send("Student is not an applicant");
    }
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const rejectApplicant: Handler = async (req, res, next) => {
  try {
    const userId = (req.session as any).user.id;

    const classroom = await Classroom.findById(req.params.classId);
    const studentType = classroom.checkStudentStatus(userId);

    if (studentType == "applicant") {
      classroom.applicants.splice(classroom.applicants.indexOf(userId, 1));
      classroom.rejected.push(userId);
      await classroom.save();
      return res.status(200).send("Applicant rejected");
    } else {
      // student is not applicant
      return res.status(400).send("Student is not an applicant");
    }
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const studentStatus: Handler = async (req, res, next) => {
  try {
    const userId = (req.session as any).user.id;
    const classroom = await Classroom.findById(req.params.classId);
    const studentStatus = classroom.checkStudentStatus(userId);
    return res.status(200).send(studentStatus);
  } catch (err) {
    next({ status: 500, message: err });
  }
};

export {
  createClassroomFormHandler,
  newClassroomHandler,
  applyForClassRoomHandler,
  acceptApplicant,
  rejectApplicant,
  studentStatus,
};
