'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTicketById, getTicketUpdates, addTicketUpdate, assignTicket, closeTicket, rateTicket } from '@/lib/tickets';
import { Ticket } from '@/lib/tickets';
import { getUserProfile } from '@/lib/supabase';
import { UserProfile } from '@/lib/supabase';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import StarRating from '@/components/StarRating';
import { formatDate } from '@/utils/helpers';
import GlassmorphismContainer from '@/components/GlassmorphismContainer';
import TicketDetails from '@/components/TicketDetails';

export default function TicketPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <GlassmorphismContainer className="p-6">
        <TicketDetails id={params.id} />
      </GlassmorphismContainer>
    </div>
  );
} 