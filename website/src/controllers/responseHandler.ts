import { Handler } from "express";
import { Answer, IAnswer } from "../models/answers";
import { IProblem } from "../models/Problem";
import { Response } from "../models/response";
import { ITest, Test } from "../models/test";
import { User } from "../models/user";

const newResponseGenerator: Handler = async (req, res, next) => {
  try {
    const studentId = (req.session as any).userId;

    const { testId, classId } = req.params;

    const student = await User.findById(studentId);

    let doesStudentAlreadyHaveAResponse = false;

    // check if student already has a response
    student.classRooms.forEach(async (room) => {
      if ((room.classroomId as any) === classId) {
        room.submissions.forEach(async (submission) => {
          if ((submission.testId as any) === testId) {
            doesStudentAlreadyHaveAResponse = true;
            const response = await Response.findById(
              submission.response as any
            );
            return res.status(200).json(response);
          }
        });
      }
    });

    // student alredy has a response, return
    if (doesStudentAlreadyHaveAResponse) return;

    const { questionBank } = await Test.findById(testId).populate("Problems");

    const ansArray: IAnswer[] = [];
    for (const ques of questionBank) {
      // assigns random question to students
      const randomQuestions = getRandom(ques.problems, ques.questionCount);

      for (const singleQuestion of randomQuestions) {
        const ans = await Answer.create({
          problemId: singleQuestion._id,
          studentId,
        });

        ansArray.push(ans);
      }
    }

    // creating a response object
    const response = await Response.create({
      studentId,
      testId,
      answers: ansArray,
    });

    return res.status(200).json(response);
  } catch (err) {
    next({ status: 400, message: err });
  }
};

const getRandom = (problems: IProblem[], questionCount: number) => {
  let result = new Array<IProblem>(questionCount),
    len = problems.length,
    taken = new Array(len);
  if (questionCount > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (questionCount--) {
    const x = Math.floor(Math.random() * len);
    result[questionCount] = problems[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};
