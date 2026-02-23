import { chatService } from "@/app/services/chat.service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Navigate to a conversation with a specific user
 * Creates conversation if it doesn't exist, then navigates to it
 */
export const navigateToChat = (
    userId: string,
    router: AppRouterInstance
): void => {
    chatService.createConversation(userId, (conversation) => {
        router.push(`/dashboard/conversation-list?chatId=${conversation._id}`);
    });
};
