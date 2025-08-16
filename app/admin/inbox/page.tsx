// app/admin/inbox/page.tsx

import { Mail } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define the shape of the message data we expect from our Apps Script
type Message = {
  id: string; // The unique ID we created in the spreadsheet
  timestamp: string;
  name: string;
  email: string;
  message: string;
  status: 'Received' | 'Replied';
  reply: string;
};

// This function fetches all messages by calling our Google Apps Script webhook
async function getMessages(): Promise<Message[]> {
    if (!process.env.GOOGLE_APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SECRET_KEY) {
        console.error("Missing Google Apps Script environment variables.");
        return [];
    }
    try {
        const res = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: "getAllMessages",
                secretKey: process.env.APPS_SCRIPT_SECRET_KEY,
            }),
            // Revalidate frequently to get new messages
            next: { revalidate: 10 } 
        });

        const result = await res.json();
        if (result.status !== 'success') {
            console.error("Error from Apps Script:", result.message);
            return [];
        }
        return result.data ?? [];
    } catch (error) {
        console.error("Failed to fetch messages from Google Apps Script:", error);
        return [];
    }
}

export default async function InboxPage() {
    const messages = await getMessages();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Mail size={28}/> Inbox</h1>
            <div className="bg-slate-800 rounded-lg border border-slate-700">
                <ul className="divide-y divide-slate-700">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <li key={msg.id}>
                                <Link href={`/admin/inbox/${msg.id}`} className="block p-4 hover:bg-slate-700/50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-white">{msg.name} <span className="text-sm font-normal text-slate-400">&lt;{msg.email}&gt;</span></p>
                                        <div className="flex items-center gap-4">
                                            {msg.status === 'Replied' ? (
                                                <span className="text-xs font-semibold text-green-400 bg-green-900/50 px-2 py-1 rounded-full">Replied</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-amber-400 bg-amber-900/50 px-2 py-1 rounded-full">Received</span>
                                            )}
                                            <p className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2 truncate">{msg.message}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-slate-400 p-8">Your inbox is empty.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}