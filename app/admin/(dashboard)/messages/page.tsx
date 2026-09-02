import { prisma } from "@/lib/prisma";
import { MessagesTable } from "./MessagesTable";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Messages</h1>
      <div className="mt-6">
        <MessagesTable
          messages={messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))}
        />
      </div>
    </div>
  );
}
