import { CompanionActionDefinitions } from '@companion-module/base'
import type { NWSInstance } from './main.js'

export function UpdateActions(self: NWSInstance): void {
	const actions: CompanionActionDefinitions = {}

	self.setActionDefinitions(actions)
}
