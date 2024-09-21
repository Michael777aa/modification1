import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { ObjectId } from "mongoose";
import MemberService from "./Member.service";
import { OrderStatus } from "../libs/enums/order.enum";
import ProductModel from "../schema/Product.model";

class OrderService {
  private readonly orderModel = OrderModel;
  private readonly orderItemModel = OrderItemModel;
  private readonly productModel = ProductModel;
  private readonly memberService = new MemberService();

  public async createOrder(
    member: Member,
    input: OrderItemInput[],
    totalPrice: number | undefined
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    // Calculate total amount if more than 100
    const amount = input.reduce(
      (accumulator, item) => accumulator + item.itemPrice * item.itemQuantity,
      0
    );
    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder = await this.orderModel.create({
        orderTotal: totalPrice ? totalPrice.toFixed(1) : amount,
        orderDelivery: delivery,
        memberId: memberId,
      });

      const orderId = newOrder._id;

      await this.recordOrderItem(orderId, input);

      for (const item of input) {
        const productId = shapeIntoMongooseObjectId(item.productId);
        const product = await this.productModel.findById(productId).exec();

        if (!product)
          throw new Errors(HttpCode.NOT_FOUND, Message.CREATE_FAILED);

        const leftAmount = product.productLeftCount - item.itemQuantity;
        const soldAmount = product.productSold + item.itemQuantity;

        if (leftAmount < 0)
          throw new Errors(HttpCode.NOT_FOUND, Message.CREATE_FAILED);

        await this.productModel
          .findByIdAndUpdate(
            productId,
            { productLeftCount: leftAmount, productSold: soldAmount },
            { new: true }
          )
          .lean()
          .exec();
      }

      return newOrder;
    } catch (err) {
      console.error("Error in createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(
    orderId: ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    const promisedList = input.map(async (item) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "INSERTED";
    });

    const orderItemsState = await Promise.all(promisedList);
    console.log("Order items state:", orderItemsState);
  }

  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    const matches = {
      memberId: memberId,
      orderStatus: inquiry.orderStatus,
    };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const orderId = shapeIntoMongooseObjectId(input.orderId);
    const orderStatus = input.orderStatus;

    try {
      const result = await this.orderModel
        .findOneAndUpdate(
          { memberId: memberId, _id: orderId },
          { orderStatus: orderStatus },
          { new: true }
        )
        .exec();

      if (!result)
        throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

      if (orderStatus === OrderStatus.PROCESS) {
        await this.memberService.addUserPoint(member, 1);
      }

      return result;
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }
  }
}

export default OrderService;
