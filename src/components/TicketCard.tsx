import GlassmorphismContainer from './GlassmorphismContainer';
import { Ticket } from '@/lib/tickets';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <GlassmorphismContainer className="p-4 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all cursor-pointer">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-zinc-800">{ticket.title}</h3>
        <p className="text-sm text-zinc-600 line-clamp-2">{ticket.description}</p>
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <span>Prioridade: {ticket.priority}</span>
          <span>Status: {ticket.status}</span>
        </div>
      </div>
    </GlassmorphismContainer>
  );
} 