import cheerio from 'cheerio'
import fetch from 'node-fetch'

type ExportTalent = {
	'Budding Talent': Talent
}
type Talent = {
	skillLevel: string,
	unlock: string,
	description: string
}
type TalentList = { [name: string]: Talent }

async function getTalents(characterName: string) {
	let url = 'https://serenesforest.net/three-houses/characters/budding-talents'

	const html = await fetch(url)

	if (html.status != 200)
		throw('Failed request, Status: ' + html.status)

	let talents: TalentList = {}
	const $ = cheerio.load(await html.text())
	const entry = $('div.entry')

	entry.children('table')
		.children('tbody')
		.children('tr')
		.each((i, e) => {
			let talent: Talent = {
				skillLevel: '',
				unlock: '',
				description: ''
			}

			const name = $(e).children('td:first').text()
			if (name == '') return

			$(e).children('td').each((i, e)  => {
				const attribute = $(e).text()
				switch (i){
					case 0:
						break;
					case 1:
						talent.skillLevel = attribute
						break;
					case 2:
						talent.unlock = attribute
						break;
					case 3:
						talent.description = attribute
						break;
					default:
						console.log('unknown attribute', i, attribute)
						break;
				}
				talents[name] = talent
			}) // end each for td
		}) //end each for tr
	return talents[characterName]
}

export default async function talents(character: string): Promise<ExportTalent>{
	const talent = await getTalents(character)
	return { 'Budding Talent': talent }
}