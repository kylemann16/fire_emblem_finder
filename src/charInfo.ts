import cheerio from 'cheerio'
import fetch from 'node-fetch'
import path from 'path'

type ExportInfo = {
	Info: Info,
	Background: string
}
type Info = {
	age: '',
	height: '',
	birthday: '',
	crests: '',
	voiceActors: ''
}

async function getInfo(characterName: string) {
	let url = 'https://serenesforest.net/three-houses/characters/'

	const html = await fetch(url)

	if (html.status != 200)
		throw('Failed request, Status: ' + html.status)

	const $ = cheerio.load(await html.text())
	const entry = $('div.entry')
	let info = {
		age: '',
		height: '',
		birthday: '',
		crests: '',
		voiceActors: ''
	}
	let background = ''
	entry.children('h5').each((i, e) => {
		if ($(e).text() != characterName) return

		//next is the info table
		background = $(e).next()
			.children('tbody')
			.children('tr')
			.children('td')
			.text()
		$(e).next().next()
			.children('tbody')
			.children('tr')
			.children('td')
			.each((i, e) => {
				const attribute = $(e).text()
				switch (i) {
					case 0:
						info.age = attribute
						break;
					case 1:
						info.height = attribute
						break;
					case 2:
						info.birthday = attribute
						break;
					case 3:
						info.crests = attribute
						break;
					case 4:
						info.voiceActors= attribute
						break;
					default:
						console.log('Unknown attribute', i, attribute)
						break;
				}

			})
	})
	return {
		Info: info,
		Background: background
	}

}

export default async function stats(character: string) {
	return await getInfo(character)
}