import { model, Schema } from 'mongoose';
import { TTransaction } from './Transaction.interface';
import { ETransactionType } from './Transaction.enum';

const transactionSchema = new Schema<TTransaction>(
  {
    transaction_id: String,
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_method: {
      type: String,
      required: true,
      trim: true,
    },
    transaction_type: {
      type: String,
      enum: Object.values(ETransactionType),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Transaction = model<TTransaction>('Transaction', transactionSchema);

export default Transaction;
