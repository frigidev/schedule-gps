import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { DatabaseService } from "../database-service/database.service";

const USERS_KEY = "users"

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private databaseService: DatabaseService){}

    async create(user: User){
        const users = await this.list()
        if(users){
            users.push(user)
            this.databaseService.set(USERS_KEY, users);
        }else {
            this.databaseService.set(USERS_KEY, [user]);
        }
    }

    async edit(user: User, email: string){
        const users = await this.list()
        if(users){
            const index = users.findIndex(user => user.email === email);
            if(index >= 0){
                users.splice(index, 1, user)
                this.databaseService.set(USERS_KEY, users);
            }
        }
    }

    list(): Promise<User[] | null> {
        return this.databaseService.get<User[]>(USERS_KEY)
    }

    async get(email: string): Promise<User | null> {
        const users = await this.list();
        if(users){
            const index = users.findIndex(user => user.email === email);
            if(index >= 0){
                return users[index];
            }
            return null
        }else {
            return null
        }
    }

    async delete(email: string): Promise<boolean> {
        const users = await this.list()
        if(users) {
            const index = users.findIndex(user => user.email === email)
            if(index >= 0) {
                users.splice(index, 1);
                this.databaseService.set(USERS_KEY, users)
                return true
            } else{
                return false
            }
        } else {
            return false
        }
    }

    async findByName(name: string): Promise<User[]> {
        const users = await this.list()
        const filtered = users?.filter(user => user.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()))
        if(filtered){
            return filtered
        }else {
            return []
        }
    }

    async findByPhone(phone: string): Promise<User[]>{
        const users = await this.list();
        const filtered = users?.filter(user => user.phone.toLocaleLowerCase().startsWith(phone.toLocaleLowerCase()))
        if(filtered){
            return filtered
        }else {
            return []
        }
    }

}