import { Schema, Document, model } from "mongoose";
import { ITest } from "./test";

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

export interface IProblem extends Document {
  marks: number;
  test: ITest;
  questionPath: string;
}

export const Problem = model<IProblem>("Problems", ProblemSchema);
