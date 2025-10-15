export function renderSupportTickets(tickets) {
  return `
    <div class="support-tickets">
      <h3>Meus Tickets de Suporte</h3>
      <button class="btn-primary" id="new-ticket-profile-btn">Novo Ticket</button>
      <div class="tickets-list">
        ${tickets.length === 0 ? '<p>Você não possui tickets de suporte.</p>' : tickets.map(t => `
          <div class="ticket-card" data-ticket-id="${t.id}">
            <div>
              <strong>#${t.id}</strong> - ${t.subject}
              <span class="ticket-status ${t.status}">${t.status === 'open' ? 'Aberto' : 'Fechado'}</span>
            </div>
            <div>
              <small>${new Date(t.createdAt).toLocaleDateString()}</small>
              <button class="btn-secondary btn-sm view-ticket-btn" data-ticket-id="${t.id}">Ver detalhes</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderTicketDetail(ticket) {
  return `
    <div class="ticket-detail">
      <h3>Ticket #${ticket.id} - ${ticket.subject}</h3>
      <div class="ticket-messages">
        ${ticket.messages.length === 0 ? '<p>Nenhuma mensagem ainda.</p>' : ticket.messages.map(m => `
          <div class="ticket-message">
            <div class="msg-header">
              <span class="msg-user">${m.userName || 'Usuário'}</span>
              <span class="msg-date">${new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <div class="msg-body">${m.text}</div>
          </div>
        `).join('')}
      </div>
      <form id="ticket-message-form" data-ticket-id="${ticket.id}" class="ticket-message-form">
        <textarea name="text" rows="3" required placeholder="Digite sua mensagem..."></textarea>
        <button type="submit" class="btn-primary">Enviar Mensagem</button>
      </form>
      <button class="btn-secondary" id="back-to-tickets-btn">Voltar</button>
    </div>
  `;
}

export function renderNewTicketForm() {
  return `
    <form id="new-ticket-form" class="new-ticket-form">
      <h4>Novo Ticket de Suporte</h4>
      <label>Assunto:
        <input name="subject" type="text" required>
      </label>
      <label>Mensagem:
        <textarea name="text" rows="3" required></textarea>
      </label>
      <button type="submit" class="btn-primary">Criar Ticket</button>
      <button type="button" class="btn-secondary" id="cancel-new-ticket-btn">Cancelar</button>
    </form>
  `;
}