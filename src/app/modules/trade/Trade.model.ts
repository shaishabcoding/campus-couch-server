import { model, Schema } from 'mongoose';
import { TTrade } from './Trade.interface';
import { customerSchema } from '../order/Order.model';
import { EOrderState } from '../order/Order.enum';

const tradeSchema = new Schema<TTrade>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    category: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    seller: customerSchema,
    state: {
      type: String,
      required: true,
      enum: Object.values(EOrderState),
      default: EOrderState.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Trade = model<TTrade>('Trade', tradeSchema);

export default Trade;
