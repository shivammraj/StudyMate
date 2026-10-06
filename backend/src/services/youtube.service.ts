export interface YouTubeSearchResult {
  title: string;
  query: string;
  url: string;
  channelTitle?: string;
  videoId?: string;
}

export class YouTubeService {
  async searchVideos(query: string, maxResults = 3): Promise<{ results: YouTubeSearchResult[]; source: 'api' | 'fallback' }> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const sanitizedQuery = encodeURIComponent(query.trim());

    if (!apiKey) {
      // Fallback search link generation without exposing any client-side secret
      return {
        results: [
          {
            title: `Search YouTube: "${query}"`,
            query,
            url: `https://www.youtube.com/results?search_query=${sanitizedQuery}`,
          },
        ],
        source: 'fallback',
      };
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${sanitizedQuery}&key=${apiKey}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`YouTube API returned status ${res.status}`);
      }

      const data: any = await res.json();
      const items = data.items || [];

      const results: YouTubeSearchResult[] = items.map((item: any) => ({
        title: item.snippet?.title || query,
        query,
        videoId: item.id?.videoId,
        channelTitle: item.snippet?.channelTitle,
        url: item.id?.videoId
          ? `https://www.youtube.com/watch?v=${item.id.videoId}`
          : `https://www.youtube.com/results?search_query=${sanitizedQuery}`,
      }));

      return { results, source: 'api' };
    } catch (err) {
      console.warn('YouTube API call failed or rate limited, falling back to search link', err);
      return {
        results: [
          {
            title: `Search YouTube: "${query}"`,
            query,
            url: `https://www.youtube.com/results?search_query=${sanitizedQuery}`,
          },
        ],
        source: 'fallback',
      };
    }
  }
}

export const youtubeService = new YouTubeService();
