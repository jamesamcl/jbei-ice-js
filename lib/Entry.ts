
import { expectString, expectNumber, expectBool } from './expect'
import ICE from './ICE'
import Sequence from './Sequence'
import { SBOL2Graph } from 'sbolgraph'

export default class Entry {

    ice:ICE

    id:number
    type:string
    parentIDs:number[]
    linkedPartIDs:number[]
    index:number
    ownerId:number
    creatorId:number
    status:string
    shortDescription:string
    creationTime:number
    modificationTime:number
    bioSafetyLevel:number
    principalInvestigatorId:number
    basePairCount:number
    featureCount:number
    viewCount:number
    hasAttachment:boolean
    hasSample:boolean
    hasSequence:boolean
    hasOriginalSequence:boolean
    canEdit:boolean
    accessPermissions:any[]
    publicRead:boolean

    partId:string
    recordId:string
    name:string
    alias:string|undefined


    constructor(ice:ICE, e:any) {

        this.ice = ice


        this.id = expectNumber(e.id)
        this.type = expectString(e.type)
        this.parentIDs = e.parents.map((p) => p.id)
        this.linkedPartIDs = e.linkedParts.map((p) => p.id)
        this.index = expectNumber(e.index)
        this.ownerId = expectNumber(e.ownerId)
        this.creatorId = expectNumber(e.creatorId)
        this.status = expectString(e.status)
        this.shortDescription = expectString(e.shortDescription)
        this.creationTime = expectNumber(e.creationTime)
        this.modificationTime = expectNumber(e.modificationTime)
        this.bioSafetyLevel = expectNumber(e.bioSafetyLevel)
        this.principalInvestigatorId = expectNumber(e.principalInvestigatorId)
        this.basePairCount = expectNumber(e.basePairCount)
        this.featureCount = expectNumber(e.featureCount)
        this.viewCount = expectNumber(e.viewCount)
        this.hasAttachment = expectBool(e.hasAttachment)
        this.hasSample = expectBool(e.hasSample)
        this.hasSequence = expectBool(e.hasSequence)
        this.hasOriginalSequence = expectBool(e.hasOriginalSequence)
        this.canEdit = expectBool(e.canEdit)
        this.accessPermissions = e.accessPermissions
        this.publicRead = expectBool(e.publicRead)

        this.partId = expectString(e.partId)
        this.recordId = expectString(e.recordId)
        this.name = expectString(e.name)

        if(e.alias !== undefined)
            this.alias = expectString(e.alias)

    }


    async getSequence():Promise<Sequence> {

        let res = await this.ice.get(`/rest/parts/${this.id}/sequence`)

        return new Sequence(this.ice, res)
    }

    async getSBOL2():Promise<SBOL2Graph> {

        let res = await this.ice.getText(`/rest/file/${this.id}/sequence/sbol2`, 'application/rdf+xml')

        return await SBOL2Graph.loadString(res, 'http://ice/', 'application/rdf+xml')
    }


}

