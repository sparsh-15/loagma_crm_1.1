import type { 
  User, InsertUser, Lead, InsertLead, LeadNote, Client, InsertClient,
  Quotation, InsertQuotation, Invoice, InsertInvoice, Payment,
  Ticket, InsertTicket, TicketNote, Activity, InsertActivity, DashboardMetrics
} from '@shared/schema';
import bcrypt from 'bcrypt';

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Leads
  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  addLeadNote(id: number, note: LeadNote): Promise<Lead | undefined>;
  convertLeadToClient(leadId: number): Promise<Client | undefined>;
  
  // Clients
  getAllClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  updateClientRevenue(id: number, amount: number): Promise<void>;
  
  // Quotations
  getAllQuotations(): Promise<Quotation[]>;
  getQuotation(id: number): Promise<Quotation | undefined>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  updateQuotation(id: number, quotation: Partial<InsertQuotation>): Promise<Quotation | undefined>;
  approveQuotation(id: number, approvedBy: string): Promise<Quotation | undefined>;
  rejectQuotation(id: number): Promise<Quotation | undefined>;
  
  // Invoices
  getAllInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  recordPayment(id: number, payment: Payment): Promise<Invoice | undefined>;
  markInvoiceAsSent(id: number): Promise<Invoice | undefined>;
  
  // Tickets
  getAllTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  addTicketNote(id: number, note: TicketNote): Promise<Ticket | undefined>;
  updateTicketStatus(id: number, status: Ticket['status']): Promise<Ticket | undefined>;
  
  // Activities
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<number, Lead>;
  private clients: Map<number, Client>;
  private quotations: Map<number, Quotation>;
  private invoices: Map<number, Invoice>;
  private tickets: Map<number, Ticket>;
  private activities: Map<number, Activity>;
  
  private leadIdCounter = 1;
  private clientIdCounter = 1;
  private quotationIdCounter = 1;
  private invoiceIdCounter = 1;
  private ticketIdCounter = 1;
  private activityIdCounter = 1;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.clients = new Map();
    this.quotations = new Map();
    this.invoices = new Map();
    this.tickets = new Map();
    this.activities = new Map();
    
    this.initializeUsers();
  }

  private initializeUsers() {
    const saltRounds = 10;
    const defaultUsers: User[] = [
      { id: '1', username: 'admin', password: bcrypt.hashSync('admin123', saltRounds), role: 'admin', name: 'Administrator' },
      { id: '2', username: 'manager', password: bcrypt.hashSync('manager123', saltRounds), role: 'manager', name: 'Sales Manager' },
      { id: '3', username: 'exec', password: bcrypt.hashSync('exec123', saltRounds), role: 'exec', name: 'Sales Executive' },
      { id: '4', username: 'accountant', password: bcrypt.hashSync('acc123', saltRounds), role: 'accountant', name: 'Accountant' },
      { id: '5', username: 'engineer', password: bcrypt.hashSync('eng123', saltRounds), role: 'engineer', name: 'Engineer' },
      { id: '6', username: 'client', password: bcrypt.hashSync('client123', saltRounds), role: 'client', name: 'Client User' },
    ];
    
    defaultUsers.forEach(user => this.users.set(user.id, user));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = Date.now().toString();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, password: hashedPassword, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.leadIdCounter++;
    const assignedToUser = await this.getUserByUsername(lead.assignedTo);
    const newLead: Lead = {
      ...lead,
      id,
      assignedToName: assignedToUser?.name || lead.assignedTo,
      notes: lead.notes || [],
      convertedToClientId: null,
    };
    this.leads.set(id, newLead);
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: lead.assignedTo,
      action: 'created lead',
      entity: lead.name,
      entityId: id,
    });
    return newLead;
  }

  async updateLead(id: number, leadUpdate: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    let assignedToName = lead.assignedToName;
    if (leadUpdate.assignedTo) {
      const user = await this.getUserByUsername(leadUpdate.assignedTo);
      assignedToName = user?.name || leadUpdate.assignedTo;
    }
    
    const updated: Lead = {
      ...lead,
      ...leadUpdate,
      assignedToName,
    };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }

  async addLeadNote(id: number, note: LeadNote): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    lead.notes.push(note);
    this.leads.set(id, lead);
    return lead;
  }

  async convertLeadToClient(leadId: number): Promise<Client | undefined> {
    const lead = this.leads.get(leadId);
    if (!lead) return undefined;
    
    const client = await this.createClient({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      address: '',
      createdDate: new Date().toISOString().split('T')[0],
      leadId,
    });
    
    lead.status = 'Converted';
    lead.convertedToClientId = client.id;
    this.leads.set(leadId, lead);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: lead.assignedTo,
      action: 'converted lead to client',
      entity: lead.name,
      entityId: leadId,
    });
    
    return client;
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const newClient: Client = {
      ...client,
      id,
      totalRevenue: client.totalRevenue || 0,
    };
    this.clients.set(id, newClient);
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: 'system',
      action: 'created client',
      entity: client.name,
      entityId: id,
    });
    return newClient;
  }

  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updated: Client = {
      ...client,
      ...clientUpdate,
    };
    this.clients.set(id, updated);
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: 'system',
      action: 'updated client',
      entity: client.company,
      entityId: id,
    });
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    const client = this.clients.get(id);
    if (client) {
      await this.createActivity({
        timestamp: new Date().toISOString(),
        user: 'system',
        action: 'deleted client',
        entity: client.company,
        entityId: id,
      });
    }
    return this.clients.delete(id);
  }

  async updateClientRevenue(id: number, amount: number): Promise<void> {
    const client = this.clients.get(id);
    if (client) {
      client.totalRevenue += amount;
      this.clients.set(id, client);
    }
  }

  // Quotations
  async getAllQuotations(): Promise<Quotation[]> {
    return Array.from(this.quotations.values()).sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  async getQuotation(id: number): Promise<Quotation | undefined> {
    return this.quotations.get(id);
  }

  async createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    const id = this.quotationIdCounter++;
    const client = await this.getClient(quotation.clientId);
    const createdByUser = await this.getUserByUsername(quotation.createdBy);
    
    const subtotal = quotation.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (quotation.taxRate / 100);
    const total = subtotal + taxAmount;
    
    const quotationNumber = `QT-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;
    
    const newQuotation: Quotation = {
      ...quotation,
      id,
      quotationNumber,
      clientName: client?.company || '',
      subtotal,
      taxAmount,
      total,
      createdByName: createdByUser?.name || quotation.createdBy,
      approvedBy: null,
      approvedDate: null,
    };
    this.quotations.set(id, newQuotation);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: quotation.createdBy,
      action: 'created quotation',
      entity: quotationNumber,
      entityId: id,
    });
    
    return newQuotation;
  }

  async updateQuotation(id: number, quotationUpdate: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    
    let clientName = quotation.clientName;
    if (quotationUpdate.clientId) {
      const client = await this.getClient(quotationUpdate.clientId);
      clientName = client?.company || '';
    }
    
    const items = quotationUpdate.items || quotation.items;
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = quotationUpdate.taxRate || quotation.taxRate;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    const updated: Quotation = {
      ...quotation,
      ...quotationUpdate,
      clientName,
      subtotal,
      taxAmount,
      total,
    };
    this.quotations.set(id, updated);
    return updated;
  }

  async approveQuotation(id: number, approvedBy: string): Promise<Quotation | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    
    quotation.status = 'Approved';
    quotation.approvedBy = approvedBy;
    quotation.approvedDate = new Date().toISOString().split('T')[0];
    this.quotations.set(id, quotation);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: approvedBy,
      action: 'approved quotation',
      entity: quotation.quotationNumber,
      entityId: id,
    });
    
    return quotation;
  }

  async rejectQuotation(id: number): Promise<Quotation | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    
    quotation.status = 'Rejected';
    this.quotations.set(id, quotation);
    return quotation;
  }

  // Invoices
  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()
    );
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const client = await this.getClient(invoice.clientId);
    const quotation = await this.getQuotation(invoice.quotationId);
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      ...invoice,
      id,
      invoiceNumber,
      clientName: client?.company || '',
      clientAddress: client?.address || '',
      items: quotation?.items || invoice.items,
      subtotal: quotation?.subtotal || 0,
      taxAmount: quotation?.taxAmount || 0,
      total: quotation?.total || 0,
      sentDate: null,
      paidDate: null,
      paymentMethod: null,
      transactionRef: null,
    };
    this.invoices.set(id, newInvoice);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: 'system',
      action: 'generated invoice',
      entity: invoiceNumber,
      entityId: id,
    });
    
    return newInvoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updated: Invoice = {
      ...invoice,
      ...invoiceUpdate,
    };
    this.invoices.set(id, updated);
    return updated;
  }

  async recordPayment(id: number, payment: Payment): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    invoice.paidAmount += payment.paymentAmount;
    invoice.paidDate = payment.paymentDate;
    invoice.paymentMethod = payment.paymentMethod;
    invoice.transactionRef = payment.transactionRef;
    
    if (invoice.paidAmount >= invoice.total) {
      invoice.status = 'Paid';
      await this.updateClientRevenue(invoice.clientId, invoice.total);
    } else if (invoice.paidAmount > 0) {
      invoice.status = 'Partially Paid';
    }
    
    this.invoices.set(id, invoice);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: 'system',
      action: 'recorded payment for invoice',
      entity: invoice.invoiceNumber,
      entityId: id,
    });
    
    return invoice;
  }

  async markInvoiceAsSent(id: number): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    invoice.status = 'Sent';
    invoice.sentDate = new Date().toISOString().split('T')[0];
    this.invoices.set(id, invoice);
    return invoice;
  }

  // Tickets
  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const client = await this.getClient(ticket.clientId);
    const assignedToUser = await this.getUserByUsername(ticket.assignedTo);
    
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;
    
    const newTicket: Ticket = {
      ...ticket,
      id,
      ticketNumber,
      clientName: client?.company || '',
      assignedToName: assignedToUser?.name || ticket.assignedTo,
      notes: ticket.notes || [],
      resolvedDate: null,
      closedDate: null,
    };
    this.tickets.set(id, newTicket);
    
    await this.createActivity({
      timestamp: new Date().toISOString(),
      user: ticket.createdBy,
      action: 'created ticket',
      entity: ticketNumber,
      entityId: id,
    });
    
    return newTicket;
  }

  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    let assignedToName = ticket.assignedToName;
    if (ticketUpdate.assignedTo) {
      const user = await this.getUserByUsername(ticketUpdate.assignedTo);
      assignedToName = user?.name || ticketUpdate.assignedTo;
    }
    
    const updated: Ticket = {
      ...ticket,
      ...ticketUpdate,
      assignedToName,
    };
    this.tickets.set(id, updated);
    return updated;
  }

  async addTicketNote(id: number, note: TicketNote): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    ticket.notes.push(note);
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicketStatus(id: number, status: Ticket['status']): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    ticket.status = status;
    if (status === 'Resolved' && !ticket.resolvedDate) {
      ticket.resolvedDate = new Date().toISOString().split('T')[0];
    }
    if (status === 'Closed' && !ticket.closedDate) {
      ticket.closedDate = new Date().toISOString().split('T')[0];
    }
    this.tickets.set(id, ticket);
    return ticket;
  }

  // Activities
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Dashboard
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const leads = await this.getAllLeads();
    const clients = await this.getAllClients();
    const quotations = await this.getAllQuotations();
    const invoices = await this.getAllInvoices();
    
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
    const pendingPayments = unpaidInvoices.reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
    
    const leadStatusDistribution = {
      'New': leads.filter(l => l.status === 'New').length,
      'In Progress': leads.filter(l => l.status === 'In Progress').length,
      'Converted': leads.filter(l => l.status === 'Converted').length,
      'Lost': leads.filter(l => l.status === 'Lost').length,
    };
    
    const quotationStatusDistribution = {
      'Draft': quotations.filter(q => q.status === 'Draft').length,
      'Pending': quotations.filter(q => q.status === 'Pending').length,
      'Approved': quotations.filter(q => q.status === 'Approved').length,
      'Rejected': quotations.filter(q => q.status === 'Rejected').length,
    };
    
    const monthlyRevenue = this.calculateMonthlyRevenue(paidInvoices);
    
    return {
      totalLeads: leads.length,
      totalClients: clients.length,
      totalQuotations: quotations.length,
      totalRevenue,
      pendingPayments,
      leadStatusDistribution,
      quotationStatusDistribution,
      monthlyRevenue,
    };
  }

  private calculateMonthlyRevenue(paidInvoices: Invoice[]): { month: string; revenue: number }[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthlyData: { month: string; revenue: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const revenue = paidInvoices
        .filter(inv => inv.paidDate && inv.paidDate.startsWith(monthKey))
        .reduce((sum, inv) => sum + inv.total, 0);
      
      monthlyData.push({ month: monthName, revenue });
    }
    
    return monthlyData;
  }
}

export const storage = new MemStorage();
