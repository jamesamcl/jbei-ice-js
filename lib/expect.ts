
export function expectString(v:any):string {

	if(typeof(v) !== 'string')
		throw new Error('expected string but got ' + typeof(v) )

	return v as string
}

export function expectArray(v:any):any[] {

	if(!Array.isArray(v))
		throw new Error('expected array')

    return v as any[]
}

export function expectStringArray(v:any):string[] {

	if(!Array.isArray(v))
		throw new Error('expected array')

	for(let el of v) {
		if(typeof(v) !== 'string')
			throw new Error('expected string')
	}

	return v as string[]
}

export function expectNumber(v:any):number {

	if(typeof(v) !== 'number')
		throw new Error('expected number')

	return v as number
}

export function expectBool(v:any):boolean {

	if(typeof(v) !== 'boolean')
		throw new Error('expected boolean')

	return v as boolean
}





