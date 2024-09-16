import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { EventInput } from "../libs/types/event";
import EventService from "../models/Event.service";

const eventService = new EventService();

const eventController: T = {};

eventController.createNewEvent = async (req: AdminRequest, res: Response) => {
  try {
    if (!req.files?.length) {
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    }

    const data: EventInput = req.body;
    data.eventImages = req.files?.map((ele) => {
      return ele.path;
    });

    await eventService.createNewEvent(data);

    res.send(data);
  } catch (err) {
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/event/all");</script>`
    );
  }
};

export default eventController;
