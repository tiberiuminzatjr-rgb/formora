/** Visible strings only. Keep Supabase status codes, roles and database keys unchanged. */
export const portalTranslations: Record<string, string> = {
  // Shared navigation
  "Admin Portal": "Portal administrare", "Admin Dashboard": "Panou administrare",
  "Client Portal": "Portal clienți", "Dashboard": "Panou de control",
  "Overview": "Prezentare generală", "Projects": "Proiecte", "Project": "Proiect",
  "Project details": "Detalii proiect", "My projects": "Proiectele mele",
  "Your projects": "Proiectele tale", "Clients": "Clienți", "Client": "Client",
  "Requests": "Solicitări", "Project requests": "Solicitări de proiect",
  "Quotes": "Oferte", "Quote": "Ofertă", "Messages": "Mesaje", "Message": "Mesaj",
  "Files": "Fișiere", "Documents": "Documente", "Activity": "Activitate",
  "Timeline": "Cronologie", "Settings": "Setări", "Profile": "Profil",
  "Sign in": "Autentificare", "Sign out": "Deconectare", "Log out": "Deconectare",
  "Back to dashboard": "Înapoi la panou", "Back to projects": "Înapoi la proiecte",
  "Back": "Înapoi", "Home": "Acasă", "View all": "Vezi toate",
  // Status labels — do not translate stored status values
  "New": "Nou", "Pending": "În așteptare", "Reviewing": "În analiză",
  "In review": "În analiză", "In progress": "În lucru", "Active": "Activ",
  "Ready": "Pregătit", "Completed": "Finalizat", "Cancelled": "Anulat",
  "Draft": "Ciornă", "Sent": "Trimis", "Quote sent": "Ofertă trimisă",
  "Approved": "Aprobat", "Rejected": "Respins", "Accepted": "Acceptat",
  "Paid": "Plătit", "Unpaid": "Neplătit", "Overdue": "Întârziat",
  "Not started": "Neînceput", "On hold": "Suspendat",
  // Actions
  "Save": "Salvează", "Save changes": "Salvează modificările",
  "Saving...": "Se salvează...", "Cancel": "Anulează", "Close": "Închide",
  "Delete": "Șterge", "Edit": "Editează", "Update": "Actualizează",
  "Submit": "Trimite", "Send": "Trimite", "Send message": "Trimite mesaj",
  "Send quote": "Trimite oferta", "Save draft": "Salvează ciorna",
  "Create quote": "Creează ofertă", "Edit quote": "Editează oferta",
  "Invite client": "Invită clientul", "Invite Client": "Invită clientul",
  "Resend invitation": "Retrimite invitația", "Invitation sent": "Invitație trimisă",
  "Client invited": "Client invitat", "Client linked": "Client asociat",
  "View details": "Vezi detalii", "Open project": "Deschide proiectul",
  "Download": "Descarcă", "Upload": "Încarcă", "Upload files": "Încarcă fișiere",
  "Add file": "Adaugă fișier", "Choose files": "Alege fișiere",
  "Remove": "Elimină", "Search": "Caută", "Filter": "Filtrează",
  "Refresh": "Reîmprospătează", "Retry": "Încearcă din nou",
  "Continue": "Continuă", "Confirm": "Confirmă", "Copy link": "Copiază linkul",
  // Fields
  "Name": "Nume", "Full name": "Nume complet", "Email": "Email",
  "Phone": "Telefon", "Company": "Companie", "Service": "Serviciu",
  "Description": "Descriere", "Project description": "Descriere proiect",
  "Budget": "Buget", "Deadline": "Termen limită", "Priority": "Prioritate",
  "Status": "Status", "Created": "Creat", "Created at": "Creat la",
  "Updated": "Actualizat", "Last updated": "Ultima actualizare",
  "Amount": "Sumă", "Currency": "Monedă", "Total": "Total",
  "Notes": "Note", "Subject": "Subiect", "Password": "Parolă",
  "New password": "Parolă nouă", "Confirm password": "Confirmă parola",
  "Progress": "Progres", "Estimated delivery": "Livrare estimată",
  // Summaries / empty states
  "Total projects": "Total proiecte", "Active projects": "Proiecte active",
  "Completed projects": "Proiecte finalizate", "New requests": "Solicitări noi",
  "Recent activity": "Activitate recentă", "Recent requests": "Solicitări recente",
  "No projects yet": "Încă nu ai proiecte", "No requests yet": "Nu există solicitări încă",
  "No messages yet": "Nu există mesaje încă", "No files yet": "Nu există fișiere încă",
  "No quotes yet": "Nu există oferte încă", "No results found": "Nu am găsit rezultate",
  "Loading...": "Se încarcă...", "Something went wrong.": "A apărut o eroare.",
  "Please try again.": "Te rugăm să încerci din nou.",
  "Are you sure?": "Ești sigur?", "Action completed successfully.": "Acțiune finalizată cu succes.",
  // Services
  "Web Development": "Dezvoltare web", "New Website": "Site web nou",
  "Website Redesign": "Modernizare site web", "3D Scanning": "Scanare 3D",
  "3D Printing": "Printare 3D", "Scan & Reproduce": "Scanare și reproducere",
};

export function translatePortalText(text: string, language: "ro" | "en"): string {
  if (language !== "ro") return text;
  return portalTranslations[text] ?? text;
}

export function translatePortalStatus(status: string, language: "ro" | "en"): string {
  const labels: Record<string, string> = {
    new: "New", pending: "Pending", reviewing: "Reviewing", in_review: "In review",
    in_progress: "In progress", active: "Active", ready: "Ready",
    completed: "Completed", cancelled: "Cancelled", draft: "Draft",
    sent: "Sent", quote_sent: "Quote sent", approved: "Approved",
    rejected: "Rejected", accepted: "Accepted", paid: "Paid", unpaid: "Unpaid",
    on_hold: "On hold", not_started: "Not started",
  };
  return translatePortalText(labels[status] ?? status, language);
}
