import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Amit Upadhyay | AI Architecture Advisory',
    description: 'Production-grade AI systems, tools, and experiments.',
    site: context.site,
    items: [
      {
        title: 'BazaarPulse Launched',
        description: 'Indian market intelligence platform with real-time NSE data, stock screener, and analytics.',
        pubDate: new Date('2024-05-01'),
        link: 'https://bazaarpulse.app/',
      },
      {
        title: 'PyAnimate Launched',
        description: 'Browser-based Python learning playground. Master algorithms through interactive execution visualization.',
        pubDate: new Date('2024-04-15'),
        link: 'https://pyanimate.com/',
      },
      {
        title: 'AI Wisdom Launched',
        description: 'Writing on AI Engineering. Essays, guides, and case studies on building real-world AI systems.',
        pubDate: new Date('2024-01-10'),
        link: 'https://aiwisdom.dev/',
      }
    ],
    customData: `<language>en-us</language>`,
  });
}
