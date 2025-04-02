import { model, Schema } from 'mongoose';
import { TTrade } from './Trade.interface';
import { customerSchema } from '../order/Order.model';
import { ETradeState } from './Trade.enum';

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
    customer: customerSchema,
    state: {
      type: String,
      required: true,
      enum: Object.values(ETradeState),
      default: ETradeState.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Trade = model<TTrade>('Trade', tradeSchema);

export default Trade;
