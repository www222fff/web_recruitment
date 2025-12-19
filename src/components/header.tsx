'use client';

import { Building2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PostJobDialog } from './post-job-dialog';
import { useState } from 'react';

export function Header() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center mx-auto">
          <Link href="/" className="flex items-center gap-2 mr-auto">
            <Building2 className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-headline text-secondary">蓝领快聘</span>
          </Link>
          <div className="flex items-center gap-3">
             <Link href="/messages" passHref>
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4"/>
                    留言查看
                </Button>
            </Link>
            <Button onClick={() => setIsPostJobOpen(true)}>发布职位</Button>
          </div>
        </div>
      </header>
      <PostJobDialog isOpen={isPostJobOpen} onOpenChange={setIsPostJobOpen} />
    </>
  );
}
