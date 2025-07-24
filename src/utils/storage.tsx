// src/utils/storage.tsx

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'resident';
  login: string;
  password: string;
}

export interface Correspondence {
  id: number;
  recipientId: number;
  description: string;
  receivedAt: string;
}

export interface Communication {
  id: number;
  title: string;
  message: string;
  date: string;
}

// USERS
export function getUsers(): User[] {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem('users', JSON.stringify(users));
}

export function getUserByLogin(login: string, password: string): User | undefined {
  return getUsers().find(u => u.login === login && u.password === password);
}

// CORRESPONDENCES
export function getCorrespondences(): Correspondence[] {
  const data = localStorage.getItem('correspondences');
  return data ? JSON.parse(data) : [];
}

export function saveCorrespondences(correspondences: Correspondence[]): void {
  localStorage.setItem('correspondences', JSON.stringify(correspondences));
}

export function addCorrespondence(correspondence: Correspondence): void {
  const correspondences = getCorrespondences();
  correspondences.push(correspondence);
  saveCorrespondences(correspondences);
}

// COMMUNICATIONS
export function getCommunications(): Communication[] {
  const data = localStorage.getItem('communications');
  return data ? JSON.parse(data) : [];
}

export function saveCommunications(communications: Communication[]): void {
  localStorage.setItem('communications', JSON.stringify(communications));
}

export function addCommunication(communication: Communication): void {
  const communications = getCommunications();
  communications.push(communication);
  saveCommunications(communications);
}
