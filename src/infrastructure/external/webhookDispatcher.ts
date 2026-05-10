import { mockDb } from '@/infrastructure/database/mockDb';
import { WebhookEvent, Role } from '@/shared/types/types';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

interface WebhookEventData {
  userId?: string;
  userRole?: Role;
  materialId?: string;
  collectionId?: string;
  points?: number;
  previousLevel?: string;
  newLevel?: string;
  [key: string]: unknown;
}

function passesFilter(
  filter: { roles?: Role[]; userId?: string } | undefined,
  data: WebhookEventData
): boolean {
  if (!filter) return true;

  if (filter.userId && data.userId !== filter.userId) {
    return false;
  }

  if (filter.roles && filter.roles.length > 0) {
    if (!data.userRole || !filter.roles.includes(data.userRole)) {
      return false;
    }
  }

  return true;
}

export async function triggerWebhook(
  event: WebhookEvent,
  payload: WebhookEventData
): Promise<void> {
  try {
    const webhooks = await mockDb.getWebhooksByEvent(event);

    if (webhooks.length === 0) {
      return;
    }

    const webhookPayload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    };

    for (const webhook of webhooks) {
      if (!passesFilter(webhook.eventFilter, payload)) {
        continue;
      }

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        await mockDb.createWebhookLog({
          webhookId: webhook.id,
          event,
          payload,
          status: response.ok ? 'success' : 'error',
          responseCode: response.status,
          responseBody: await response.text().catch(() => ''),
        });
      } catch (error) {
        await mockDb.createWebhookLog({
          webhookId: webhook.id,
          event,
          payload,
          status: 'error',
          responseBody: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  } catch (error) {
    console.error('Error triggering webhook:', error);
  }
}

export const WebhookEvents = {
  userRegistered: (data: { userId: string; email: string; name: string; role: Role }) => {
    triggerWebhook('user.registered', {
      userId: data.userId,
      userRole: data.role,
      email: data.email,
      name: data.name,
    });
  },

  userStatusChanged: (data: { userId: string; userRole: Role; previousStatus: string; newStatus: string; rejectionReason?: string }) => {
    triggerWebhook('user.status_changed', {
      userId: data.userId,
      userRole: data.userRole,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      rejectionReason: data.rejectionReason,
    });
  },

  userInviteUsed: (data: { userId: string; userRole: Role; inviteId: string }) => {
    triggerWebhook('user.invite_used', {
      userId: data.userId,
      userRole: data.userRole,
      inviteId: data.inviteId,
    });
  },

  materialCreated: (data: { materialId: string; materialTitle: string; materialType: string }) => {
    triggerWebhook('material.created', {
      materialId: data.materialId,
      materialTitle: data.materialTitle,
      materialType: data.materialType,
    });
  },

  materialUpdated: (data: { materialId: string; materialTitle: string }) => {
    triggerWebhook('material.updated', {
      materialId: data.materialId,
      materialTitle: data.materialTitle,
    });
  },

  materialDeleted: (data: { materialId: string }) => {
    triggerWebhook('material.deleted', {
      materialId: data.materialId,
    });
  },

  materialAccessed: (data: { userId: string; userRole: Role; materialId: string }) => {
    triggerWebhook('material.accessed', {
      userId: data.userId,
      userRole: data.userRole,
      materialId: data.materialId,
    });
  },

  materialCompleted: (data: { userId: string; userRole: Role; materialId: string; points: number }) => {
    triggerWebhook('material.completed', {
      userId: data.userId,
      userRole: data.userRole,
      materialId: data.materialId,
      points,
    });
  },

  collectionCompleted: (data: { userId: string; userRole: Role; collectionId: string; points: number }) => {
    triggerWebhook('collection.completed', {
      userId: data.userId,
      userRole: data.userRole,
      collectionId: data.collectionId,
      points,
    });
  },

  gamificationLevelUp: (data: { userId: string; userRole: Role; previousLevel: string; newLevel: string; totalPoints: number }) => {
    triggerWebhook('gamification.level_up', {
      userId: data.userId,
      userRole: data.userRole,
      previousLevel: data.previousLevel,
      newLevel: data.newLevel,
      totalPoints: data.totalPoints,
    });
  },

  inviteGenerated: (data: { inviteId: string; role: Role; expiresAt: string }) => {
    triggerWebhook('invite.generated', {
      inviteId: data.inviteId,
      role: data.role,
      expiresAt: data.expiresAt,
    });
  },

  inviteShared: (data: { inviteId: string; recipientName: string; recipientPhone: string }) => {
    triggerWebhook('invite.shared', {
      inviteId: data.inviteId,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
    });
  },

  messageSent: (data: { recipientId: string; channel: 'email' | 'whatsapp'; subject?: string }) => {
    triggerWebhook('message.sent', {
      recipientId: data.recipientId,
      channel: data.channel,
      subject: data.subject,
    });
  },
};