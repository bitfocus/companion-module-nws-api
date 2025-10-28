import { CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import type { NWSInstance } from './main.js'
import { CHOICES_EVENT_TYPES } from './constants.js'
import { slugify } from './api.js'

export function UpdateFeedbacks(self: NWSInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	feedbacks.eventTypeExists = {
		type: 'boolean',
		name: 'Event Type Exists',
		description: 'If the event type exists in the zone',
		options: [
			{
				type: 'dropdown',
				label: 'Event Type',
				id: 'eventType',
				default: CHOICES_EVENT_TYPES[0].id,
				choices: CHOICES_EVENT_TYPES,
			},
		],
		defaultStyle: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(255, 0, 0) },
		callback: async (feedback) => {
			const eventType = feedback.options.eventType
			if (self.data.features) {
				for (const feature of self.data.features) {
					if (slugify(feature.properties.event) === eventType) {
						return true
					}
				}
			}

			return false
		},
	}

	self.setFeedbackDefinitions(feedbacks)
}
