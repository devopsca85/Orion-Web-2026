'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

export function ResourceDownloadForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">
        <p className="font-semibold text-green-800">Your download is ready!</p>
        <p className="mt-1 text-sm text-green-600">Check your email for the download link.</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="text"
          placeholder="Full Name"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          required
          type="email"
          placeholder="Work Email"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Company (optional)"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary-600 transition-colors"
        >
          <Download className="h-4 w-4" /> Download Now — Free
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-400">
        No spam. Unsubscribe anytime. See our{' '}
        <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
    </>
  );
}
