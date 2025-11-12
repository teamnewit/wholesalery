import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from '@/hooks/use-initials';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Mail, Send } from 'lucide-react';
import axios from 'axios';
import { AppHeader } from '@/components/app-header';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OfferProps {
  id: number;
}

interface ShareButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

function ShareButton({ icon, label, onClick, className = '' }: ShareButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      onClick={onClick}
      title={`Share on ${label}`}
    >
      {icon}
      <span className="sr-only md:not-sr-only md:inline-block">{label}</span>
    </Button>
  );
}

export default function Show({ id }: OfferProps) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const getInitials = useInitials();
  
  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContactSuccess(true);
      setTimeout(() => {
        setContactOpen(false);
        setContactSuccess(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 2000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setContactSubmitting(false);
    }
  };
  
  // Get the current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Share on Facebook
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };
  
  // Share on Twitter/X
  const shareOnTwitter = () => {
    const text = offer ? `Check out this offer: ${offer.title}` : 'Check out this offer';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };
  
  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/offers/${id}`);
        setOffer(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load offer details');
        console.error('Error fetching offer:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return (
      <>
        <Head title="Loading Offer" />
        <AppHeader />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center py-16">Loading offer details...</div>
        </div>
      </>
    );
  }

  if (error || !offer) {
    return (
      <>
        <Head title="Offer Not Found" />
        <AppHeader />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Offer not found</h2>
            <p className="text-muted-foreground">{error || 'The requested offer could not be found'}</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={offer.title} />
      <AppHeader />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Offers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {offer.image_url && (
                <div className="relative w-full pt-[50%]">
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-6">
                {offer.category?.name && (
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      {offer.category.name}
                    </span>
                  </div>
                )}
                
                <h1 className="text-3xl font-bold mb-6">{offer.title}</h1>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{offer.description}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About the Poster</h2>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={offer.user?.avatar} alt={offer.user?.name} />
                    <AvatarFallback className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                      {getInitials(offer.user?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{offer.user?.name}</p>
                    <p className="text-sm text-muted-foreground">Member since {new Date(offer.user?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Poster
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact about this offer</DialogTitle>
                        <DialogDescription>
                          Send a message to {offer.user?.name} about their offer: {offer.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Your Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactInputChange}
                            required
                            disabled={contactSubmitting || contactSuccess}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Your Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={contactForm.email}
                            onChange={handleContactInputChange}
                            required
                            disabled={contactSubmitting || contactSuccess}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactInputChange}
                            rows={4}
                            required
                            disabled={contactSubmitting || contactSuccess}
                            placeholder={`Hi ${offer.user?.name}, I'm interested in your offer...`}
                          />
                        </div>
                        
                        <DialogFooter>
                          {contactSuccess ? (
                            <div className="flex items-center text-green-600 font-medium">
                              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              Message sent successfully!
                            </div>
                          ) : (
                            <Button type="submit" disabled={contactSubmitting}>
                              {contactSubmitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Message
                                </>
                              )}
                            </Button>
                          )}
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-3">Share this offer</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 ${copied ? "bg-green-600 text-white hover:bg-green-700 hover:text-white" : ""}`}
                      onClick={() => {
                        navigator.clipboard.writeText(currentUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      title="Copy link to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
