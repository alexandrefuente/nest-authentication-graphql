import { hashSync } from "bcrypt"
/**
 * Add a HASH to user password
 */
export const hashPasswordTransform = {
    to(password: string): string {
        return hashSync(password, 10)
    },
    from(hash: string): string {
        return hash
    }
}