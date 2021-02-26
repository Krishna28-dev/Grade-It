import { Schema, Document, model } from "mongoose";
import { IProblem } from "./Problem";
import { IUser } from "./user";

const AnswerSchema = new Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: "Problems",
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  marksObtained: {
    type: Number,
  },
  answerPath: {
    type: String,
    default: "",
  },
  hasSubmitted: {
    type: Boolean,
    default: false,
  },
  submissionTime: {
    type: Date,
  },
});

export const Answer = model<IAnswer>("Answers", AnswerSchema);

export interface IAnswer extends Document {
  problemId: IProblem;
  studentId: IUser;
  marksObtained?: number;
  answerPath: string;
  hasSubmitted: boolean;
  submissionTime?: Date;
}
