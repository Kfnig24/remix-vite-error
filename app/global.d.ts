import type { Database as DB } from "@/lib/database.types";

declare global {
    type Database = DB

    type ClientAccount = DB["public"]["Tables"]["clients"]["Row"]
    type TeenAccount = DB["public"]["Tables"]['teens']["Row"]
    type UserRegistery = DB["public"]["Tables"]["users"]["Row"]

    type Job = DB["public"]["Tables"]["jobs"]["Row"]
}