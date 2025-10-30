import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertLead, InsertClient, InsertQuotation, InsertInvoice, InsertTicket, Payment, LeadNote, TicketNote } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment platforms (Render, Railway, etc.)
  app.get('/api/auth/check', async (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  // Authentication
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Leads
  app.get('/api/leads', async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch leads' });
    }
  });

  app.get('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lead' });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const leadData: InsertLead = req.body;
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create lead' });
    }
  });

  app.patch('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leadData: Partial<InsertLead> = req.body;
      const lead = await storage.updateLead(id, leadData);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update lead' });
    }
  });

  app.delete('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLead(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete lead' });
    }
  });

  app.post('/api/leads/:id/notes', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { text } = req.body;
      const note: LeadNote = {
        text,
        timestamp: new Date().toISOString(),
        user: req.body.user || 'system',
      };
      const lead = await storage.addLeadNote(id, note);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add note' });
    }
  });

  app.post('/api/leads/:id/convert', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.convertLeadToClient(id);
      if (!client) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Failed to convert lead' });
    }
  });

  // Clients
  app.get('/api/clients', async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });

  app.get('/api/clients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch client' });
    }
  });

  app.post('/api/clients', async (req, res) => {
    try {
      const clientData: InsertClient = req.body;
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create client' });
    }
  });

  app.patch('/api/clients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clientData: Partial<InsertClient> = req.body;
      const client = await storage.updateClient(id, clientData);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update client' });
    }
  });

  app.delete('/api/clients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete client' });
    }
  });

  // Quotations
  app.get('/api/quotations', async (req, res) => {
    try {
      const quotations = await storage.getAllQuotations();
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : null;
      
      if (clientId) {
        const filtered = quotations.filter(q => q.clientId === clientId);
        return res.json(filtered);
      }
      
      res.json(quotations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quotations' });
    }
  });

  app.get('/api/quotations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotation = await storage.getQuotation(id);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quotation' });
    }
  });

  app.post('/api/quotations', async (req, res) => {
    try {
      const quotationData: InsertQuotation = req.body;
      const quotation = await storage.createQuotation(quotationData);
      res.status(201).json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create quotation' });
    }
  });

  app.patch('/api/quotations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotationData: Partial<InsertQuotation> = req.body;
      const quotation = await storage.updateQuotation(id, quotationData);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update quotation' });
    }
  });

  app.post('/api/quotations/:id/approve', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const approvedBy = req.body.approvedBy || 'manager';
      const quotation = await storage.approveQuotation(id, approvedBy);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to approve quotation' });
    }
  });

  app.post('/api/quotations/:id/reject', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotation = await storage.rejectQuotation(id);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to reject quotation' });
    }
  });

  app.post('/api/quotations/:id/submit', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotation = await storage.updateQuotation(id, { status: 'Pending' });
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit quotation' });
    }
  });

  app.post('/api/quotations/:id/generate-invoice', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotation = await storage.getQuotation(id);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      if (quotation.status !== 'Approved') {
        return res.status(400).json({ message: 'Quotation must be approved first' });
      }
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      const invoiceData: InsertInvoice = {
        quotationId: quotation.id,
        clientId: quotation.clientId,
        items: quotation.items,
        status: 'Generated',
        generatedDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        paidAmount: 0,
        notes: quotation.notes,
      };
      
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Failed to generate invoice' });
    }
  });

  // Invoices
  app.get('/api/invoices', async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : null;
      
      if (clientId) {
        const filtered = invoices.filter(inv => inv.clientId === clientId);
        return res.json(filtered);
      }
      
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch invoices' });
    }
  });

  app.get('/api/invoices/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch invoice' });
    }
  });

  app.post('/api/invoices/:id/record-payment', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const paymentData: Payment = req.body;
      const invoice = await storage.recordPayment(id, paymentData);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Failed to record payment' });
    }
  });

  app.post('/api/invoices/:id/mark-sent', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.markInvoiceAsSent(id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark invoice as sent' });
    }
  });

  // Tickets
  app.get('/api/tickets', async (req, res) => {
    try {
      const tickets = await storage.getAllTickets();
      const clientId = req.query.clientId ? parseInt(req.query.clientId as string) : null;
      
      if (clientId) {
        const filtered = tickets.filter(t => t.clientId === clientId);
        return res.json(filtered);
      }
      
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tickets' });
    }
  });

  app.get('/api/tickets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch ticket' });
    }
  });

  app.post('/api/tickets', async (req, res) => {
    try {
      const ticketData: InsertTicket = req.body;
      const ticket = await storage.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create ticket' });
    }
  });

  app.patch('/api/tickets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticketData: Partial<InsertTicket> = req.body;
      const ticket = await storage.updateTicket(id, ticketData);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update ticket' });
    }
  });

  app.post('/api/tickets/:id/notes', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { text } = req.body;
      const note: TicketNote = {
        text,
        timestamp: new Date().toISOString(),
        user: req.body.user || 'system',
      };
      const ticket = await storage.addTicketNote(id, note);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add note' });
    }
  });

  app.post('/api/tickets/:id/update-status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const ticket = await storage.updateTicketStatus(id, status);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update ticket status' });
    }
  });

  // Dashboard
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
    }
  });

  app.get('/api/dashboard/activities', async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
