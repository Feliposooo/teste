export interface User {
  id: number;
  name: string;
  role: 'admin' | 'resident';
  login: string;
  password: string;
}

export interface Visitor {
  id: number;
  name: string;
  document: string;
  visitDate: string;
}

const USERS_KEY = 'users';
const VISITORS_KEY = 'visitors';
const LOGGED_IN_USER_KEY = 'loggedInUser';

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getVisitors(): Visitor[] {
  const data = localStorage.getItem(VISITORS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveVisitors(visitors: Visitor[]): void {
  localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
}

export function addVisitor(visitor: Visitor): void {
  const visitors = getVisitors();
  visitors.push(visitor);
  saveVisitors(visitors);
}

export function getLoggedInUser(): User | null {
  const data = localStorage.getItem(LOGGED_IN_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setLoggedInUser(user: User): void {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
}

export function initializeDefaultUsers(): void {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUser: User = {
      id: 1,
      name: 'Administrador',
      role: 'admin',
      login: 'admin',
      password: 'admin123',
    };
    saveUsers([defaultUser]);
  }
}
