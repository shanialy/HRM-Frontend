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
    // Listen for errors
    const errorHandler = (error: { message: string }) => {
        alert(error.message);
        chatService.removeListener("error", errorHandler);
    };

    chatService.onError(errorHandler);

    chatService.createConversation(userId, (conversation) => {
        chatService.removeListener("error", errorHandler);
        router.push(`/dashboard/conversation-list?chatId=${conversation._id}`);
    });
};
