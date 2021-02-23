import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

const ClassroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  applicants: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  rejected: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

ClassroomSchema.methods.checkStudentStatus = function (
  this: IClassroom,
  userId: any
) {
  if (this.participants.includes(userId)) return "participant";
  if (this.applicants.includes(userId)) return "applicant";
  if (this.rejected.includes(userId)) return "rejected";
  return "";
};

export interface IClassroom extends Document {
  name: string;
  description: string;
  createdBy: IUser;
  participants: IUser[];
  applicants: IUser[];
  rejected: IUser[];

  // tests:
  // Assignments

  // methods
  checkStudentStatus(userId: any): string;
}

export const Classroom = model<IClassroom>("Classroom", ClassroomSchema);
