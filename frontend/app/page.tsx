"use client";
import Image from "next/image";
import { GoMail } from "react-icons/go";
import { RiRobot3Line } from "react-icons/ri";

import { motion } from "framer-motion";
import { FaChartSimple } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FRONTEND_URLS } from "./constants";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-zinc-950 text-white overflow-x-hidden min-h-screen">

      <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800 z-50">

        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <span className="text-2xl font-semibold tracking-tighter heading">InvoGen</span>
          </div>



          <div className="flex items-center gap-x-4">
            <button  onClick={()=>router.push(FRONTEND_URLS.LOGIN)} className="px-6 py-2.5 text-xs font-medium hover:bg-white/5 rounded-2xl transition">Log in</button>
            <button onClick={()=>router.push(FRONTEND_URLS.REGISTER)} className="px-6 py-2.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-2xl transition">Start for free</button>
          </div>
        </div>
      </nav>


      <div className="pt-32 pb-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <div className="inline-flex items-center gap-x-2 bg-white/5 text-emerald-400 text-sm font-medium px-5 py-2 rounded-3xl border border-white/10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                NEW: AI-Powered Invoice Generator
              </div>

              <h1 className="text-7xl lg:text-8xl font-semibold tracking-tighter leading-none heading">
                Beautiful<br />invoices.<br />Instantly.
              </h1>

              <p className="text-2xl text-zinc-400 max-w-lg">
                The modern invoicing platform trusted by thousands of freelancers and businesses.
              </p>

              <div className="flex items-center gap-x-4">
                <button onClick={() => router.push(FRONTEND_URLS.REGISTER)} className="px-10 py-5 bg-white text-black font-semibold text-lg rounded-3xl flex items-center gap-x-3 hover:scale-105 transition">
                  Create your first invoice
                </button>

              </div>

              <div className="flex items-center gap-x-8 text-sm pt-6">
                <div className="flex items-center gap-x-2">
                  <div className="flex -space-x-2">
                    <Image alt="" src="https://picsum.photos/id/64/32/32" width={32} height={32} className="w-6 h-6 rounded-full ring-2 ring-zinc-900 object-cover" />
                    <Image alt="" src="https://picsum.photos/id/91/32/32" width={32} height={32} className="w-6 h-6 rounded-full ring-2 ring-zinc-900 object-cover" />
                  </div>
                  <span className="text-zinc-400">Trusted by 12k+ teams</span>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="flex items-center text-emerald-400">
                  ★★★★☆ <span className="text-zinc-400 ml-2">4.98</span>
                </div>
              </div>
            </div>


            <div className="relative">
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
                <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-x-3">
                    <div className="w-7 h-7 bg-emerald-500 rounded-2xl flex items-center justify-center text-xs font-bold">N</div>
                    <span className="font-semibold">InvoGen Group</span>
                  </div>
                  <div className="text-xs bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-2xl">Invoice Preview</div>
                </div>

                <div className="p-8 bg-white text-zinc-900">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <div className="text-emerald-600 font-semibold text-xl">InvoGen Group</div>
                      <div className="text-xs text-zinc-500 mt-1">09 Arnulfo Crossing, Botsfordborough</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold tracking-tighter">INV-0064891</div>
                      <div className="text-sm text-zinc-500">November 23, 2024</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                    <div>
                      <div className="uppercase text-zinc-400 text-xs mb-2">Bill To</div>
                      <div className="font-medium">Smith Interior</div>
                      <div className="text-zinc-500 text-xs">456 Maple Avenue, LA</div>
                    </div>
                    <div className="text-right">
                      <div className="uppercase text-zinc-400 text-xs mb-2">Due Date</div>
                      <div className="font-medium">November 25, 2024</div>
                    </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="text-left py-3 font-medium text-xs uppercase text-zinc-500">Item</th>
                        <th className="text-right py-3 font-medium text-xs uppercase text-zinc-500">Price</th>
                        <th className="text-right py-3 font-medium text-xs uppercase text-zinc-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-100">
                      <tr>
                        <td className="py-4">Design System</td>
                        <td className="text-right">$120.00</td>
                        <td className="text-right font-medium">$120.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                      <div className="pt-3 border-t border-zinc-300 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-xl">$215.09</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-black text-xs font-bold px-5 py-2 rounded-3xl shadow-xl rotate-12">
                LIVE PREVIEW
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <LogoMarquee />
      </div>


      <div className="py-24 bg-zinc-900">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-white/5 rounded-3xl text-sm tracking-widest">POWERFUL FEATURES</span>
            <h2 className="text-5xl font-semibold heading mt-6">Everything you need to get paid faster</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
                <GoMail size={25} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Instant Professional Invoices</h3>
              <p className="text-zinc-400  leading-10">Beautiful, customizable templates. Send invoices in seconds with your branding.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
                <RiRobot3Line size={25} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI Assistant</h3>
              <p className="text-zinc-400 leading-10">Describe your project and let AI generate complete invoices with accurate line items.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition"><FaChartSimple size={25} className="text-emerald-500" /></div>
              <h3 className="text-2xl font-semibold mb-3">Smart Payments</h3>
              <p className="text-zinc-400 leading-10">Accept credit cards, ACH, and more. Get real-time status and automated reminders.</p>
            </div>
          </div>
        </div>
      </div>


      <div className="py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-2xl mx-auto text-center px-8">
          <h2 className="text-6xl font-semibold heading tracking-tighter mb-6">Ready to get paid faster?</h2>
          <p className="text-zinc-400 text-xl mb-10">Join thousands of businesses using InvoGen to send professional invoices in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push(FRONTEND_URLS.REGISTER)} className="px-10 py-6 bg-white text-black rounded-3xl font-semibold text-xl hover:bg-emerald-400 transition">Get started — it&apos;s free</button>
          </div>
          <p className="text-xs text-zinc-500 mt-8">No credit card required • Cancel anytime</p>
        </div>
      </div>


      <footer className="bg-black py-16 border-t border-zinc-900">
        <div className="max-w-screen-2xl mx-auto px-8 text-zinc-500 text-sm flex flex-col md:flex-row justify-between items-center gap-y-6">
          <div>© 2026 InvoGen. All rights reserved.</div>
          <div className="flex gap-x-8">

            <a href="https://github.com/ElormLokpo" target="blank" className="hover:text-white transition">Github</a>
            <a href="https://www.linkedin.com/in/elorm-lokpo-837a4a309/" target="blank" className="hover:text-white transition">LinkedIn</a>
          </div>
          <div>Made with ❤️ for freelancers</div>
        </div>
      </footer>
    </div>
  );
}




function LogoMarquee() {
  const logos = ["Stripe", "QuickBooks", "Xero", "Shopify", "HubSpot", "Stripe", "QuickBooks", "Xero", "Shopify", "HubSpot", "Stripe", "QuickBooks", "Xero",];

  return (
    <div className="border-t border-b border-zinc-800 py-10 bg-zinc-950 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.div
          className="flex gap-x-16 w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >

          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="text-md opacity-60 whitespace-nowrap text-white"
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}