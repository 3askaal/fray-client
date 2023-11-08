import Head from "next/head"

export const HeadExtend = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>Fray Handmade - { title }</title>
      <meta name="description" content={`Fray Handmade - ${title}`} key="desc" />
      <meta property="og:title" content={`Fray Handmade - ${title}`} />
      <meta property="og:description" content={`Fray Handmade - ${title}`} />
      {/* <meta property="og:image" content="https://example.com/images/cool-page.jpg" /> */}
    </Head>
  )
}
