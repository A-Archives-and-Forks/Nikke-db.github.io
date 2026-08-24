import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
import {detectContentToUpdate, l2d, updateJson} from "./commonJsonActions";
import {AbstractAutomator} from "./AbstractAutomator";
import {AbstractEntity} from "./typeorm/AbstractEntity";
import {SkinEntity} from "./typeorm/SkinEntity";
dotenv.config()

export class AutoSkinNameFetcher extends AbstractAutomator {

    constructor(regex: string) {
        super();
        this.regex = regex
    }

    async setupDB () {
        this.DB_SOURCE = new DataSource({
            type: "sqljs",
            location: process.env.SQLITE_SKINS,
            entities: [SkinEntity],
            synchronize: false
        })

        await this.DB_SOURCE.initialize()
    }


    async main() {
        await this.setupDB()
        const json = detectContentToUpdate(this.regex)
        const namesToUpdate = await this.fetchInDatabase(json)
        updateJson(namesToUpdate, true)
    }

    async fetchInDatabase(data: l2d[]): Promise<AbstractEntity[]> {
        const nikkes = [] as SkinEntity[]

        for (const d of data) {
            // id need to be sanitized : remove "C" and leading 0
            // to remove leading zeroes, split the id by the _ , then sanitize the left split, then remerge the content
            let sanitizedId = d.id.replace("c", "")
            const sanitizedSplit = sanitizedId.split("_")
            sanitizedId = parseInt(sanitizedSplit[0]).toString() + "_" + sanitizedSplit[1]

            const e = await this.DB_SOURCE.getRepository(SkinEntity)
                .createQueryBuilder("a")
                .where("a.Key LIKE '%_costume_name'")
                .andWhere("a.Key LIKE :sanitized_id || '_costume_name'", {sanitized_id: sanitizedId})
                .getOne()
            if (e != null) {
                e.id = d.id
                nikkes.push(e)
            }
            else {
                console.log("could not find any entry in DB for id " + sanitizedId + " / + " + d.id + " and name " + d.name)
            }
        }
        return nikkes
    }
}