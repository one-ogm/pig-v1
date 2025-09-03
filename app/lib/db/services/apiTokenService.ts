import { connectToMongoDB, isMongoDBAvailable } from '../mongodb';
import { ApiToken, type IApiToken } from '../models/ApiToken';

export class ApiTokenService {
  static async ensureConnection(context?: any) {
    if (!isMongoDBAvailable(context)) {
      throw new Error('MongoDB is not available - please check environment variables');
    }
    await connectToMongoDB(context);
  }

  static isAvailable(context?: any): boolean {
    return isMongoDBAvailable(context);
  }

  static async saveApiKey(
    provider: 'OpenRouter' | 'HuggingFace' | 'LMStudio',
    apiKey: string,
    userId: string = 'default_user'
  ): Promise<IApiToken> {
    await this.ensureConnection();

    try {
      const existingToken = await ApiToken.findOne({ userId, provider });

      if (existingToken) {
        // Update existing token
        existingToken.apiKey = apiKey;
        existingToken.isActive = true;
        existingToken.updatedAt = new Date();
        await existingToken.save();
        return existingToken.toObject();
      } else {
        // Create new token
        const newToken = new ApiToken({
          userId,
          provider,
          apiKey,
          isActive: true,
        });
        await newToken.save();
        return newToken.toObject();
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      throw new Error('Failed to save API key to database');
    }
  }

  static async getApiKey(
    provider: 'OpenRouter' | 'HuggingFace' | 'LMStudio',
    userId: string = 'default_user'
  ): Promise<string | null> {
    await this.ensureConnection();

    try {
      const token = await ApiToken.findOne({ userId, provider, isActive: true });
      return token ? token.apiKey : null;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  static async getAllApiKeys(userId: string = 'default_user'): Promise<Record<string, string>> {
    await this.ensureConnection();

    try {
      const tokens = await ApiToken.find({ userId, isActive: true });
      const apiKeys: Record<string, string> = {};
      
      tokens.forEach((token) => {
        apiKeys[token.provider] = token.apiKey;
      });

      return apiKeys;
    } catch (error) {
      console.error('Error getting all API keys:', error);
      return {};
    }
  }

  static async deleteApiKey(
    provider: 'OpenRouter' | 'HuggingFace' | 'LMStudio',
    userId: string = 'default_user'
  ): Promise<boolean> {
    await this.ensureConnection();

    try {
      const result = await ApiToken.findOneAndUpdate(
        { userId, provider },
        { isActive: false },
        { new: true }
      );
      return !!result;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  static async checkApiKeyExists(
    provider: 'OpenRouter' | 'HuggingFace' | 'LMStudio',
    userId: string = 'default_user'
  ): Promise<boolean> {
    await this.ensureConnection();

    try {
      const token = await ApiToken.findOne({ userId, provider, isActive: true });
      return !!token;
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  }
}
