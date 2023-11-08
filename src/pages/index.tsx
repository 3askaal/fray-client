import { useState } from 'react';
import { useAsyncEffect } from 'rooks';
const md = require('markdown-it')();
import { Hero, Section } from '../components';
import { useApi } from '@/hooks/useApi';

import { HeadExtend } from '@/components/Head';
import { Gallery } from '@/components/Gallery';

import './index.scss';

export const Home = () => {
  const { get } = useApi();
  const [videos, setVideos] = useState([]);
  const [sections, setSections] = useState([]);

  useAsyncEffect(async () => {
    const data: any = await get('home-page');

    if (!data.hero) return;

    const newVideos = data.hero.data.map(({ url }: { url: string }) => url)
    setVideos(newVideos);

    let images = data.gallery?.data?.map(({ formats }: any) => {
      return {
        smallUrl: formats?.small?.url || '',
        largeUrl: formats?.large?.url || ''
      }
    }) || [];


    const newSections: any = data.content ? (await Promise.all(data.content.split('___').map(async (content: any) => {
      if (content?.includes('[gallery]')) {
        return {
          gallery: true,
          images
        }
      }

      return md.render(content || '')
    }))) : [];

    setSections(newSections)
  }, [])

  return (
    <>
      <HeadExtend title="Home" />
      <div className="page">
        { !!videos.length && <Hero videos={videos} /> }
        <div className="container">
          <div>
            { sections.map((section: any, index: number) => (
              <Section key={index} className={section.type}>
                { section.gallery ? (
                  <Gallery images={section.images} />
                ) : (
                  <div className="container--text container--center body body--center spacer" dangerouslySetInnerHTML={{ __html: section }} />
                )}
              </Section>
            )) }
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;
