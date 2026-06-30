import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: "Read the statement of faith and core beliefs of The Potter's House Christian Church.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: "About | The Potter's House Christian Church",
    description: "Read the statement of faith and core beliefs of The Potter's House Christian Church.",
    url: '/about',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "About The Potter's House Christian Church",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About | The Potter's House Christian Church",
    description: "Read the statement of faith and core beliefs of The Potter's House Christian Church.",
    images: ['/images/world_bg.jpg'],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-mid-gray">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-slate-950/30 py-24 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-12 max-w-3xl space-y-4 text-center mx-auto">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">What We Believe</p>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Statement of Faith for The Potter&apos;s House Christian Church</h1>
            <p className="text-base leading-8 text-slate-200/90 md:text-lg">
              Our faith is rooted in the timeless truths of God&apos;s Word. These are the core beliefs that guide our church family.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">One God</h2>
                <p className="text-sm leading-7 text-slate-700">
                  There is only one God, and that He is eternally existent in Three Persons: Father, Son, and Holy Spirit.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">God the Father</h2>
                <p className="text-sm leading-7 text-slate-700">
                  God the Father is the Creator of the universe. He created man in His own image for fellowship, and called man back to Himself through Christ after the rebellion and fall of man.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">Jesus Christ</h2>
                <p className="text-sm leading-7 text-slate-700">
                  Jesus Christ is eternally God. He was together with the Father and the Holy Spirit from the beginning, and through Him all things were made. He left Heaven and became incarnate by the Holy Spirit of the Virgin Mary; henceforth, He is forever one Christ with two natures—God and man—in one Person.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">The Holy Spirit</h2>
                <p className="text-sm leading-7 text-slate-700">
                  The Holy Spirit is God, the Lord, and giver of life, who was active in the Old Testament, and given to the Church in fullness at Pentecost. He empowers the saints for service and witness, cleanses man from the old nature, and conforms us to the image of Christ.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">Baptism in the Holy Spirit</h2>
                <p className="text-sm leading-7 text-slate-700">
                  The baptism in the Holy Spirit with evidence of speaking in tongues, subsequent to conversion, releases the fullness of the Spirit, and is evidenced by the fruits and gifts of the Holy Spirit.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">The Bible</h2>
                <p className="text-sm leading-7 text-slate-700">
                  The Bible containing the Old and New Testament is alone the only infallible, inspired Word of God, and that its authority is ultimate, final, and eternal. It cannot be added to, subtracted from, or superseded in any regard. The Bible is the source of all doctrine, instruction, correction, and reproof.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">Christ&apos;s Death & Atonement</h2>
                <p className="text-sm leading-7 text-slate-700">
                  Christ&apos;s vicarious death on the cross paid the penalty for the sins of the whole world. Its benefits of healing (body, soul, and spirit) are provided for in the atonement as well.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">Salvation</h2>
                <p className="text-sm leading-7 text-slate-700">
                  Salvation is a free gift of God, based on the merits of the death of His Son, and is appropriated by faith. Salvation is affected by personal repentance, belief in the Lord Jesus (justification), and personal acceptance of Him into one&apos;s life as Lord and Savior (regeneration).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">The Christian Life</h2>
                <p className="text-sm leading-7 text-slate-700">
                  The Christian life is to be one of consecration, devotion, and holiness. The shortcomings of the individual are because of the still progressing sanctification of the saints. For those abiding in Christ until their deaths or His return, the promises of eternal blessing in the presence of God are assured.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">The Church</h2>
                <p className="text-sm leading-7 text-slate-700">
                  The Church is the Body of Christ, the habitation of God among the saints through the Spirit. Every believer born of the Spirit has a place in the church designated by God. A place where Christ is working in the lives of the called out ones and calling ministers to the great commission to go into all the world and make disciples of every nation.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">Ordinances</h2>
                <p className="text-sm leading-7 text-slate-700">
                  We believe in the ordinances of Baptism and the Lord&apos;s Supper. Baptism is the outward sign of what God has already done in the individual&apos;s life and is a public testimony that the person now belongs to Christ. The Lord&apos;s Supper is a commemoration of the death of the Lord and is done in remembrance of Him until He comes again.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-navy">The Second Coming</h2>
                <p className="text-sm leading-7 text-slate-700">
                  We believe in the bodily, personal, second coming of the Lord Jesus Christ, the resurrection of the saints, the millennium, and the final judgment. The final judgment will determine the eternal status of both the saints and the unbelievers, determined by their relationship to Jesus Christ.
                </p>
              </section>

              <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-700 shadow-inner">
                <p className="text-lg font-semibold text-navy">"Jesus Christ is the same yesterday, today, and forever."</p>
                <p className="mt-3 text-sm text-slate-600">— Hebrews 13:8</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
