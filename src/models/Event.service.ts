import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { EventInput, EventUpdateInput } from "../libs/types/event";
import EventModel from "../schema/Event.model";

class EventService {
  private readonly eventModel;

  constructor() {
    this.eventModel = EventModel;
  }

  public async getAllEvents(): Promise<Event[]> {
    const result = await this.eventModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewEvent(input: EventInput): Promise<Event> {
    try {
      return await this.eventModel.create(input);
    } catch (err) {
      console.log("ERROR, model: createNewEvent", err);

      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  public async updateChosenEvent(
    _id: string,
    input: EventUpdateInput
  ): Promise<Event> {
    _id = shapeIntoMongooseObjectId(_id);
    const result = await this.eventModel
      .findOneAndUpdate({ _id: _id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default EventService;
