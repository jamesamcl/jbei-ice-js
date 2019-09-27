
import { expectString, expectNumber, expectBool, expectArray } from './expect'

import ICE from './ICE'

export class Feature {

    id:number
    type:string
    name:string
    strand:number
    notes:Note[]

    constructor(f:any) {

        this.id = expectNumber(f.id)
        this.type = expectString(f.type)
        this.name = expectString(f.name)
        this.strand = expectNumber(f.strand)
        this.notes = expectArray(f.notes).map((note) => {
            return new Note(note)
        })

    }
}

export class Note {

    name:string
    value:string
    quoted:boolean

    constructor(n:any) {
        this.name = expectString(n.name)
        this.value = expectString(n.value)
        this.quoted = expectBool(n.quoted)
    }

}

export class Location {
    genbankStart:number
    end:number

    constructor(l:any) {

        this.genbankStart = expectNumber(l.genbankStart)
        this.end = expectNumber(l.end)

    }
}

export default class Sequence {

    ice:ICE

    identifier:string
    name:string
    isCircular:boolean
    uri:string
    canEdit:boolean
    length:number
    organism:string
    sequence:string
    features:Feature[]

    constructor(ice:ICE, s:any) {

        this.ice = ice

        this.identifier = expectString(s.identifier)
        this.name = expectString(s.name)
        this.isCircular = expectBool(s.isCircular)
        this.uri = expectString(s.uri)
        this.canEdit = expectBool(s.canEdit)
        this.length = expectNumber(s.length)
        this.organism = expectString(s.organism)
        this.sequence = expectString(s.sequence)
        this.features = expectArray(s.features).map((f) => new Feature(f))
    }
}


