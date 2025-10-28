import type { SomeCompanionConfigField } from '@companion-module/base'
import { CHOICES_EVENT_TYPES } from './constants.js'

export interface ModuleConfig {
	locationType: string
	latitude: number
	longitude: number
	zoneId: string
	eventTypes: string[]
	verbose: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module communicates with the National Weather Service API',
		},
		//use lat long or zoneid
		{
			type: 'dropdown',
			id: 'locationType',
			label: 'Location Type',
			default: 'latlong',
			choices: [
				{ id: 'latlong', label: 'Latitude/Longitude' },
				{ id: 'zoneid', label: 'Zone ID' },
			],
			width: 4,
		},
		{
			type: 'textinput',
			id: 'latitude',
			label: 'Latitude',
			width: 4,
			default: '',
			isVisible: (config) => config.locationType === 'latlong',
		},
		{
			type: 'textinput',
			id: 'longitude',
			label: 'Longitude',
			width: 4,
			default: '',
			isVisible: (config) => config.locationType === 'latlong',
		},
		{
			type: 'textinput',
			id: 'zoneId',
			label: 'Zone ID',
			width: 4,
			default: '',
			isVisible: (config) => config.locationType === 'zoneid',
		},
		{
			type: 'multidropdown',
			id: 'eventTypes',
			label: 'Trigger on Event Types',
			default: [CHOICES_EVENT_TYPES[0].id],
			choices: CHOICES_EVENT_TYPES,
			minChoicesForSearch: 1,
			width: 12,
		},
		{
			type: 'static-text',
			id: 'hr1',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false,
			width: 4,
		},
	]
}
