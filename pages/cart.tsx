import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BackgroundVideo from '../components/BackgroundVideo';
import { useCart } from '../contexts/CartContext';
import StripeCheckout from '../components/StripeCheckout';

export default function CartPage() {
  const { items, removeItem, getTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const selectedBots = items.filter(item => item.type === 'bot').map(item => item.name);
  const selectedAddOns = items.filter(item => item.type === 'addon').map(item => item.name);

  return (
    <>
      <Head>
        <title>Cart - Kingdom Collective</title>
        <meta name="description" content="Review your AI bot selections" />
      </Head>

      <div className="relative flex size-full min-h-screen flex-col bg-navy dark group/design-root overflow-x-hidden">
        <BackgroundVideo />
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <Navigation />
          
          <main className="flex-1">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-16 sm:py-20 md:py-24 lg:py-32">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em] mb-6">
                  Your <span className="text-blue">Cart</span>
                </h1>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Review your selected AI bots and add-ons before proceeding to checkout.
                </p>
              </div>
            </section>

            {/* Cart Items */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 py-16">
              <div className="max-w-4xl mx-auto">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <h2 className="text-white text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-white/70 mb-8">Browse our AI bots and add them to your cart to get started.</p>
                    <Link 
                      href="/ai-bots" 
                      className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-200"
                    >
                      Browse AI Bots
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* AI Bots */}
                    {selectedBots.length > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h2 className="text-white text-xl font-bold mb-4">Selected AI Bots</h2>
                        <div className="space-y-4">
                          {items.filter(item => item.type === 'bot').map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                              <div>
                                <h3 className="text-white font-semibold">{item.name}</h3>
                                {item.description && (
                                  <p className="text-white/70 text-sm mt-1">{item.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-kingdom-gold font-bold">${item.price}</span>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add-ons */}
                    {selectedAddOns.length > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h2 className="text-white text-xl font-bold mb-4">Selected Add-ons</h2>
                        <div className="space-y-4">
                          {items.filter(item => item.type === 'addon').map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                              <div>
                                <h3 className="text-white font-semibold">{item.name}</h3>
                                {item.description && (
                                  <p className="text-white/70 text-sm mt-1">{item.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-kingdom-gold font-bold">${item.price}</span>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total and Actions */}
                    <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-orange/20 backdrop-blur-sm rounded-xl p-6 border border-kingdom-gold/30">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-white text-xl font-bold">Total:</span>
                        <span className="text-kingdom-gold font-bold text-2xl">${getTotal()}</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => setShowCheckout(true)}
                          className="flex-1 bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-200"
                        >
                          Proceed to Checkout
                        </button>
                        <button
                          onClick={clearCart}
                          className="px-8 py-4 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all duration-200"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Stripe Checkout Modal */}
          {showCheckout && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full">
                <StripeCheckout
                  selectedBots={selectedBots}
                  selectedAddOns={selectedAddOns}
                  totalAmount={getTotal()}
                  onSuccess={() => {
                    setShowCheckout(false);
                    clearCart();
                  }}
                  onCancel={() => setShowCheckout(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
} 