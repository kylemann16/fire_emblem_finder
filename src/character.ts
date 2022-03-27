import yargs from 'yargs'

import stats from './charStats.js'
import info from './charInfo.js'
import talents from './charTalents.js'

type CharacterArguments = {
	name?: string,
	list?: boolean
}
const c: yargs.CommandModule = {
	command: 'character',
	describe: 'Get info about available characters.',
	handler: async (args: yargs.Arguments<CharacterArguments>) => {
		if (args.list)
			return
		if (!args.name)
			throw('Must supply a character name.')

		const characterName = args.name
		const charStats = await stats(characterName)
		const charInfo = await info(characterName)
		const charTalents = await talents(characterName)

		console.log(characterName)
		console.log('\nBackground')
		console.log(charInfo.Background)
		console.log('\nCharacter Information')
		console.table(charInfo.Info)
		console.log('Stats')
		console.table(charStats)
		console.log('Budding Talent')
		console.table(charTalents)
	},
	builder: {
		'list': {
			type: 'boolean',
			default: false
		},
		'name': {
			type: 'string'
		}
	}
}

export default c
