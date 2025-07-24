export interface User {
  id: number;
  name: string;
  apartment: string;
  login?: string; // adicione essa propriedade se for usada para login
}

const STORAGE_KEY = "condo_users";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(updatedUser: User): void {
  const users = getUsers().map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  saveUsers(users);
}

export function deleteUser(userId: number): void {
  const users = getUsers().filter((user) => user.id !== userId);
  saveUsers(users);
}

// Função requerida pelo AuthContext.tsx
export function getUserByLogin(login: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.login === login);
}
