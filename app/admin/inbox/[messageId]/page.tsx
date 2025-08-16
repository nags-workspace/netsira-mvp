// app/admin/inbox/[messageId]/page.tsx

import { sendReplyAction } from "../../../../app/actions/admin.actions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Message = {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  message: string;
  status: 'Received' | 'Replied';
  reply: string;
};

// This function fetches a single message by its ID from the Google Sheet
async function getMessage(messageId: string): Promise<Message | null> {
    if (!process.env.GOOGLE_APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SECRET_KEY) {
        console.error("Missing Google Apps Script environment variables.");
        return null;
    }
    try {
        const res = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: "getMessageById",
                secretKey: process.env.APPS_SCRIPT_SECRET_KEY,
                params: { messageId }
            }),
            cache: 'no-store' // Always fetch the latest version of this message
        });

        const result = await res.json();
        if (result.status !== 'success') {
            console.error("Error from Apps Script:", result.message);
            return null;
        }
        return result.data;
    } catch (error) {
        console.error("Failed to fetch message from Google Apps Script:", error);
        return null;
    }
}

export default async function MessageDetailPage({ params }: { params: { messageId: string }}) {
    const message = await getMessage(params.messageId);
    
    if (!message) {
        return notFound();
    }

    return (
        <div>
            <Link href="/admin/inbox" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8">
                <ChevronLeft size={20} /> Back to Inbox
            </Link>

            <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 space-y-6">
                {/* Message Details */}
                <div>
                    <p className="text-sm text-slate-400">From</p>
                    <p className="font-semibold text-white">{message.name} &lt;{message.email}&gt;</p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Received</p>
                    <p className="font-semibold text-white">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Message</p>
                    <p className="text-white whitespace-pre-wrap p-4 bg-slate-700/50 rounded-md mt-1">{message.message}</p>
                </div>
                
                {/* --- CONDITIONAL UI: Show Reply or Form --- */}
                {message.reply ? (
                    // If a reply exists, display it
                    <div className="border-t border-slate-700 pt-6">
                        <h2 className="text-xl font-bold mb-2 text-green-400">Your Reply (Sent)</h2>
                        <p className="text-white whitespace-pre-wrap p-4 bg-slate-700/50 rounded-md mt-1">{message.reply}</p>
                    </div>
                ) : (
                    // If no reply exists, show the form
                    <div className="border-t border-slate-700 pt-6">
                        <h2 className="text-xl font-bold mb-4">Your Reply</h2>
                        <form action={sendReplyAction}>
                            <input type="hidden" name="messageId" value={message.id} />
                            <input type="hidden" name="recipientEmail" value={message.email} />
                            <input type="hidden" name="recipientName" value={message.name} />
                            <input type="hidden" name="originalMessage" value={message.message} />
                            <textarea 
                                name="replyMessage" 
                                rows={6} 
                                required 
                                className="w-full bg-slate-700 text-white p-3 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your reply here..."
                            ></textarea>
                            <div className="text-right mt-4">
                                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Send Reply</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}