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

    // TODO: Add this add a method
    // recalculate total-marks
    test.totalMarks = test.calculateTotalMarks();

    await test.save();
    return res.status(200).send("Added a new question");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

// TODO: Add view all problems route

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

      // recalculate total-marks
      test.totalMarks = test.calculateTotalMarks();

      await test.save();
      return res.status(200).send("test has been updated");
    } else {
      // the mark of question has been changed

      const newMarkIndex = test.findQuestionBankIndex(marks); // index of the new-mark
      const oldMarkIndex = test.findQuestionBankIndex(o_marks); // index of the old-mark(which needs to be updated)

      if (newMarkIndex == -1) {
        // a new mark has been added, which doesn't  conflict with existing marks
        // update that array element

        // changing all the marks of Problem sub-document
        await test.editAllProblemsMark(oldMarkIndex, marks);

        test.questionBank[oldMarkIndex].marks = marks;
        test.questionBank[oldMarkIndex].questionCount = questionCount;

        // recalculate total-marks
        test.totalMarks = test.calculateTotalMarks();
        await test.save();
        return res.send("test has been updated");
      } else {
        // conflicts with existing mark,
        await test.editAllProblemsMark(oldMarkIndex, marks);

        // update sub-document, push it to the array
        const newProblems = test.questionBank[newMarkIndex].problems;
        test.questionBank[newMarkIndex].problems = test.questionBank[
          newMarkIndex
        ].problems.concat(newProblems);

        // remove the old obj, update the new one
        test.questionBank.splice(oldMarkIndex, 1);
        test.questionBank[newMarkIndex].questionCount = questionCount;

        // recalculate total-marks
        test.totalMarks = test.calculateTotalMarks();

        await test.save();

        return res.status(200).send("test has been updated");
      }
    }
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const deleteQuestionInQuestionBank: Handler = async (req, res, next) => {
  try {
    //

    const testId = req.params.testId;
    const test = await Test.findById(testId).populate("tests");

    const { marks }: { marks: number } = req.body;

    const markIndex = test.findQuestionBankIndex(marks);
    if (markIndex === -1) {
      // such doc doesn't exist
      return res.status(400).send("Such doc doesn't exist");
    }
    // deletes all the problem sub-document(s)
    await test.editAllProblemsMark(markIndex, -1);

    test.questionBank.splice(markIndex, 1);

    await test.save();
    return res.status(200).send("Deleted");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

export { createTestForm, createTestHandler, viewAllTests };
