import { prisma } from "@/lib/prisma";
import { MessagesTable } from "./MessagesTable";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {messages.length === 0
          ? "Nothing from the contact form yet."
          : unread === 0
            ? `${messages.length} in total, all read.`
            : `${unread} unread of ${messages.length}.`}
      </p>

      <div className="mt-6">
        <MessagesTable
          messages={messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))}
        />
      </div>
    </div>
  );
}
