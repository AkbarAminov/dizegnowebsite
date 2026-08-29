"use client";

import { useState } from "react";

type Row = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesTable({ messages }: { messages: Row[] }) {
  const [rows, setRows] = useState(messages);

  async function toggleRead(row: Row) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, read: !r.read } : r)));
    await fetch(`/api/admin/messages/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !row.read }),
    });
  }

  async function deleteMessage(row: Row) {
    if (!confirm("Delete this message?")) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    await fetch(`/api/admin/messages/${row.id}`, { method: "DELETE" });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-neutral-400">No messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div
          key={row.id}
          className={`rounded-lg border p-4 ${
            row.read ? "border-white/10 bg-[#1a1a1a]" : "border-white/25 bg-[#1f1f1f]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-neutral-100">{row.name}</p>
              <a href={`mailto:${row.email}`} className="text-sm text-neutral-400 hover:underline">
                {row.email}
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
              <span>{new Date(row.createdAt).toLocaleString()}</span>
              <button
                type="button"
                onClick={() => toggleRead(row)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                {row.read ? "Mark unread" : "Mark read"}
              </button>
              <button type="button" onClick={() => deleteMessage(row)} className="text-red-500 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap text-neutral-300">{row.message}</p>
        </div>
      ))}
    </div>
  );
}
