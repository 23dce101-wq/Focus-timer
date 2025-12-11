import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill out your name, email, and message.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const response = await api.post('/contact', payload);

      if (response.data?.ok) {
        setIsSubmitted(true);
        toast({
          title: 'Message sent successfully!',
          description: "Thank you for contacting us. We'll get back to you soon.",
        });

        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        const errorMessage = response.data?.message || 'Failed to send message. Please try again later.';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors as { field: string; message: string }[] | undefined;
      const description = apiErrors && apiErrors.length > 0
        ? apiErrors.map((e) => e.message).join(', ')
        : 'Failed to send message. Please try again later.';

      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject (optional)
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is your message about?"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what's on your mind..."
          className="w-full min-h-[150px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || isSubmitted} className="w-full">
        {isSubmitting ? (
          <>Sending...</>
        ) : isSubmitted ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Message Sent!
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
