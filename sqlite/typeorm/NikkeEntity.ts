import {AbstractEntity} from "./AbstractEntity";
import {Entity} from "typeorm";

@Entity({
    name: "Locale_Character" // table only exists within the SQLITE_CHARACTERS database
})
export class NikkeEntity extends AbstractEntity {

}