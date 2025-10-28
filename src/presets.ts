import {
	type CompanionButtonPresetDefinition,
	type CompanionTextPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'

import type { NWSInstance } from './main.js'

export function UpdatePresets(self: NWSInstance): void {
	const presets: (CompanionButtonPresetDefinition | CompanionTextPresetDefinition)[] = []

	self.setPresetDefinitions(presets as unknown as CompanionPresetDefinitions)
}
