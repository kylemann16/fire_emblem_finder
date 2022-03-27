import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import character from './character.js'

yargs(hideBin(process.argv))
	.command(character)
	.demandCommand(1)
	.parse()