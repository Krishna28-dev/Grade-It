import { Schema, Document, model } from "mongoose";
import { IClassroom } from "./classRoom";
import { IUser } from "./user";

// Schema for a single test
const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },

  classRoom: {
    type: Schema.Types.ObjectId,
    ref: "Classroom",
  },

  totalMarks: {
    type: Number,
  },

  questionBank: [
    {
      mark: {
        type: Number,
        required: true,
      },
      // question count per student
      questionCount: {
        type: Number,
        required: true,
      },
      // problems: [
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "Problem",
      //   },
      // ],
    },
  ],
});

export interface ITest extends Document {
  name: string;
  description: string;
  createdAt: Date;
  startTime: Date;
  endTime: Date;
  classroom: IClassroom;
  totalMarks: number;
  questionBank: {
    mark: number;
    questionCount: number;
    // problems
  }[];
}

export const Test = model<ITest>("Tests", TestSchema);
