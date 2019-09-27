
import fetch from 'cross-fetch'
import extend = require('xtend')
import urljoin = require('url-join')

import Collection from './Collection'
import Folder from './Folder'
import Entry from './Entry'

import { expectString, expectNumber, expectBool } from './expect'

export default class ICE {

	private url:string
	private email:string
	private password:string
	private sessionId:string

	userFirstName:string
	userLastName:string
	userIsAdmin:boolean
	userNewMessageCount:number

	constructor(url:string, email:string, password:string) {
		this.url = url
		this.email = email
		this.password = password
		this.sessionId = ''
	}

	async login():Promise<void> {
		console.error('ICE login')
		let res = await fetch(urljoin(this.url, '/rest/accesstokens'), {
			method: 'POST',
			body: JSON.stringify({
				email: this.email,
				password: this.password
			}),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}	
		})
        console.error('login returned ' + res.status)
        if(res.status !== 200) {
            throw new Error('not ok')
        }
		console.error('waitign for login res text')
		let b = await res.text()
		console.error('got')
		//console.log(b)
		let body = JSON.parse(b)
		this.sessionId = expectString(body.sessionId)
		this.userFirstName = expectString(body.firstName)
		this.userLastName = expectString(body.lastName)
		this.userIsAdmin = expectBool(body.isAdmin)
		this.userNewMessageCount = expectNumber(body.newMessageCount)
	}

	async get(url:string, statusHandlers?:any):Promise<any> {

		console.error('get ' + url)

		if(this.sessionId === '') {
			await this.login()
		}



		let res = await fetch(urljoin(this.url, url), {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-ICE-Authentication-SessionId': this.sessionId
			}
		})

		console.log(url, 'returned', res.status)
        if(res.status !== 200) {
            if(statusHandlers && statusHandlers[res.status] !== undefined)
                return statusHandlers[res.status]
            throw new Error('not ok')
        }
		let b = await res.text()
		//console.log(b)
		let body = JSON.parse(b)

		return body
	}

	async getText(url:string, mimeType:string):Promise<string> {

		console.error('get ' + url)

		if(this.sessionId === '') {
			await this.login()
		}


		let res = await fetch(urljoin(this.url, url), {
			method: 'GET',
			headers: {
				'Accept': mimeType,
				'X-ICE-Authentication-SessionId': this.sessionId
			}
		})

		console.log(url, 'returned', res.status)

		return await res.text()

    }

    async getCollection(collectionType:string):Promise<Collection> {

        return new Collection(this, collectionType)
    }

    async getCollections():Promise<Collection[]> {

        /*
        let counts = await this.get('/rest/collections/counts')

        return Object.keys(counts).map((k) => {
            return new Collection(this, k)
        })
       */

      return [ new Collection(this, 'FEATURED') ]
    }


    async getFolder(id:number):Promise<Folder> {

        let f:any = await this.get(`/rest/folders/${id}`, { 404: null })

        if(f)
            return new Folder(this, null, f)


        let collections = await this.getCollections()

        let r = await Promise.all(collections.map(async (c) => {
            return { c, res: await this.get(`/rest/collections/${c.collectionType.toUpperCase()}/folders/${id}`, { 404: null }) }
        }))

        for(let res of r) {
            if(res.res !== null) {
                return new Folder(this, res.c, res.res)
            }
        }
        
        throw new Error('cant get folder')
    }

    async getPart(id:number):Promise<Entry> {

        let p:any = await this.get(`/rest/parts/${id}`)

        return new Entry(this, p)

    }

}

