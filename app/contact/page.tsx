"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Instagram, ArrowLeft } from "lucide-react"
import { RollingText } from "@/components/rolling-text"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto">
          <Link href="/" className="text-black">
            <h1 className="text-2xl md:text-3xl font-bold">LOEK LUTGENS</h1>
          </Link>
          <div className="flex gap-6">
            <Link href="/">
              <button className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
                <RollingText text="Home" />
              </button>
            </Link>
            <Link href="/#gallery">
              <button className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
                <RollingText text="Pictures" />
              </button>
            </Link>
            <Link href="/#videos">
              <button className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
                <RollingText text="Videos" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-black hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/loek-profile.jpg" alt="Loek Lutgens" fill className="object-cover" priority />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Let's Connect</h1>
              <p className="text-xl text-gray-600">
                Available for photography and videography projects. Whether it's capturing stunning landscapes, creating
                compelling portraits, or producing engaging video content, I'd love to hear about your vision.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <a
                href="mailto:loeklutgens2@gmail.com"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <p className="text-lg font-semibold">loeklutgens2@gmail.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+31620193058"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <p className="text-lg font-semibold">+31 6 20193058</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ll_exist/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Instagram</p>
                  <p className="text-lg font-semibold">@ll_exist</p>
                </div>
              </a>
            </div>

            <div className="pt-6">
              <a href="mailto:loeklutgens2@gmail.com">
                <Button size="lg" className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-full px-8">
                  Send me a message
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Based in the Netherlands</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Working on projects throughout Europe and beyond. Open to travel for the right opportunity.
          </p>
        </div>
      </div>
    </div>
  )
}
