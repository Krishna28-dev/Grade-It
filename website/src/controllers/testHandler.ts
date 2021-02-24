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

// CRUD Operations for Question bank

const addItemToQuestionBank: Handler = async (req, res, next) => {
  try {
    const testId = req.params.testId;

    const test = await Test.findById(testId);

    const { marks, questionCount } = req.body;

    // check if the markIndex is there in the question-bank
    const markIndex = test.findQuestionBankIndex(marks);

    if (markIndex !== -1) {
      // document already exists, cannot add it to question-bank
      return res.status(400).send("An item already exists with that mark");
    }

    // append to question-bank array, recalculate total-marks
    test.questionBank.push({
      marks,
      questionCount,
      problems: [],
    });

    // recalculate total-marks
    test.totalMarks = test.calculateTotalMarks();

    await test.save();
    return res.status(200).send("Added a new question");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

// TODO: Finish this route
const updateQuestionInQuestionBank: Handler = async (req, res, next) => {
  try {
    // if user changes mark of question, it might conflict with another question,
    // to prevent that, we need send the questionBank id.
    const { testId } = req.params;

    const test = await Test.findById(testId).populate("tests");

    const {
      questionBankId,
      marks,
      questionCount,
    }: {
      questionBankId: string;
      marks: number;
      questionCount: number;
    } = req.body;

    const {
      marks: o_marks,
      questionCount: o_questionCount,
    } = test.questionBank.find((q) => (q as any)._id === questionBankId);

    if (o_marks === marks) {
      // marks haven't been changed,
      // so just find the questionBank and change the questionCount
      const markIndex = test.findQuestionBankIndex(o_marks);
      test.questionBank[markIndex].questionCount = questionCount;
    } else {
      // the mark of question has been changed

      const markIndex = test.findQuestionBankIndex(o_marks);
      if (markIndex == -1) {
        // a new mark has been added
        // remove old one from array, add new one
        // reflect the changes in the problems model,// TODO: add middleware for it
      }
    }
  } catch (err) {}
};

export { createTestForm, createTestHandler, viewAllTests };
