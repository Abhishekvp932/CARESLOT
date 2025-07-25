
    import { IBaseRepository } from "../interface/base.repo.interface";
    export class BaseRepository<T> implements IBaseRepository<T>{
        protected model : any;
        constructor (model:any){
        this.model = model
        }
        async findByEmail(email: string): Promise<T | null> {
            return this.model.findOne({email});
        }
        async findById(id: string): Promise<T | null> {
            return this.model.findById(id)
        }
        async create(Data: Partial<T>): Promise<T> {
            const newItem =  new this.model(Data)
            return await newItem.save();
        }

        async findAllWithFilter(filter:any = []):Promise<T | null>{
            return this.model.find(filter);
        }
        async findAll(): Promise<T | null> {
            return await this.model.find()
        }
        
    }