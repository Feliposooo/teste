export interface User {
  id: string;
  login: string;
  password: string;
  type: 'admin' | 'resident';
  residenceNumber?: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Visitor {
  id: string;
  name: string;
  residenceNumber: string;
  entryTime: string;
  exitTime?: string;
  date: string;
  status: 'inside' | 'left';
}

export interface Correspondence {
  id: string;
  residenceNumber: string;
  type: 'package' | 'letter' | 'food_delivery' | 'other';
  description: string;
  date: string;
  status: 'waiting' | 'delivered';
  deliveredAt?: string;
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
}