import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Image from 'next/image'
import * as console from 'node:console'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      id: true,
    },
  })

  return pages.docs?.filter((doc) => doc.id !== 'home').map(({ id }) => ({ id }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

  const page = await queryPageBySlug({ slug })

  console.log(page)

  return (
    <main className="min-h-screen">
      <div className="bg-[#141e26] text-white">
        <div className="container mx-auto px-4 pt-16  pb-60">
          <nav className="flex justify-between items-center mb-12">
            <div>
              <p className="text-sm">Chalet</p>
              <h1 className="text-5xl sm:text-6xl font-bold mt-2">Haus Grieta</h1>
              <p className="mt-2">Mountain retreat in the heart of Arlberg</p>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="border-b-2 border-white pb-1">
                Home
              </Link>
              <Link href="/accomodatie" className="hover:border-b-2 hover:border-white pb-1">
                Accomodatie
              </Link>
              <Link href="/contact" className="hover:border-b-2 hover:border-white pb-1">
                Contact
              </Link>
            </div>
          </nav>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-light">
                This is your chance to stay in a more than 200 year old farm house which is, after
                the renovation in 2018, a perfect blend of modern alpine design and traditional
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg">
                Tirolean charm. With 210 sqm spread across 3 levels, this is the perfect place to
                enjoy your holiday.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-48">
        <Image
          src="/header.png"
          alt="Cozy interior of Haus Grieta with fireplace and comfortable seating"
          width={1300}
          height={500}
          className="w-full h-[500px] object-cover object-center"
        />
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Authentic Experience</h3>
              <p>
                Experience the charm of a 200-year-old traditional farm house that has been
                carefully renovated to preserve its character.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Modern Comfort</h3>
              <p>
                Enjoy all modern amenities including a fully equipped kitchen, comfortable bedrooms,
                and cozy living spaces with a fireplace.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Perfect Location</h3>
              <p>
                Situated in the heart of Arlberg, you&#39;ll have easy access to skiing, hiking, and
                all the natural beauty the Alps have to offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      id: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
