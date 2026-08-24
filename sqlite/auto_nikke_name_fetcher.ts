import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
import {NikkeEntity} from "./typeorm/NikkeEntity";
import {detectContentToUpdate, l2d, updateJson} from "./commonJsonActions";
import {AbstractAutomator} from "./AbstractAutomator";
import {AbstractEntity} from "./typeorm/AbstractEntity";
dotenv.config()

export class AutoNikkeNameFetcher extends AbstractAutomator {

    constructor(regex: string) {
        super();
        this.regex = regex
    }

    async setupDB () {
        this.DB_SOURCE = new DataSource({
            type: "sqljs",
            location: process.env.SQLITE_CHARACTERS,
            entities: [NikkeEntity],
            synchronize: false
        })

        await this.DB_SOURCE.initialize()
    }


    async main() {
        await this.setupDB()
        const json = detectContentToUpdate(this.regex)
        const namesToUpdate = await this.fetchInDatabase(json)
        updateJson(namesToUpdate, false)
    }

    async fetchInDatabase(data: l2d[]): Promise<AbstractEntity[]> {
        const nikkes = [] as NikkeEntity[]

        for (const d of data) {
            // id need to be sanitized : remove "C" and leading 0
            const sanitizedId = parseInt(d.id.replace("c", "")).toString()

            const e = await this.DB_SOURCE.getRepository(NikkeEntity)
                .createQueryBuilder("a")
                .where("a.Key LIKE '%_name'")
                .andWhere("a.Key LIKE :sanitized_id || '_name'", {sanitized_id: sanitizedId})
                .getOne()
            if (e != null) {
                e.id = d.id
                nikkes.push(e)
            }
            else {
                console.log("could not find any entry in DB for id " + sanitizedId + " and name " + d.name)
            }
        }
        return nikkes
    }
}