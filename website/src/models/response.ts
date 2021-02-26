import { Schema, Document, model } from "mongoose";
import { ITest } from "./test";
import { IUser } from "./user";

const ResponseSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  testId: {
    type: Schema.Types.ObjectId,
    ref: "Tests",
  },
  score: {
    type: Number,
    default: 0,
  },
  timeStarted: {
    type: Date,
  },
  timeFinished: {
    type: Date,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
});

export const Response = model<IResponse>("Responses", ResponseSchema);

export interface IResponse extends Document {
  studentId: IUser;
  testId: ITest;
  score: Number;
  timeStarted?: Date;
  timeFinished?: Date;
  // answers
}
