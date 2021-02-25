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

// updates all the marks of all problems in a single questionBank object, if marks ==  -1, it deletes the documents
TestSchema.methods.editAllProblemsMark = async function (
  this: ITest,
  questionBankIndex: number,
  marks: number
) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { problems } = this.questionBank[questionBankIndex];
      if (marks !== -1) {
        for (let problem of problems) {
          problem.marks = marks;
          await problem.save();
        }
      } else {
        for (let problem of problems) {
          await problem.delete();
          // TODO: Add middleware to delete the document
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
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
  editAllProblemsMark(questionBankIndex: number, marks: number): Promise<void>;
}
