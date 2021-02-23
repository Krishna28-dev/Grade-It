/*
* Create tests
  ? How to add problems to tests ? 
* Add questions
* 
*/

import { Handler } from "express";
import { Classroom } from "../models/classRoom";
import { Test } from "../models/test";

const createTestForm: Handler = async (req, res, next) => {
  res.send("Create Test form");
};

const createTestHandler: Handler = async (req, res, next) => {
  try {
    const classroomId = req.params.classId;

    const { name, description, startTime, endTime } = req.body;

    const classroom = await Classroom.findById(classroomId);
    const newTest = await Test.create({
      name,
      description,
      startTime,
      endTime,
      classroom,
    });

    console.log("New Test has been created, ", newTest);
    return res.send("New test has been created");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

// view all tests of a classroom
const viewAllTests: Handler = async (req, res, next) => {
  try {
    const classroomId = req.params.classId;

    const { tests } = await Classroom.findById(classroomId).populate("tests");

    res.status(200).send(tests);
  } catch (err) {
    next({ status: 500, message: err });
  }
};

export { createTestForm, createTestHandler, viewAllTests };
