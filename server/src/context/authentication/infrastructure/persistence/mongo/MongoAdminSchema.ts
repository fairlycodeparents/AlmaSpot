import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Omit<Document, "_id"> {
  _id: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false,
  },
);

export const AdminModel = mongoose.model<AdminDocument>(
  "Administrator",
  AdminSchema,
);
