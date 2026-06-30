'use client';

import { useEffect } from 'react';

interface FacebookPost {
  id: string;
  permalink_url: string;
}

export default function FacebookPostsGrid() {
  useEffect(() => {
    // Parse Facebook embeds after component mounts
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  // Sample posts - these would be your actual Facebook posts
  // Format: PAGE_ID_POST_ID (you can get these from your Facebook posts)
  const samplePosts: FacebookPost[] = [
    {
      id: '220298454499881_1234567890123456',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123456',
    },
    {
      id: '220298454499881_1234567890123457',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123457',
    },
    {
      id: '220298454499881_1234567890123458',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123458',
    },
    {
      id: '220298454499881_1234567890123459',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123459',
    },
    {
      id: '220298454499881_1234567890123460',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123460',
    },
    {
      id: '220298454499881_1234567890123461',
      permalink_url: 'https://www.facebook.com/220298454499881/posts/1234567890123461',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {samplePosts.map((post) => (
        <div
          key={post.id}
          className="rounded-xl overflow-hidden bg-slate-900/40 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-white/20"
        >
          <div
            className="fb-post"
            data-href={post.permalink_url}
            data-width="100%"
            data-show-text="true"
          />
        </div>
      ))}
    </div>
  );
}
