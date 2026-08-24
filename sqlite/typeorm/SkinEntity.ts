import {AbstractEntity} from "./AbstractEntity";
import {Entity} from "typeorm";

@Entity({
    name: "Locale_CharacterCostume" // table only exists within the SQLITE_SKINS database
})
export class SkinEntity extends AbstractEntity {

}