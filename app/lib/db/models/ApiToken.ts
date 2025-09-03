import { mongoose } from '../mongodb';

const apiTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default_user', // For now, using single user approach
    },
    provider: {
      type: String,
      required: true,
      enum: ['OpenRouter', 'HuggingFace', 'LMStudio'],
    },
    apiKey: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for efficient queries
apiTokenSchema.index({ userId: 1, provider: 1 }, { unique: true });

export const ApiToken = mongoose.models.ApiToken || mongoose.model('ApiToken', apiTokenSchema);

export interface IApiToken {
  _id?: string;
  userId: string;
  provider: 'OpenRouter' | 'HuggingFace' | 'LMStudio';
  apiKey: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
