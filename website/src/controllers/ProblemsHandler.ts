import { Handler } from "express";
import { Problem } from "../models/Problem";
import { Test } from "../models/test";

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
