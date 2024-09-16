import { ObjectId } from "mongoose";
import { EventStatus } from "../enums/event.enum";

export interface Event {
  _id: ObjectId;
  eventStatus: EventStatus;
  eventName: string;
  eventTopic: string;
  eventDesc?: string;
  eventLocation: string;
  eventImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventInquiry {
  order: string;
  page: number;
  limit: number;
  search?: string;
}

export interface EventInput {
  eventStatus?: EventStatus;
  eventName: string;
  eventTopic: string;
  eventDesc?: string;
  eventLocation?: string;
  eventImages?: string[];
}

export interface EventUpdateInput {
  eventStatus?: EventStatus; // Make optional if it may not be updated
  eventName?: string;
  eventTopic?: string;
  eventDesc?: string;
  eventLocation?: string;
  eventImages?: string[];
}
