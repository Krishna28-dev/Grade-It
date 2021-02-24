import { Schema, Document, model } from "mongoose";
import { IClassroom } from "./classRoom";
import { IProblem } from "./Problem";
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

  isPublished: {
    type: Boolean,
    default: false,
  },

  questionBank: [
    {
      marks: {
        type: Number,
        required: true,
      },
      // question count per student
      questionCount: {
        type: Number,
        required: true,
      },
      problems: [
        {
          type: Schema.Types.ObjectId,
          ref: "Problems",
        },
      ],
    },
  ],
});

// returns the index of the questionBank object with the given marks
TestSchema.methods.findQuestionBankIndex = function (
  this: ITest,
  questionBankIndex: number
): number {
  return this.questionBank.findIndex(
    (question) => question.marks === questionBankIndex
  );
};

// returns the total sum of all the marks * no of questions
TestSchema.methods.calculateTotalMarks = function (this: ITest): number {
  return this.questionBank.reduce(
    (sum, q) => (sum += q.marks * q.questionCount),
    0
  );
};

// TODO: Finish this method
// edits all the marks of a problems in a single questionBank object
TestSchema.methods.editsAllDocuments = function (
  this: ITest,
  questionBankIndex: number,
  marks: number
) {
  // finish thi
};

export const Test = model<ITest>("Tests", TestSchema);
export interface ITest extends Document {
  name: string;
  description: string;
  createdAt: Date;
  startTime: Date;
  endTime: Date;
  classroom: IClassroom;
  totalMarks: number;
  isPublished: boolean;
  questionBank: {
    marks: number;
    questionCount: number;
    problems: IProblem[];
  }[];

  // methods
  findQuestionBankIndex(questionBankIndex: number): number;
  calculateTotalMarks(): number;
}
