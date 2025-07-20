import { User, Visitor, Correspondence, Communication } from '@/types/auth';

const STORAGE_KEYS = {
  USERS: 'condominium_users',
  VISITORS: 'condominium_visitors', 
  CORRESPONDENCES: 'condominium_correspondences',
  COMMUNICATIONS: 'condominium_communications'
};

// Initialize default data
const initializeDefaultData = () => {
  // Default admin user
  const defaultUsers: User[] = [
    {
      id: 'admin-001',
      login: 'admin',
      password: 'admin123',
      type: 'admin',
      name: 'Administrador',
      email: 'admin@condominio.com'
    },
    {
      id: 'res-001',
      login: 'apt101',
      password: '123456',
      type: 'resident',
      residenceNumber: '101',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999'
    },
    {
      id: 'res-002',
      login: 'apt102',
      password: '123456',
      type: 'resident',
      residenceNumber: '102',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 88888-8888'
    }
  ];

  const defaultCommunications: Communication[] = [
    {
      id: 'comm-001',
      title: 'Manutenção do Elevador',
      content: 'Informamos que o elevador social passará por manutenção preventiva no dia 25/01/2024 das 8h às 17h. Pedimos a compreensão de todos.',
      date: new Date().toISOString(),
      author: 'Administração',
      priority: 'high'
    },
    {
      id: 'comm-002',
      title: 'Nova Política de Visitantes',
      content: 'A partir do próximo mês, todos os visitantes deverão ser cadastrados no sistema antes da visita. Consulte o regulamento completo na portaria.',
      date: new Date(Date.now() - 86400000).toISOString(),
      author: 'Síndico',
      priority: 'medium'
    }
  ];

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.VISITORS)) {
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CORRESPONDENCES)) {
    localStorage.setItem(STORAGE_KEYS.CORRESPONDENCES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.COMMUNICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(defaultCommunications));
  }
};

// Users
export const getUsers = (): User[] => {
  initializeDefaultData();
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUserByLogin = (login: string): User | null => {
  const users = getUsers();
  return users.find(user => user.login === login) || null;
};

// Visitors
export const getVisitors = (): Visitor[] => {
  const visitors = localStorage.getItem(STORAGE_KEYS.VISITORS);
  return visitors ? JSON.parse(visitors) : [];
};

export const saveVisitors = (visitors: Visitor[]) => {
  localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors));
};

export const addVisitor = (visitor: Omit<Visitor, 'id'>) => {
  const visitors = getVisitors();
  const newVisitor: Visitor = {
    ...visitor,
    id: `visitor-${Date.now()}`
  };
  visitors.push(newVisitor);
  saveVisitors(visitors);
  return newVisitor;
};

// Correspondences
export const getCorrespondences = (): Correspondence[] => {
  const correspondences = localStorage.getItem(STORAGE_KEYS.CORRESPONDENCES);
  return correspondences ? JSON.parse(correspondences) : [];
};

export const saveCorrespondences = (correspondences: Correspondence[]) => {
  localStorage.setItem(STORAGE_KEYS.CORRESPONDENCES, JSON.stringify(correspondences));
};

export const addCorrespondence = (correspondence: Omit<Correspondence, 'id'>) => {
  const correspondences = getCorrespondences();
  const newCorrespondence: Correspondence = {
    ...correspondence,
    id: `correspondence-${Date.now()}`
  };
  correspondences.push(newCorrespondence);
  saveCorrespondences(correspondences);
  return newCorrespondence;
};

// Communications
export const getCommunications = (): Communication[] => {
  const communications = localStorage.getItem(STORAGE_KEYS.COMMUNICATIONS);
  return communications ? JSON.parse(communications) : [];
};

export const saveCommunications = (communications: Communication[]) => {
  localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(communications));
};

export const addCommunication = (communication: Omit<Communication, 'id'>) => {
  const communications = getCommunications();
  const newCommunication: Communication = {
    ...communication,
    id: `communication-${Date.now()}`
  };
  communications.unshift(newCommunication); // Add to beginning
  saveCommunications(communications);
  return newCommunication;
};