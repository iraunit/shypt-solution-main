import { NextResponse } from 'next/server';

const USER_AGENT = 'Mozilla/5.0 (compatible; ShyptSolutionBot/1.0)';

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: string };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const isGithub = parsedUrl.hostname.includes('github.com');

    if (isGithub) {
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        const [owner, repo] = pathParts;
        try {
          const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-Website',
            },
          });

          if (githubResponse.ok) {
            const repoData = (await githubResponse.json()) as {
              name: string;
              description: string | null;
              owner?: { avatar_url?: string | null };
              languages_url: string;
              stargazers_count: number;
              forks_count: number;
              language?: string | null;
            };

            let languages: string[] = [];
            try {
              const languagesResponse = await fetch(repoData.languages_url);
              if (languagesResponse.ok) {
                const languagesData = (await languagesResponse.json()) as Record<string, number>;
                languages = Object.keys(languagesData).slice(0, 3);
              }
            } catch (error) {
              console.error('Failed to fetch GitHub languages:', error);
            }

            return NextResponse.json({
              title: repoData.name,
              description: repoData.description ?? 'No description available',
              image: repoData.owner?.avatar_url ?? null,
              type: 'github',
              tech: languages,
              stars: repoData.stargazers_count,
              forks: repoData.forks_count,
              language: repoData.language,
            });
          }
        } catch (error) {
          console.error('GitHub API error:', error);
        }
      }
    } else {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': USER_AGENT,
          },
        });

        if (response.ok) {
          const html = await response.text();

          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const descriptionMatch =
            html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]*)['"][^>]*>/i) ??
            html.match(/<meta[^>]*content=['"]([^'"]*)['"][^>]*name=['"]description['"][^>]*>/i);
          const imageMatch =
            html.match(/<meta[^>]*property=['"]og:image['"][^>]*content=['"]([^'"]*)['"][^>]*>/i) ??
            html.match(/<meta[^>]*content=['"]([^'"]*)['"][^>]*property=['"]og:image['"][^>]*>/i);

          let title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;
          let description = descriptionMatch ? descriptionMatch[1].trim() : 'No description available';
          let image = imageMatch ? imageMatch[1].trim() : null;

          if (image && !image.startsWith('http')) {
            if (image.startsWith('/')) {
              image = `${parsedUrl.protocol}//${parsedUrl.host}${image}`;
            } else {
              image = `${parsedUrl.protocol}//${parsedUrl.host}/${image}`;
            }
          }

          return NextResponse.json({
            title,
            description,
            image,
            type: 'website',
            tech: [],
          });
        }
      } catch (error) {
        console.error('Website metadata fetch error:', error);
      }
    }

    return NextResponse.json({
      title: parsedUrl.hostname,
      description: 'Project information not available',
      image: null,
      type: isGithub ? 'github' : 'website',
      tech: [],
    });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

