import GlassmorphismContainer from './GlassmorphismContainer';

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <GlassmorphismContainer className="p-4 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all cursor-pointer">
      {/* ... existing card content ... */}
    </GlassmorphismContainer>
  );
} 