import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Session } from "express-session";
import { Request } from "express";

export interface Coupan {
  name: string;
  expiry: Date;
  discount: Number;
}

export interface CoupanInput {
  name: string;
  expiry: Date;
  discount: Number;
}
