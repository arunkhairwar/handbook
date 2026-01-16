import { create } from 'zustand';
import { AttendanceRecord, MaterialExpense, Payment, Site, User, Worker } from '../types';

interface AppState {
    user: User | null;
    sites: Site[];
    workers: Worker[];
    attendance: AttendanceRecord[];
    expenses: MaterialExpense[];
    payments: Payment[];

    // Actions
    login: (email: string, password: string) => boolean;
    register: (user: Omit<User, 'id'>, password: string) => boolean;
    logout: () => void;

    addSite: (site: Site) => void;
    updateSiteStatus: (id: string, status: Site['status']) => void;

    addWorker: (worker: Worker) => void;

    markAttendance: (record: AttendanceRecord) => void;

    addExpense: (expense: MaterialExpense) => void;

    addPayment: (payment: Payment) => void;
}

// Dummy Data
const MOCK_SITES: Site[] = [
    {
        id: 's1',
        name: 'Sharma Villa Renovation',
        clientName: 'Mr. Sharma',
        startDate: '2023-10-01',
        expectedEndDate: '2023-12-15',
        status: 'ONGOING',
        estimatedBudget: 500000,
    },
    {
        id: 's2',
        name: 'Green Park Apt 402',
        clientName: 'Mrs. Gupta',
        startDate: '2023-11-10',
        expectedEndDate: '2023-11-25',
        status: 'COMPLETED',
        estimatedBudget: 120000,
    },
];

const MOCK_WORKERS: Worker[] = [
    { id: 'w1', name: 'Raju Mistri', role: 'MISTRI', dailyWage: 1200, mobile: '9876543210', email: 'raju@sitekhata.com' },
    { id: 'w2', name: 'Sonu Helper', role: 'HELPER', dailyWage: 600, mobile: '9876543211', email: 'sonu@sitekhata.com' },
    { id: 'w3', name: 'Amit Mistri', role: 'MISTRI', dailyWage: 1100, mobile: '9876543212', email: 'amit@sitekhata.com' },
];

export const useStore = create<AppState>((set, get) => ({
    user: null,
    sites: MOCK_SITES,
    workers: MOCK_WORKERS,
    attendance: [],
    expenses: [],
    payments: [],

    login: (email, password) => {
        // Mock Logic
        if (email === 'admin@sitekhata.com' && password === '123456') {
            set({ user: { id: 'admin', name: 'Contractor', mobile: '9999999999', email, role: 'CONTRACTOR' } });
            return true;
        }

        // Simple password check for workers (unsafe for real app, okay for mock)
        const worker = get().workers.find(w => w.email === email);
        if (worker && password === '123456') {
            set({ user: { id: worker.id, name: worker.name, mobile: worker.mobile, email, role: 'WORKER' } });
            return true;
        }
        return false;
    },

    register: (userData, password) => {
        // Mock Registration
        const newUser: User = {
            id: `u${Date.now()}`,
            ...userData,
        };
        // Auto login
        set({ user: newUser });
        return true;
    },

    logout: () => set({ user: null }),

    addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),

    updateSiteStatus: (id, status) => set((state) => ({
        sites: state.sites.map(s => s.id === id ? { ...s, status } : s)
    })),

    addWorker: (worker) => set((state) => ({ workers: [...state.workers, worker] })),

    markAttendance: (record) => set((state) => {
        // Remove existing if logs for same day/worker/site exist? For now just append or replace
        const filtered = state.attendance.filter(a => !(a.workerId === record.workerId && a.date === record.date && a.siteId === record.siteId));
        return { attendance: [...filtered, record] };
    }),

    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),

    addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
}));
