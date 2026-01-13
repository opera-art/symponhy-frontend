import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { supabaseAdmin } from '../services/supabaseService';

const router = Router();

// Tipos de eventos do Clerk
interface ClerkWebhookEvent {
  type: string;
  data: any;
}

/**
 * POST /api/webhooks/clerk
 * Recebe webhooks do Clerk para sincronizar com Supabase
 *
 * Eventos tratados:
 * - user.created: Cria profile no Supabase
 * - user.updated: Atualiza profile no Supabase
 * - user.deleted: Remove profile do Supabase
 * - organizationMembership.created: Atualiza org_id no profile
 * - organizationMembership.deleted: Remove org_id do profile
 */
router.post('/clerk', async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET não configurado');
    return res.status(500).json({ error: 'Webhook não configurado' });
  }

  // Verificar assinatura do webhook
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Headers de verificação ausentes' });
  }

  const body = JSON.stringify(req.body);

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Erro ao verificar webhook:', err);
    return res.status(400).json({ error: 'Assinatura inválida' });
  }

  // Processar evento
  try {
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;

      case 'user.updated':
        await handleUserUpdated(event.data);
        break;

      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;

      case 'organizationMembership.created':
        await handleOrgMembershipCreated(event.data);
        break;

      case 'organizationMembership.updated':
        await handleOrgMembershipUpdated(event.data);
        break;

      case 'organizationMembership.deleted':
        await handleOrgMembershipDeleted(event.data);
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Erro ao processar evento' });
  }
});

/**
 * Handlers para cada tipo de evento
 */

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data;

  const email = email_addresses?.[0]?.email_address;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();

  console.log(`[Webhook] Criando profile para usuário ${id}`);

  await supabaseAdmin.from('profiles').upsert({
    clerk_id: id,
    email,
    full_name: fullName || email,
    avatar_url: image_url,
  }, {
    onConflict: 'clerk_id',
  });
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data;

  const email = email_addresses?.[0]?.email_address;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();

  console.log(`[Webhook] Atualizando profile do usuário ${id}`);

  await supabaseAdmin
    .from('profiles')
    .update({
      email,
      full_name: fullName || email,
      avatar_url: image_url,
    })
    .eq('clerk_id', id);
}

async function handleUserDeleted(data: any) {
  const { id } = data;

  console.log(`[Webhook] Removendo profile do usuário ${id}`);

  await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('clerk_id', id);
}

async function handleOrgMembershipCreated(data: any) {
  const { organization, public_user_data, role } = data;

  const clerkUserId = public_user_data?.user_id;
  const clerkOrgId = organization?.id;

  console.log(`[Webhook] Usuário ${clerkUserId} adicionado à org ${clerkOrgId} como ${role}`);

  await supabaseAdmin
    .from('profiles')
    .update({
      clerk_org_id: clerkOrgId,
      role: role, // 'admin' ou 'member'
    })
    .eq('clerk_id', clerkUserId);
}

async function handleOrgMembershipUpdated(data: any) {
  const { organization, public_user_data, role } = data;

  const clerkUserId = public_user_data?.user_id;
  const clerkOrgId = organization?.id;

  console.log(`[Webhook] Role atualizado: usuário ${clerkUserId} agora é ${role}`);

  await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('clerk_id', clerkUserId)
    .eq('clerk_org_id', clerkOrgId);
}

async function handleOrgMembershipDeleted(data: any) {
  const { public_user_data } = data;

  const clerkUserId = public_user_data?.user_id;

  console.log(`[Webhook] Usuário ${clerkUserId} removido da organização`);

  await supabaseAdmin
    .from('profiles')
    .update({
      clerk_org_id: null,
      role: null,
    })
    .eq('clerk_id', clerkUserId);
}

export default router;
