import {blogPlugin} from '@vuepress/plugin-blog'
import {defaultTheme} from '@vuepress/theme-default'
import {defineUserConfig} from 'vuepress'
import {viteBundler} from '@vuepress/bundler-vite'

export default defineUserConfig({
    lang: 'en-US',
    base:'/ai-news/',
    title: '话亦AI内参',
    description: '为您获取一手消息',

    theme: defaultTheme({
        logo: '/images/web_logo.png',

        navbar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: 'AI领域资讯',
                link: '/ai-news/',
            },
        ],
    }),

    plugins: [
        blogPlugin({
            // Only files under posts are articles
            filter: ({filePathRelative}) =>
                filePathRelative ? filePathRelative.startsWith('posts/') : false,

            // Getting article info
            getInfo: ({frontmatter, title, data}) => ({
                title,
                author: frontmatter.author || '',
                date: frontmatter.date || null,
                excerpt:
                // Support manually set excerpt through frontmatter
                    typeof frontmatter.excerpt === 'string'
                        ? frontmatter.excerpt
                        : data?.excerpt || '',
            }),

            // Generate excerpt for all pages excerpt those users choose to disable
            excerptFilter: ({frontmatter}) =>
                !frontmatter.home &&
                frontmatter.excerpt !== false &&
                typeof frontmatter.excerpt !== 'string',
            type: [
                {
                    key: 'ai-news',
                    // Remove archive articles
                    filter: (page) => !page.frontmatter.archive,
                    layout: 'Article',
                    frontmatter: () => ({
                        title: 'AI领域资讯',
                        sidebar: false,
                    }),
                    // Sort pages with time and sticky
                    sorter: (pageA, pageB) => {
                        if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
                            return pageB.frontmatter.sticky - pageA.frontmatter.sticky

                        if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

                        if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

                        if (!pageB.frontmatter.date) return 1
                        if (!pageA.frontmatter.date) return -1

                        return (
                            new Date(pageB.frontmatter.date).getTime() -
                            new Date(pageA.frontmatter.date).getTime()
                        )
                    },
                },
                {
                    key: 'article',
                    // Remove archive articles
                    filter: (page) => !page.frontmatter.archive,
                    layout: 'Article',
                    frontmatter: () => ({
                        title: 'Articles',
                        sidebar: false,
                    }),
                    // Sort pages with time and sticky
                    sorter: (pageA, pageB) => {
                        if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
                            return pageB.frontmatter.sticky - pageA.frontmatter.sticky

                        if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

                        if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

                        if (!pageB.frontmatter.date) return 1
                        if (!pageA.frontmatter.date) return -1

                        return (
                            new Date(pageB.frontmatter.date).getTime() -
                            new Date(pageA.frontmatter.date).getTime()
                        )
                    },
                },
            ],
            hotReload: true,
        }),
    ],

    bundler: viteBundler(),
})
