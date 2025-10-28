import { InstanceStatus } from '@companion-module/base'
import type { NWSInstance } from './main.js'
import { UpdateVariableDefinitions } from './variables.js'

const ALERT_POLL_INTERVAL_MS = 60000 // 1 minute

export async function InitConnection(self: NWSInstance): Promise<void> {
	try {
		if (self.config.locationType === 'latlong') {
			self.updateStatus(InstanceStatus.Connecting, 'Resolving zone from lat/lon...')

			self.setVariableValues({ latitude: self.config.latitude, longitude: self.config.longitude })

			const zoneId = await resolveZoneId(self)
			if (!zoneId) {
				self.log('error', 'Could not resolve zone ID from lat/long')
				self.updateStatus(InstanceStatus.ConnectionFailure, 'Zone resolution failed')
				return
			}
			self.zoneId = zoneId
		} else {
			self.zoneId = self.config.zoneId
		}

		self.setVariableValues({ zoneid: self.zoneId })

		self.updateStatus(InstanceStatus.Ok, `Zone: ${self.zoneId}`)

		//create variables based on selected event types
		self.log('debug', 'Creating variables based on selected event types')
		UpdateVariableDefinitions(self)

		startPolling(self)
	} catch (err) {
		self.log('error', `Init failed: ${err}`)
		self.updateStatus(InstanceStatus.ConnectionFailure, 'Zone resolution failed')
	}
}

async function resolveZoneId(self: NWSInstance): Promise<string | null> {
	const { latitude, longitude } = self.config

	if (!latitude || !longitude) {
		self.log('error', 'Latitude and Longitude are required')
	}

	const url = `https://api.weather.gov/points/${latitude},${longitude}`

	const res = await fetch(url)
	if (!res.ok) {
		self.log('error', `Failed to resolve zone: ${res.status}`)
		return null
	}

	const data = (await res.json()) as any
	const forecastZoneUrl = data?.properties?.forecastZone
	if (!forecastZoneUrl) return null

	const parts = forecastZoneUrl.split('/')
	return parts[parts.length - 1] || null
}

function startPolling(self: NWSInstance): void {
	RequestData(self)
	self.pollingInterval = setInterval(() => RequestData(self), ALERT_POLL_INTERVAL_MS)
}

export async function RequestData(self: NWSInstance): Promise<void> {
	if (!self.zoneId) {
		self.log('warn', 'Zone ID not available yet')
		return
	}

	const url = `https://api.weather.gov/alerts/active/zone/${self.zoneId}`

	try {
		const res = await fetch(url)
		if (!res.ok) {
			self.log('error', `Fetch failed: ${res.status}`)
			return
		}
		const data = await res.json()

		ProcessData(self, data)
	} catch (err) {
		self.log('error', `Polling error: ${err}`)
	}
}

export function ProcessData(self: NWSInstance, data: any): void {
	if (self.config.verbose) {
		self.log('debug', `Processing data: ${JSON.stringify(data)}`)
	}

	self.data = data

	if (!data?.features || !Array.isArray(data.features)) {
		self.log('warn', `No valid features found for Zone: ${self.zoneId}`)
		return
	}

	//clear all variables first and then repopulate
	let variableObj: { [key: string]: string } = {}

	for (const eventType of self.config.eventTypes) {
		variableObj[`alert_${eventType}_id`] = ''
		variableObj[`alert_${eventType}_status`] = ''
		variableObj[`alert_${eventType}_messageType`] = ''
		variableObj[`alert_${eventType}_category`] = ''
		variableObj[`alert_${eventType}_response`] = ''
		variableObj[`alert_${eventType}_severity`] = ''
		variableObj[`alert_${eventType}_certainty`] = ''
		variableObj[`alert_${eventType}_urgency`] = ''
		variableObj[`alert_${eventType}_areaDesc`] = ''
		variableObj[`alert_${eventType}_sent`] = ''
		variableObj[`alert_${eventType}_effective`] = ''
		variableObj[`alert_${eventType}_onset`] = ''
		variableObj[`alert_${eventType}_expires`] = ''
		variableObj[`alert_${eventType}_ends`] = ''
		variableObj[`alert_${eventType}_headline`] = ''
		variableObj[`alert_${eventType}_description`] = ''
		variableObj[`alert_${eventType}_instruction`] = ''
		variableObj[`alert_${eventType}_web`] = ''
		variableObj[`alert_${eventType}_senderName`] = ''
	}

	for (const feature of data.features) {
		const alert = feature.properties
		const eventTypeId = slugify(alert.event)

		if (alert.id && alert.event && self.config.eventTypes?.includes(eventTypeId)) {
			self.log('info', `🚨 Alert triggered: ${alert.event}`)

			variableObj[`alert_${eventTypeId}_id`] = alert.id
			variableObj[`alert_${eventTypeId}_status`] = alert.status
			variableObj[`alert_${eventTypeId}_messageType`] = alert.messageType
			variableObj[`alert_${eventTypeId}_category`] = alert.category
			variableObj[`alert_${eventTypeId}_response`] = alert.response
			variableObj[`alert_${eventTypeId}_severity`] = alert.severity
			variableObj[`alert_${eventTypeId}_certainty`] = alert.certainty
			variableObj[`alert_${eventTypeId}_urgency`] = alert.urgency
			variableObj[`alert_${eventTypeId}_areaDesc`] = alert.areaDesc
			variableObj[`alert_${eventTypeId}_sent`] = alert.sent
			variableObj[`alert_${eventTypeId}_effective`] = alert.effective
			variableObj[`alert_${eventTypeId}_onset`] = alert.onset
			variableObj[`alert_${eventTypeId}_expires`] = alert.expires
			variableObj[`alert_${eventTypeId}_ends`] = alert.ends
			variableObj[`alert_${eventTypeId}_headline`] = alert.headline
			variableObj[`alert_${eventTypeId}_description`] = alert.description
			variableObj[`alert_${eventTypeId}_instruction`] = alert.instruction
			variableObj[`alert_${eventTypeId}_web`] = alert.web
			variableObj[`alert_${eventTypeId}_senderName`] = alert.senderName
		}
	}

	self.setVariableValues(variableObj)
	self.checkFeedbacks()
}

export function slugify(label: string): string {
	return label.replace(/[^a-zA-Z0-9]/g, '')
}
