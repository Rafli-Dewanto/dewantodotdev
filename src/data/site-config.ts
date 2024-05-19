export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Rafli Satya Dewanto',
    subtitle: 'Software Engineer',
    description: 'Rafli Dewanto - Software Engineer',
    image: {
        src: '/rafli-preview.jpeg',
        alt: 'Rafli Dewanto - Software Engineer'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/rd09/'
        },
        {
            text: 'GitHub',
            href: 'https://github.com/Rafli-Dewanto'
        },
        {
            text: 'Instagram',
            href: 'https://instagram.com/rafli.dewanto'
        }
    ],
    hero: {
        title: 'What\'s good, welcome to my digital block!',
        text: "I'm **Rafli Dewanto**, a Software Engineer from Indonesia, currently working with Next.js for Fullstack Web Development. In my leisure time, I am learning Back-End Development with Go and writing post about my learning.. Feel free to explore some of my coding endeavors on <a href='https://github.com/Rafli-Dewanto'>GitHub</a> or follow me on <a href='https://www.linkedin.com/in/rd09/'>LinkedIn</a>.",
        image: {
            src: '/rafli.JPG',
            alt: 'Rafli Satya Dewanto'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            },
            {
                text: 'Read my CV',
                href: '/cv.pdf'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
