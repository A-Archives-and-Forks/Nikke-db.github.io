import {AutoNikkeNameFetcher} from "./sqlite/auto_nikke_name_fetcher";
import {AutoSkinNameFetcher} from "./sqlite/auto_skin_name_fetcher";

const main = async () => {

    // regex :
    //      start with c
    //      id is composed of numbers 0 to 9, 3 times.
    //      end there
    const nameFetcher = new AutoNikkeNameFetcher("(^c)([0-9]{3}$)")
    // regex :
    //      start with c
    //      id is composed of numbers 0 to 9, 3 times.
    //      a underscore seperates data
    //      skin id is two numbers 0 to 9
    //      end there
    const skinFetcher = new AutoSkinNameFetcher("(^c)([0-9]{3})(_)([0-9]{2}$)")

    await nameFetcher.main()
    await skinFetcher.main()
}

main()