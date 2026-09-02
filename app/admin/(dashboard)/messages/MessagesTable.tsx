"use client";

import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { api } from "../ui";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesTable({ messages }: { messages: MessageRow[] }) {
  const [rows, setRows] = useState(messages);
  const [pendingDelete, setPendingDelete] = useState<MessageRow | null>(null);
  const [error, setError] = useState("");

  async function toggleRead(row: MessageRow) {
    setRows((current) => current.map((r) => (r.id === row.id ? { ...r, read: !r.read } : r)));
    const result = await api(`/api/admin/messages/${row.id}`, "PATCH", { read: !row.read });
    if (!result.ok) setError(result.error);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    setRows((current) => current.filter((r) => r.id !== row.id));
    const result = await api(`/api/admin/messages/${row.id}`, "DELETE");
    if (!result.ok) setError(result.error);
  }

  if (rows.length === 0) return <p className="text-sm text-neutral-400">No messages yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {rows.map((row) => (
        <article
          key={row.id}
          className={`rounded-lg border p-4 ${row.read ? "border-white/10 bg-neutral-900" : "border-white/25 bg-neutral-800"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium">{row.name}</p>
              <a href={`mailto:${row.email}`} className="text-sm text-neutral-400 hover:underline">
                {row.email}
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
              <span>{new Date(row.createdAt).toLocaleString()}</span>
              <button type="button" onClick={() => toggleRead(row)} className="text-neutral-400 hover:text-neutral-100">
                {row.read ? "Mark unread" : "Mark read"}
              </button>
              <button type="button" onClick={() => setPendingDelete(row)} className="text-red-500 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap text-neutral-300">{row.message}</p>
        </article>
      ))}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete the message from ${pendingDelete?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
