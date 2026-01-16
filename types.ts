export type UserRole = 'CONTRACTOR' | 'WORKER';

export interface User {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    role: UserRole;
}

export type SiteStatus = 'ONGOING' | 'COMPLETED';

export interface Site {
    id: string;
    name: string;
    clientName: string;
    startDate: string; // ISO Date
    expectedEndDate: string; // ISO Date
    status: SiteStatus;
    estimatedBudget: number;
}

export type WorkerRole = 'MISTRI' | 'HELPER';

export interface Worker {
    id: string;
    name: string;
    role: WorkerRole;
    dailyWage: number;
    mobile: string;
    email?: string;
}

export interface AttendanceRecord {
    id: string;
    siteId: string;
    workerId: string;
    date: string; // ISO Date YYYY-MM-DD
    isPresent: boolean;
    wageSnapshot: number; // Wage at that time
}

export interface MaterialExpense {
    id: string;
    siteId: string;
    name: string;
    quantity: string;
    cost: number;
    date: string; // ISO Date
}

export type PaymentMode = 'CASH' | 'UPI' | 'BANK';
export type PaymentType = 'INCOME' | 'EXPENSE'; // Income from client, Expense to worker

export interface Payment {
    id: string;
    type: PaymentType;
    relatedId: string; // siteId for INCOME, workerId for EXPENSE
    amount: number;
    date: string; // ISO Date
    mode: PaymentMode;
    notes?: string;
}
