class SupportService {
  constructor() {
    this.key = 'supportTickets';
    this._load();
  }

  _load() {
    const data = localStorage.getItem(this.key);
    this.tickets = data ? JSON.parse(data) : [];
  }

  _save() {
    localStorage.setItem(this.key, JSON.stringify(this.tickets));
  }

  createTicket(ticketData) {
    const ticket = {
      id: Date.now().toString(),
      ...ticketData,
      messages: [],
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    this.tickets.push(ticket);
    this._save();
    return ticket;
  }

  addMessageToTicket(ticketId, messageData) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({
        ...messageData,
        createdAt: new Date().toISOString()
      });
      ticket.updatedAt = new Date().toISOString();
      this._save();
      return true;
    }
    return false;
  }

  getTicketsByUser(userId) {
    return this.tickets.filter(t => t.userId === userId);
  }

  getTicketById(ticketId) {
    return this.tickets.find(t => t.id === ticketId);
  }
}

export default SupportService;