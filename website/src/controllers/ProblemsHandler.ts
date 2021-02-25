import { Handler } from "express";
import { Problem } from "../models/Problem";
import { Test } from "../models/test";
import { unlinkSync } from "fs";

const addProblem: Handler = async (req, res, next) => {
  try {
    const testId = req.params.testId;

    const test = await Test.findById(testId);

    // question path of the question
    const questionPath = "foo";
    const marks = req.body.marks;

    // console.log("New problem has been created");

    // check if a question for that mark exists
    const markIndex = test.findQuestionBankIndex(marks);

    // add that mark to question bank
    if (markIndex === -1) {
      // questionBank with that mark doesn't exist, send error to user
      return res.status(400).send("question with that mark doesn't exist");
    } else {
      // uploading a new question to a existing questionBank
      const newProblem = await Problem.create({
        marks,
        questionPath,
        test,
      });

      test.questionBank[markIndex].problems.push(newProblem);
      res.status(200).send("Done");
      await test.save();
      return;
    }
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const editProblem: Handler = async (req, res, next) => {
  try {
    // change path problem

    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);

    //TODO: Multer integration

    // delete old doc
    unlinkSync(problem.questionPath);
    const newPath = "foo11";
    problem.questionPath = newPath;

    await problem.save();

    return res.status(200).send("Done");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const deleteProblem: Handler = async (req, res, next) => {
  try {
    //

    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);

    await problem.delete();

    return res.status(200).send("Done");
  } catch (err) {
    next({ status: 500, message: err });
  }
};
