import { ClientSession, FilterQuery, Model } from 'mongoose';
import { IBaseRepository } from '../interface/IBaseRepository';
export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email });
  }
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
  async create(Data: Partial<T>,session?:ClientSession): Promise<T> {
    const newItem = new this.model(Data);
    return (await newItem.save({session})) as T;
  }

  async findAllWithFilter(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }
  async findAll(): Promise<T[]> {
    return await this.model.find();
  }
}
