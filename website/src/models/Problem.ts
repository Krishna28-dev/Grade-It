import { NextFunction } from "express";
import { Schema, Document, model } from "mongoose";
import { ITest } from "./test";
import { unlinkSync } from "fs";

const ProblemSchema = new Schema({
  marks: {
    type: Number,
    required: true,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: "Tests",
  },
  // path of the question relative to the home directory
  questionPath: {
    type: String,
    required: true,
  },
});

// ProblemSchema.methods.updateQ

//middleware to delete the doc if the problem is deleted
ProblemSchema.pre(
  "remove",
  { document: true, query: false },
  function (this: IProblem, next: NextFunction) {
    unlinkSync(this.questionPath);
    return next();
  }
);

export interface IProblem extends Document {
  marks: number;
  test: ITest;
  questionPath: string;
}

export const Problem = model<IProblem>("Problems", ProblemSchema);
