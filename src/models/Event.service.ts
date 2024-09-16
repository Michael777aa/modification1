import Errors, { HttpCode, Message } from "../libs/Error";
import { EventInput } from "../libs/types/event";
import EventModel from "../schema/Event.model";

class EventService {
  private readonly eventModel;

  constructor() {
    this.eventModel = EventModel;
  }

  public async createNewEvent(input: EventInput): Promise<Event> {
    try {
      return await this.eventModel.create(input);
    } catch (err) {
      console.log("ERROR, model: createNewEvent", err);

      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default EventService;
