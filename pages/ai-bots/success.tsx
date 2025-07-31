import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      // Fetch order details from session
      fetchOrderDetails(session_id as string);
    }
  }, [session_id]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/get-order-details?session_id=${sessionId}`);
      if (response.ok) {
        const details = await response.json();
        setOrderDetails(details);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Processing Payment - Kingdom Collective</title>
        </Head>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kingdom-gold mx-auto mb-4"></div>
            <p className="text-white">Processing your payment...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful - Kingdom Collective</title>
        <meta name="description" content="Your AI bot purchase was successful. Thank you for choosing Kingdom Collective!" />
      </Head>
      
      <Navigation />
      
      <main className="min-h-screen">
        {/* Success Hero */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Payment <span className="text-green-400">Successful!</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Thank you for your purchase! Your AI bots are being prepared and you'll receive 
              setup instructions within 24 hours.
            </p>
          </div>
        </section>

        {/* Order Details */}
        {orderDetails && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Order ID</h3>
                    <p className="text-white/70">{session_id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Total Amount</h3>
                    <p className="text-kingdom-gold font-bold text-xl">${orderDetails.totalAmount}</p>
                  </div>
                </div>

                {orderDetails.selectedBots && orderDetails.selectedBots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Purchased Bots</h3>
                    <div className="space-y-2">
                      {orderDetails.selectedBots.map((bot: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-kingdom-gold">•</span>
                          <span className="text-white">{bot}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orderDetails.selectedAddOns && orderDetails.selectedAddOns.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Add-ons</h3>
                    <div className="space-y-2">
                      {orderDetails.selectedAddOns.map((addon: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-kingdom-gold">•</span>
                          <span className="text-white">{addon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">What Happens Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email Confirmation</h3>
                <p className="text-white/70">You'll receive a detailed confirmation email with your order details and next steps.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bot Setup</h3>
                <p className="text-white/70">Our team will begin configuring your AI bots according to your specifications.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-kingdom-gold to-kingdom-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Launch Ready</h3>
                <p className="text-white/70">Your bots will be ready for deployment within 3-5 business days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support & Contact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
            <p className="text-xl text-white/80 mb-8">
              Our support team is here to help you get the most out of your AI bots.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200">
                Contact Support
              </Link>
              <Link href="/ai-bots" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                View All Bots
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 