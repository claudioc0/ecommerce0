import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana Premium',
    email: 'ana@premium.com',
    phone: '(11) 99999-1111',
    role: 'premium_customer',
    plan: 'Premium',
    preferences: {
      newsletter: true,
      promotions: true
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '2',
    name: 'Carlos Vendedor',
    email: 'carlos@seller.com',
    phone: '(11) 99999-2222',
    role: 'seller',
    plan: 'Business',
    preferences: {
      newsletter: true,
      promotions: false
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-01T11:20:00Z'
  },
  {
    id: '3',
    name: 'Maria Estoque',
    email: 'maria@warehouse.com',
    phone: '(11) 99999-3333',
    role: 'warehouse_manager',
    plan: 'Business',
    preferences: {
      newsletter: false,
      promotions: false
    },
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-02-01T16:45:00Z'
  },
  {
    id: '4',
    name: 'João Marketing',
    email: 'joao@marketing.com',
    phone: '(11) 99999-4444',
    role: 'marketing_manager',
    plan: 'Business',
    preferences: {
      newsletter: true,
      promotions: true
    },
    createdAt: '2024-01-25T07:30:00Z',
    updatedAt: '2024-02-01T13:15:00Z'
  },
  {
    id: '5',
    name: 'Sofia Atendimento',
    email: 'sofia@support.com',
    phone: '(11) 99999-5555',
    role: 'customer_service',
    plan: 'Standard',
    preferences: {
      newsletter: false,
      promotions: true
    },
    createdAt: '2024-01-30T12:00:00Z',
    updatedAt: '2024-02-01T09:30:00Z'
  },
  {
    id: '6',
    name: 'Roberto Analista',
    email: 'roberto@analytics.com',
    phone: '(11) 99999-6666',
    role: 'analyst',
    plan: 'Business',
    preferences: {
      newsletter: true,
      promotions: false
    },
    createdAt: '2024-02-01T06:00:00Z',
    updatedAt: '2024-02-01T15:20:00Z'
  },
  {
    id: '7',
    name: 'Fernanda Parceira',
    email: 'fernanda@brand.com',
    phone: '(11) 99999-7777',
    role: 'brand_partner',
    plan: 'Enterprise',
    preferences: {
      newsletter: true,
      promotions: true
    },
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-02-01T12:40:00Z'
  },
  {
    id: '8',
    name: 'Influencer Bella',
    email: 'bella@influence.com',
    phone: '(11) 99999-8888',
    role: 'influencer',
    plan: 'Creator',
    preferences: {
      newsletter: true,
      promotions: true
    },
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-02-01T17:10:00Z'
  },
  {
    id: '9',
    name: 'Pedro Franquia',
    email: 'pedro@franchise.com',
    phone: '(11) 99999-9999',
    role: 'franchise_owner',
    plan: 'Enterprise',
    preferences: {
      newsletter: false,
      promotions: false
    },
    createdAt: '2024-01-08T13:45:00Z',
    updatedAt: '2024-02-01T18:00:00Z'
  },
  {
    id: '10',
    name: 'Luana Cliente',
    email: 'luana@customer.com',
    phone: '(11) 99999-0000',
    role: 'customer',
    plan: 'Free',
    preferences: {
      newsletter: true,
      promotions: true
    },
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-01T10:15:00Z'
  },
  {
    id: '11',
    name: 'Ricardo Lojista',
    email: 'ricardo@lojista.com',
    phone: '(11) 99999-1010',
    role: 'store_owner',
    plan: 'Business Pro',
    preferences: {
      newsletter: true,
      promotions: false
    },
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-02-01T19:30:00Z'
  }
];