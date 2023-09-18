import mongoose from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IRestaurant {
  _id: string;
  archive: boolean;
  restaurantName: string;
  address: string;
  userGroupID: string;
}
interface RestaurantClass {
  _id: mongoose.Types.ObjectId;
  archive: boolean;
  restaurantName: string;
  address: string;
  userGroupID: mongoose.Types.ObjectId;
}
const RestaurantSchema = new mongoose.Schema<RestaurantClass>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  archive: { type: Boolean },
  restaurantName: { type: String },
  address: { type: String },
  userGroupID: { type: mongoose.Schema.Types.ObjectId },
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
