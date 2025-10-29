import { storage } from './storage';

export async function initializeSampleData() {
  // Check if data already exists
  const existingLeads = await storage.getAllLeads();
  if (existingLeads.length > 0) {
    console.log('Sample data already initialized');
    return;
  }

  console.log('Initializing sample data...');

  // Create 10 Leads
  const leadData = [
    { name: 'John Smith', email: 'john.smith@techcorp.com', phone: '+1-555-0101', company: 'TechCorp Inc', source: 'Website', status: 'New', assignedTo: 'exec', createdDate: '2025-10-15' },
    { name: 'Sarah Johnson', email: 'sarah.j@innovate.com', phone: '+1-555-0102', company: 'Innovate Solutions', source: 'Referral', status: 'In Progress', assignedTo: 'exec', createdDate: '2025-10-16' },
    { name: 'Michael Brown', email: 'mbrown@buildco.com', phone: '+1-555-0103', company: 'BuildCo Ltd', source: 'Cold Call', status: 'In Progress', assignedTo: 'exec', createdDate: '2025-10-18' },
    { name: 'Emily Davis', email: 'emily.d@startupx.io', phone: '+1-555-0104', company: 'StartupX', source: 'Social Media', status: 'Converted', assignedTo: 'exec', createdDate: '2025-10-20' },
    { name: 'Robert Wilson', email: 'rwilson@megasoft.com', phone: '+1-555-0105', company: 'MegaSoft Corp', source: 'Website', status: 'Converted', assignedTo: 'manager', createdDate: '2025-10-21' },
    { name: 'Jennifer Martinez', email: 'jen.m@cloudsys.com', phone: '+1-555-0106', company: 'CloudSys Technologies', source: 'Referral', status: 'New', assignedTo: 'exec', createdDate: '2025-10-22' },
    { name: 'David Lee', email: 'david.lee@dataflow.com', phone: '+1-555-0107', company: 'DataFlow Analytics', source: 'Website', status: 'In Progress', assignedTo: 'manager', createdDate: '2025-10-23' },
    { name: 'Lisa Anderson', email: 'landerson@webdev.io', phone: '+1-555-0108', company: 'WebDev Studio', source: 'Cold Call', status: 'Lost', assignedTo: 'exec', createdDate: '2025-10-24' },
    { name: 'James Taylor', email: 'jtaylor@enterprise.com', phone: '+1-555-0109', company: 'Enterprise Solutions', source: 'Social Media', status: 'New', assignedTo: 'exec', createdDate: '2025-10-25' },
    { name: 'Maria Garcia', email: 'maria.g@biztech.com', phone: '+1-555-0110', company: 'BizTech Consulting', source: 'Referral', status: 'In Progress', assignedTo: 'manager', createdDate: '2025-10-26' },
  ];

  for (const lead of leadData) {
    await storage.createLead({
      ...lead,
      source: lead.source as any,
      status: lead.status as any,
      notes: [
        { text: 'Initial contact made', timestamp: `${lead.createdDate}T10:00:00Z`, user: lead.assignedTo },
      ],
    });
  }

  console.log('Created 10 leads');

  // Convert 3 leads to clients (only 2 have Converted status initially)
  const leads = await storage.getAllLeads();
  const leadsToConvert = leads.filter(l => l.status === 'Converted');
  console.log(`Converting ${leadsToConvert.length} leads to clients`);
  
  for (const lead of leadsToConvert) {
    await storage.convertLeadToClient(lead.id);
  }

  // Create 3 more clients directly to have total of 5
  await storage.createClient({
    name: 'Patricia White',
    email: 'pwhite@globaltech.com',
    phone: '+1-555-0111',
    company: 'GlobalTech Industries',
    address: '100 Business Park Dr, Suite 200, San Francisco, CA 94107',
    createdDate: '2025-09-15',
  });

  await storage.createClient({
    name: 'Thomas Clark',
    email: 'tclark@innovateinc.com',
    phone: '+1-555-0112',
    company: 'Innovate Inc',
    address: '250 Tech Center, Floor 5, Austin, TX 78701',
    createdDate: '2025-09-20',
  });

  await storage.createClient({
    name: 'Angela Roberts',
    email: 'aroberts@futuretech.com',
    phone: '+1-555-0113',
    company: 'FutureTech Solutions',
    address: '500 Innovation Blvd, Seattle, WA 98101',
    createdDate: '2025-09-25',
  });

  console.log('Created clients');

  // Get all clients for quotations
  const clients = await storage.getAllClients();
  console.log(`Found ${clients.length} clients for quotations`);

  // Create 8 Quotations
  const quotations = [
    {
      clientId: clients[0].id,
      items: [
        { description: 'Web Development - Custom Portal', quantity: 1, unitPrice: 15000, amount: 15000 },
        { description: 'SEO Optimization Package', quantity: 6, unitPrice: 800, amount: 4800 },
      ],
      taxRate: 18,
      status: 'Draft' as const,
      createdBy: 'exec',
      createdDate: '2025-10-25',
      validUntil: '2025-11-25',
      notes: 'Standard payment terms: Net 30',
    },
    {
      clientId: clients[1].id,
      items: [
        { description: 'Mobile App Development', quantity: 1, unitPrice: 25000, amount: 25000 },
        { description: 'Backend API Integration', quantity: 1, unitPrice: 8000, amount: 8000 },
      ],
      taxRate: 18,
      status: 'Pending' as const,
      createdBy: 'exec',
      createdDate: '2025-10-26',
      validUntil: '2025-11-26',
      notes: 'Includes 3 months support',
    },
    {
      clientId: clients[2].id,
      items: [
        { description: 'Cloud Infrastructure Setup', quantity: 1, unitPrice: 12000, amount: 12000 },
        { description: 'Security Audit', quantity: 1, unitPrice: 5000, amount: 5000 },
      ],
      taxRate: 18,
      status: 'Approved' as const,
      createdBy: 'manager',
      createdDate: '2025-10-20',
      validUntil: '2025-11-20',
      notes: 'Priority project',
    },
    {
      clientId: clients[3].id,
      items: [
        { description: 'Digital Marketing Campaign', quantity: 3, unitPrice: 2500, amount: 7500 },
        { description: 'Content Creation', quantity: 10, unitPrice: 300, amount: 3000 },
      ],
      taxRate: 18,
      status: 'Approved' as const,
      createdBy: 'exec',
      createdDate: '2025-10-18',
      validUntil: '2025-11-18',
      notes: 'Quarterly package',
    },
    {
      clientId: clients[4].id,
      items: [
        { description: 'CRM Implementation', quantity: 1, unitPrice: 18000, amount: 18000 },
        { description: 'Training Sessions', quantity: 5, unitPrice: 800, amount: 4000 },
      ],
      taxRate: 18,
      status: 'Approved' as const,
      createdBy: 'manager',
      createdDate: '2025-10-22',
      validUntil: '2025-11-22',
      notes: 'Includes onboarding',
    },
    {
      clientId: clients[0].id,
      items: [
        { description: 'Website Redesign', quantity: 1, unitPrice: 8000, amount: 8000 },
      ],
      taxRate: 18,
      status: 'Draft' as const,
      createdBy: 'exec',
      createdDate: '2025-10-27',
      validUntil: '2025-11-27',
      notes: 'Modern responsive design',
    },
    {
      clientId: clients[2].id,
      items: [
        { description: 'E-commerce Platform', quantity: 1, unitPrice: 30000, amount: 30000 },
        { description: 'Payment Gateway Integration', quantity: 1, unitPrice: 3000, amount: 3000 },
      ],
      taxRate: 18,
      status: 'Pending' as const,
      createdBy: 'exec',
      createdDate: '2025-10-28',
      validUntil: '2025-11-28',
      notes: 'Full featured online store',
    },
    {
      clientId: clients[1].id,
      items: [
        { description: 'Data Analytics Dashboard', quantity: 1, unitPrice: 14000, amount: 14000 },
      ],
      taxRate: 18,
      status: 'Rejected' as const,
      createdBy: 'exec',
      createdDate: '2025-10-15',
      validUntil: '2025-11-15',
      notes: 'Custom reporting',
    },
  ];

  for (const quot of quotations) {
    const created = await storage.createQuotation(quot);
    if (quot.status === 'Approved') {
      await storage.approveQuotation(created.id, 'manager');
    } else if (quot.status === 'Pending') {
      await storage.updateQuotation(created.id, { status: 'Pending' });
    } else if (quot.status === 'Rejected') {
      await storage.rejectQuotation(created.id);
    }
  }

  console.log('Created 8 quotations');

  // Generate 5 Invoices from approved quotations
  const allQuotations = await storage.getAllQuotations();
  const approvedQuotations = allQuotations.filter(q => q.status === 'Approved').slice(0, 5);
  
  for (let i = 0; i < approvedQuotations.length; i++) {
    const quot = approvedQuotations[i];
    const dueDate = new Date('2025-11-27');
    
    const invoice = await storage.createInvoice({
      quotationId: quot.id,
      clientId: quot.clientId,
      items: quot.items,
      status: i < 2 ? 'Generated' : i < 3 ? 'Sent' : 'Paid',
      generatedDate: '2025-10-27',
      dueDate: dueDate.toISOString().split('T')[0],
      paidAmount: 0,
      notes: quot.notes,
    });

    if (i >= 2 && i < 3) {
      await storage.markInvoiceAsSent(invoice.id);
    }
    
    if (i >= 3) {
      await storage.recordPayment(invoice.id, {
        paymentDate: '2025-10-28',
        paymentAmount: invoice.total,
        paymentMethod: 'Bank Transfer',
        transactionRef: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        notes: 'Payment received in full',
      });
    }
  }

  console.log('Created 5 invoices');

  // Create 6 Tickets
  const tickets = [
    {
      clientId: clients[0].id,
      title: 'Server Setup Required',
      description: 'Need server configuration and deployment for new application',
      priority: 'High' as const,
      status: 'Open' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-26',
      createdBy: 'admin',
      notes: [
        { text: 'Ticket created', timestamp: '2025-10-26T09:00:00Z', user: 'admin' },
      ],
    },
    {
      clientId: clients[1].id,
      title: 'Email Integration Issue',
      description: 'SMTP configuration not working properly',
      priority: 'Medium' as const,
      status: 'In Progress' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-25',
      createdBy: 'admin',
      notes: [
        { text: 'Started investigating', timestamp: '2025-10-25T14:30:00Z', user: 'engineer' },
        { text: 'Found configuration issue', timestamp: '2025-10-26T10:15:00Z', user: 'engineer' },
      ],
    },
    {
      clientId: clients[2].id,
      title: 'Database Performance Optimization',
      description: 'Queries are running slow, need optimization',
      priority: 'Critical' as const,
      status: 'In Progress' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-24',
      createdBy: 'client',
      notes: [
        { text: 'Analysis in progress', timestamp: '2025-10-24T16:00:00Z', user: 'engineer' },
      ],
    },
    {
      clientId: clients[3].id,
      title: 'Feature Request: Export to PDF',
      description: 'Add ability to export reports to PDF format',
      priority: 'Low' as const,
      status: 'Resolved' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-20',
      createdBy: 'admin',
      notes: [
        { text: 'Feature implemented', timestamp: '2025-10-23T11:00:00Z', user: 'engineer' },
        { text: 'Deployed to production', timestamp: '2025-10-24T09:00:00Z', user: 'engineer' },
      ],
    },
    {
      clientId: clients[4].id,
      title: 'SSL Certificate Renewal',
      description: 'SSL certificate expiring soon, needs renewal',
      priority: 'High' as const,
      status: 'Resolved' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-18',
      createdBy: 'admin',
      notes: [
        { text: 'Certificate renewed', timestamp: '2025-10-19T10:00:00Z', user: 'engineer' },
      ],
    },
    {
      clientId: clients[0].id,
      title: 'Backup System Check',
      description: 'Regular monthly backup system verification',
      priority: 'Medium' as const,
      status: 'Closed' as const,
      assignedTo: 'engineer',
      createdDate: '2025-10-15',
      createdBy: 'admin',
      notes: [
        { text: 'Verification completed', timestamp: '2025-10-16T14:00:00Z', user: 'engineer' },
        { text: 'All systems operational', timestamp: '2025-10-16T15:00:00Z', user: 'engineer' },
      ],
    },
  ];

  for (const ticket of tickets) {
    const created = await storage.createTicket({
      ...ticket,
      notes: ticket.notes,
    });
    
    if (ticket.status !== 'Open') {
      await storage.updateTicketStatus(created.id, ticket.status);
    }
  }

  console.log('Created 6 tickets');
  console.log('Sample data initialization complete!');
}
