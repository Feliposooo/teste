export interface Visitor {
  id: number;
  name: string;
  residenceNumber: string;
  status: 'inside' | 'outside';
  entryTime: string;
}

const VISITORS_STORAGE_KEY = "condo_visitors";

export function getVisitors(): Visitor[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(VISITORS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveVisitors(visitors: Visitor[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(visitors));
}

export function addVisitor(visitor: Visitor): void {
  const visitors = getVisitors();
  visitors.push(visitor);
  saveVisitors(visitors);
}

export function updateVisitor(updatedVisitor: Visitor): void {
  const visitors = getVisitors().map(visitor =>
    visitor.id === updatedVisitor.id ? updatedVisitor : visitor
  );
  saveVisitors(visitors);
}

export function deleteVisitor(visitorId: number): void {
  const visitors = getVisitors().filter(visitor => visitor.id !== visitorId);
  saveVisitors(visitors);
}
