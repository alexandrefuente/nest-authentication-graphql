import { User } from "../../user/entity/user.entity";

export default class TestUtil {
    static giveMeValidUser(): User {
        const user = new User()
        user.email = 'valid@email.com'
        user.name = 'Valid'
        user.password = '123456'
        user.id = '1'
        return user
    }
}