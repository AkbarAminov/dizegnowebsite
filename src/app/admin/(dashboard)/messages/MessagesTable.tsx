"use client";

import { useCallback, useMemo, useState } from "react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../ConfirmDialog";
import { LocalTime } from "../LocalTime";
import { Toast, type ToastMessage } from "../Toast";
import { api, cardClass, focusRing, iconButtonClass, secondaryButtonClass } from "../ui";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Filter = "all" | "unread";

export function MessagesTable({ messages }: { messages: MessageRow[] }) {
  const [rows, setRows] = useState(messages);
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingDelete, setPendingDelete] = useState<MessageRow | null>(null);
  const [toast, setToast] = useState<ToastMessage>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const unread = useMemo(() => rows.filter((row) => !row.read).length, [rows]);
  const visible = filter === "unread" ? rows.filter((row) => !row.read) : rows;

  // Optimistic, like the projects table: the toast is what confirms the server agreed.
  async function run(update: (rows: MessageRow[]) => MessageRow[], request: () => ReturnType<typeof api>, done: string) {
    const previous = rows;
    setRows(update);
    const result = await request();
    if (result.ok) {
      setToast({ text: done, tone: "success" });
    } else {
      setRows(previous);
      setToast({ text: result.error, tone: "error" });
    }
  }

  function toggleRead(row: MessageRow) {
    run(
      (current) => current.map((r) => (r.id === row.id ? { ...r, read: !r.read } : r)),
      () => api(`/api/admin/messages/${row.id}`, "PATCH", { read: !row.read }),
      row.read ? "Marked as unread" : "Marked as read"
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const row = pendingDelete;
    setPendingDelete(null);
    run(
      (current) => current.filter((r) => r.id !== row.id),
      () => api(`/api/admin/messages/${row.id}`, "DELETE"),
      "Message deleted"
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-panel/50 px-6 py-16 text-center">
        <p className="text-sm font-medium text-neutral-200">No messages yet</p>
        <p className="mt-1 text-sm text-neutral-500">Everything sent through the contact form lands here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit gap-1 rounded-lg border border-white/10 bg-panel p-1">
        <FilterTab label="All" count={rows.length} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab label="Unread" count={unread} active={filter === "unread"} onClick={() => setFilter("unread")} />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 bg-panel/50 px-6 py-12 text-center text-sm text-neutral-500">
          Nothing unread — you are all caught up.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((row) => (
            <li key={row.id}>
              <article className={`${cardClass} ${row.read ? "" : "border-l-2 border-l-accent"} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium text-neutral-100">{row.name}</h2>
                      {!row.read && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${row.email}`}
                      className={`text-sm text-neutral-400 hover:text-neutral-100 hover:underline ${focusRing}`}
                    >
                      {row.email}
                    </a>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <span className="mr-2 text-xs text-neutral-500">
                      <LocalTime iso={row.createdAt} withTime />
                    </span>
                    <a
                      href={`mailto:${row.email}?subject=${encodeURIComponent("Re: your message to Dizegno")}`}
                      className={secondaryButtonClass}
                    >
                      <Reply size={15} />
                      Reply
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleRead(row)}
                      className={iconButtonClass}
                      title={row.read ? "Mark as unread" : "Mark as read"}
                    >
                      {row.read ? <Mail size={16} /> : <MailOpen size={16} />}
                      <span className="sr-only">{row.read ? "Mark as unread" : "Mark as read"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(row)}
                      className={`${iconButtonClass} hover:bg-red-500/10 hover:text-red-400`}
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete message from {row.name}</span>
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm whitespace-pre-wrap text-neutral-300">{row.message}</p>
              </article>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete the message from ${pendingDelete?.name}?`}
        description="It will be removed for good — reply first if you still need the address."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
        active ? "bg-white/10 text-neutral-100" : "text-neutral-400 hover:text-neutral-100"
      } ${focusRing}`}
    >
      {label}
      <span className={`ml-2 text-xs ${active ? "text-neutral-400" : "text-neutral-600"}`}>{count}</span>
    </button>
  );
}
