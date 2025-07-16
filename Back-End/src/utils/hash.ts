import bcrypt from 'bcrypt'

export const hashPassword = async(plainPassword:string):Promise<string>=>{
    const saltRounds = 10

    return await bcrypt.hash(plainPassword,saltRounds)
};

export const comparePassword = async(plainPassword:string,hashPassword:string):Promise<boolean>=>{
    return await bcrypt.compare(plainPassword,hashPassword);
}