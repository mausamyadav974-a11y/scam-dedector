import { ScanHistoryItem } from '../types';

const STORAGE_KEY_HISTORY = 'truthguard_local_history';
const STORAGE_KEY_LANG = 'truthguard_user_lang';
const MAX_HISTORY_ITEMS = 50;

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local scan history:', err);
    return [];
  }
}

export function saveScanToHistory(item: ScanHistoryItem): void {
  try {
    const existing = getScanHistory();
    // Prevent duplicates
    const filtered = existing.filter(i => i.id !== item.id);
    filtered.unshift(item);
    if (filtered.length > MAX_HISTORY_ITEMS) {
      filtered.pop();
    }
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save to local history:', err);
  }
}

export function deleteScanFromHistory(id: string): void {
  try {
    const existing = getScanHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item:', err);
  }
}

export function clearAllScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.error('Failed to clear local scan history:', err);
  }
}

export function getStoredLanguage(): 'en' | 'hi' {
  try {
    const lang = localStorage.getItem(STORAGE_KEY_LANG);
    return lang === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function setStoredLanguage(lang: 'en' | 'hi'): void {
  try {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  } catch (err) {
    console.error('Failed to save language preference:', err);
  }
}
