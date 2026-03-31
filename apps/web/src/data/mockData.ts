import type { Service, CaseStudy } from '@/types';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Cloud Infrastructure',
    description: 'Design and implement scalable cloud solutions tailored to your business needs.',
    icon: 'Cloud',
    features: ['AWS/Azure/GCP Migration', 'Container Orchestration', 'Cloud Security'],
  },
  {
    id: '2',
    title: 'Cybersecurity',
    description: 'Protect your digital assets with comprehensive security assessments and solutions.',
    icon: 'Shield',
    features: ['Penetration Testing', 'Security Audits', 'Incident Response'],
  },
  {
    id: '3',
    title: 'Software Development',
    description: 'Custom software solutions built with modern technologies and best practices.',
    icon: 'Code',
    features: ['Web Applications', 'Mobile Apps', 'API Development'],
  },
  {
    id: '4',
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights with advanced analytics.',
    icon: 'BarChart',
    features: ['Business Intelligence', 'Predictive Analytics', 'Data Visualization'],
  },
  {
    id: '5',
    title: 'IT Consulting',
    description: 'Strategic technology guidance to drive business transformation.',
    icon: 'Users',
    features: ['Technology Strategy', 'Process Optimization', 'Team Training'],
  },
  {
    id: '6',
    title: 'DevOps Services',
    description: 'Streamline your development and operations with automated workflows.',
    icon: 'GitBranch',
    features: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging'],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    client: 'TechCorp Industries',
    industry: 'Manufacturing',
    challenge: 'Legacy systems causing 40% downtime and inefficient inventory management.',
    solution: 'Implemented cloud-based ERP system with real-time analytics and automated workflows.',
    results: [
      { metric: 'Downtime Reduction', value: '95%' },
      { metric: 'Cost Savings', value: '$2.5M/year' },
      { metric: 'Efficiency Increase', value: '60%' },
    ],
    testimonial: 'TechNova transformed our operations completely. The results exceeded our expectations.',
  },
  {
    id: '2',
    client: 'FinanceFirst Bank',
    industry: 'Financial Services',
    challenge: 'Outdated security infrastructure vulnerable to modern threats.',
    solution: 'Deployed zero-trust security architecture with AI-powered threat detection.',
    results: [
      { metric: 'Security Incidents', value: '-99%' },
      { metric: 'Compliance Score', value: '100%' },
      { metric: 'Threat Detection', value: '<5min' },
    ],
    testimonial: 'Our security posture is now industry-leading. Outstanding work by the team.',
  },
  {
    id: '3',
    client: 'HealthPlus Medical',
    industry: 'Healthcare',
    challenge: 'Fragmented patient data systems affecting care coordination.',
    solution: 'Built integrated healthcare platform with HIPAA-compliant data sharing.',
    results: [
      { metric: 'Patient Satisfaction', value: '+45%' },
      { metric: 'Data Access Time', value: '80% faster' },
      { metric: 'ROI', value: '320%' },
    ],
    testimonial: 'The new system has revolutionized how we deliver patient care.',
  },
  {
    id: '4',
    client: 'RetailGiant Co',
    industry: 'Retail',
    challenge: 'Poor online customer experience leading to cart abandonment.',
    solution: 'Developed omnichannel e-commerce platform with personalized recommendations.',
    results: [
      { metric: 'Conversion Rate', value: '+75%' },
      { metric: 'Revenue Growth', value: '$10M/year' },
      { metric: 'Customer Retention', value: '+40%' },
    ],
    testimonial: 'Our online sales have tripled since launch. Incredible transformation.',
  },
];