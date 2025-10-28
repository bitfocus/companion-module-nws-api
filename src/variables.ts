import type { CompanionVariableDefinition } from '@companion-module/base'
import { CHOICES_EVENT_TYPES } from './constants.js'

import type { NWSInstance } from './main.js'

export function UpdateVariableDefinitions(self: NWSInstance): void {
	const variables: CompanionVariableDefinition[] = []

	if (self.config.locationType == 'latlong') {
		variables.push({
			variableId: 'latitude',
			name: 'Latitude',
		})
		variables.push({
			variableId: 'longitude',
			name: 'Longitude',
		})
	}

	//zoneid
	variables.push({ variableId: 'zoneid', name: 'Zone ID' })

	//build variables based on config
	for (const eventType of self.config.eventTypes) {
		//get name from event type constants
		let eventTypeLabel = CHOICES_EVENT_TYPES.find((choice) => choice.id === eventType)?.label

		variables.push({ variableId: `alert_${eventType}_id`, name: `${eventTypeLabel}: Alert ID` })
		variables.push({ variableId: `alert_${eventType}_status`, name: `${eventTypeLabel}: Alert Status` })
		variables.push({ variableId: `alert_${eventType}_messageType`, name: `${eventTypeLabel}: Alert Message Type` })
		variables.push({ variableId: `alert_${eventType}_category`, name: `${eventTypeLabel}: Alert Category` })
		variables.push({ variableId: `alert_${eventType}_response`, name: `${eventTypeLabel}: Alert Response` }) // Shelter, Evacuate, etc
		variables.push({ variableId: `alert_${eventType}_severity`, name: `${eventTypeLabel}: Alert Severity` }) // Severe, Extreme
		variables.push({ variableId: `alert_${eventType}_certainty`, name: `${eventTypeLabel}: Alert Certainty` })
		variables.push({ variableId: `alert_${eventType}_urgency`, name: `${eventTypeLabel}: Alert Urgency` })
		variables.push({ variableId: `alert_${eventType}_areaDesc`, name: `${eventTypeLabel}: Alert Area Description` })
		variables.push({ variableId: `alert_${eventType}_sent`, name: `${eventTypeLabel}: Alert Sent Time` })
		variables.push({ variableId: `alert_${eventType}_effective`, name: `${eventTypeLabel}: Alert Effective Time` })
		variables.push({ variableId: `alert_${eventType}_onset`, name: `${eventTypeLabel}: Alert Onset Time` })
		variables.push({ variableId: `alert_${eventType}_expires`, name: `${eventTypeLabel}: Alert Expiry Time` })
		variables.push({ variableId: `alert_${eventType}_ends`, name: `${eventTypeLabel}: Alert End Time` })
		variables.push({ variableId: `alert_${eventType}_headline`, name: `${eventTypeLabel}: Alert Headline` })
		variables.push({ variableId: `alert_${eventType}_description`, name: `${eventTypeLabel}: Alert Description` })
		variables.push({ variableId: `alert_${eventType}_instruction`, name: `${eventTypeLabel}: Alert Instruction` })
		variables.push({ variableId: `alert_${eventType}_web`, name: `${eventTypeLabel}: Alert Web Link` })
		variables.push({ variableId: `alert_${eventType}_senderName`, name: `${eventTypeLabel}: Alert Sender Name` })
	}

	self.setVariableDefinitions(variables)
}
