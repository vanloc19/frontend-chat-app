const LOCAL_DEVICE_ID_KEY = 'chat_app_device_id'

function generateDeviceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getOrCreateDeviceId() {
  const current = localStorage.getItem(LOCAL_DEVICE_ID_KEY)
  if (current) {
    return current
  }

  const created = generateDeviceId()
  localStorage.setItem(LOCAL_DEVICE_ID_KEY, created)
  return created
}

export function getDeviceInfo() {
  return {
    deviceId: getOrCreateDeviceId(),
    platform: navigator.platform || 'WEB',
    deviceName: navigator.userAgentData?.platform || 'Web Browser',
    osVersion: navigator.userAgent || 'unknown',
    fcmToken: null,
  }
}
