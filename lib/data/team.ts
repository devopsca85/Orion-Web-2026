export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
}

export const leadership: TeamMember[] = [
  {
    name: 'Rajiv Nair',
    role: 'Chief Executive Officer',
    bio: 'Rajiv brings over 20 years of technology leadership experience, having led digital transformation initiatives for Fortune 500 companies across financial services, healthcare, and manufacturing.',
    avatar: '/assets/images/team/rajiv.jpg',
    linkedin: 'https://www.linkedin.com/in/',
  },
  {
    name: 'Elena Vasquez',
    role: 'Chief Technology Officer',
    bio: 'Elena is a hands-on engineering leader with deep expertise in cloud-native architecture, distributed systems, and developer experience. She holds patents in distributed computing.',
    avatar: '/assets/images/team/elena.jpg',
    linkedin: 'https://www.linkedin.com/in/',
  },
  {
    name: 'David Park',
    role: 'VP of Delivery',
    bio: 'David oversees all client delivery operations, ensuring projects are delivered on time, on budget, and to the highest quality standards. He is a certified PMP and SAFe practitioner.',
    avatar: '/assets/images/team/david.jpg',
    linkedin: 'https://www.linkedin.com/in/',
  },
  {
    name: 'Samira Al-Hassan',
    role: 'VP of Business Development',
    bio: 'Samira leads Orion Solutions\' growth strategy, building relationships with enterprise clients and technology partners to expand our reach and service offerings.',
    avatar: '/assets/images/team/samira.jpg',
    linkedin: 'https://www.linkedin.com/in/',
  },
];

export const stats = [
  { label: 'Years in Business', value: '12+' },
  { label: 'Enterprise Clients', value: '150+' },
  { label: 'Engineers & Consultants', value: '200+' },
  { label: 'Projects Delivered', value: '500+' },
  { label: 'Countries Served', value: '18' },
  { label: 'Client Satisfaction', value: '98%' },
];
