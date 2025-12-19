'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMessages } from '@/lib/api';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  contact: string;
  createdAt: string;
}

function MessageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);
  
  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (e) {
        return "Invalid Date";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-secondary">留言板</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          来自小程序用户的招工信息留言。
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <CardTitle className="text-lg text-secondary">{message.contact}</CardTitle>
                  <CardDescription>发布于: {formatDate(message.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16 py-12 bg-card rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-muted-foreground">当前没有留言</h2>
            <p className="text-muted-foreground mt-2">请稍后再来查看。</p>
          </div>
        )}
      </div>
    </div>
  );
}
