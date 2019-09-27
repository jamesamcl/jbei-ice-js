
import ICE from './ICE'
import Entry from './Entry'

import { expectNumber, expectString } from './expect'
import Collection from './Collection'

export default class Folder {


    ice:ICE

    id:number
    folderName:string|undefined
    entryCount:number
    collection:Collection|null


    
    constructor(ice:ICE, collection:Collection|null, f:any) {

        console.dir(f)

        this.ice = ice
        this.id = expectNumber(f.id)
        this.entryCount = expectNumber(f.count)

        if(f.folderName !== undefined)
            this.folderName = expectString(f.folderName)

        this.collection = collection
    }


    async getEntries():Promise<Entry[]> {

        let url:string = `/rest/folders/${this.id}/entries`

        let r = await this.ice.get(url, { 404: null, 204: { entries: [] }})


        let entries:Entry[] = []

        if(r.entries && r.entries.length > 0)
            entries = entries.concat( r.entries.map((e) => new Entry(this.ice, e)) )

        // only for "bulk edit" whatever that is
        //if(r.entryList && r.entryList.length > 0)
            //entries = entries.concat( r.entryList.map((e) => new Entry(this.ice, e)) )

        return entries
    }

}

