
import ICE from './ICE'
import Entry from './Entry'
import Folder from './Folder'

export default class Collection {

    ice:ICE
    collectionType:string

    constructor(ice:ICE, collectionType:string) {
        this.ice = ice
        this.collectionType = collectionType
    }

    async getEntryCount():Promise<number> {

        let counts = await this.ice.get('/rest/collections/counts')

        let count = counts[this.collectionType.toLowerCase()]

        if(!count) {
            throw new Error('could not get count')
        }

        return count
    }

    async getFolders():Promise<Folder[]> {

        let folders = await this.ice.get(`/rest/collections/${this.collectionType.toUpperCase()}/folders`, {
            400: [],
            500: []
        })

        return folders.map((f) => new Folder(this.ice, this, f))

    }

    async getEntries():Promise<Entry[]> {

        let entries = await this.ice.get(`/rest/collections/${this.collectionType.toUpperCase()}/entries`)

        return entries.data.map((e) => new Entry(this.ice, e))


    }
}

