import {DataSource} from "typeorm";
import {l2d} from "./commonJsonActions";
import {AbstractEntity} from "./typeorm/AbstractEntity";

export abstract class AbstractAutomator {
    DB_SOURCE: DataSource;
    regex: string;

    abstract setupDB();
    abstract main();
    abstract fetchInDatabase(data: l2d[]): Promise<AbstractEntity[]>
}