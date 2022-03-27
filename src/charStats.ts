import cheerio from 'cheerio'
import fetch from 'node-fetch'
import path from 'path'

type ExportCharacter = {
	'Base Stats'?: Character,
	'Growth Rates'?: Character,
	'Max Stats'?: Character
}
type Character = {
	hp:  number,
	str: number,
	mag: number,
	dex: number,
	spd: number,
	lck: number,
	def: number,
	res: number,
	cha: number
}
type CharacterList = { [name: string]: Character }
type StatType = 'growth' | 'base' | 'max'

async function getStats(characterName: string, type: StatType ) {
	let url = 'https://serenesforest.net/three-houses/characters/'

	if (type == 'growth') {
		url = path.join(url, 'growth-rates')
	} else if (type == 'base') {
		url = path.join(url, 'base-stats')
	} else if (type == 'max') {
		url = path.join(url, 'maximum-stats')
	} else {
		throw('Invalid Stat Type')
	}

	const html = await fetch(url)

	if (html.status != 200)
		throw('Failed request, Status: ' + html.status)

	let characters: CharacterList = {}

	const $ = cheerio.load(await html.text())
	const entry = $('div.entry')

	entry.children('table')
		.children('tbody')
		.children('tr')
		.each((i, e) => {
			let character: Character = {
				hp:  0,
				str: 0,
				mag: 0,
				dex: 0,
				spd: 0,
				lck: 0,
				def: 0,
				res: 0,
				cha: 0
			}

			const name = $(e).children('td:first').text()
			if (name == '') return

			$(e).children('td').each((i, e)  => {
				const attribute = parseInt($(e).text())
				switch (i){
					case 0:
						break;
					case 1:
						character.hp = attribute
						break;
					case 2:
						character.str = attribute
						break;
					case 3:
						character.mag = attribute
						break;
					case 4:
						character.dex = attribute
						break;
					case 5:
						character.spd  = attribute
						break;
					case 6:
						character.lck = attribute
						break;
					case 7:
						character.def = attribute
						break;
					case 8:
						character.res = attribute
						break;
					case 9:
						character.cha = attribute
						break;
					default:
						console.log('unknown attribute', i, attribute)
						break;
				}
				characters[name] = character
			}) // end each for td
		}) //end each for tr
	return characters[characterName]
}

export default async function stats(character: string): Promise<ExportCharacter> {
	const base = await getStats(character, 'base')
	const growth = await getStats(character, 'growth')
	const max = await getStats(character, 'max')
	return { 'Base Stats': base, 'Growth Rates': growth, 'Max Stats': max }
}