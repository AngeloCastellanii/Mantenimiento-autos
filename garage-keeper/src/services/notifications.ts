import type { MaintenanceAlert } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function notifyCriticalAlerts(alerts: MaintenanceAlert[]) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const criticals = alerts.filter(a => a.severity === 'critical');
  
  if (criticals.length === 0) return;

  // Para no spamear, solo enviamos una notificación resumiendo.
  // Podríamos guardar en localStorage la última vez que notificamos para no molestar.
  const LAST_NOTIFIED_KEY = 'carroservizio_last_notified';
  const lastNotified = localStorage.getItem(LAST_NOTIFIED_KEY);
  
  const today = new Date().toISOString().split('T')[0];
  if (lastNotified === today) return; // Ya notificamos hoy

  const title = `🚨 ${criticals.length} servicio(s) vencido(s)`;
  const body = criticals.map(c => `${c.vehicleAlias}: ${c.message}`).join('\n');

  new Notification(title, {
    body,
    icon: '/favicon.svg',
    tag: 'critical-alerts',
  });

  localStorage.setItem(LAST_NOTIFIED_KEY, today);
}
