
    import { FilterQuery, Model } from 'mongoose';
import { IBaseRepository} from '../interface/base.repo.interface';
    export class BaseRepository<T> implements IBaseRepository<T>{
        protected model : Model<T>;
        constructor (model:Model<T>){
        this.model = model;
        }
        async findByEmail(email: string): Promise<T | null> {
            return this.model.findOne({email});
        }
        async findById(id: string): Promise<T | null> {
            return this.model.findById(id);
        }
        async create(Data: Partial<T>): Promise<T> {
            const newItem =  new this.model(Data);
            return await newItem.save() as T;
        }

        async findAllWithFilter(filter:FilterQuery<T>):Promise<T[]>{
            return this.model.find(filter);
        }
        async findAll():Promise<T[]> {
            return await this.model.find();
        }
        
    }