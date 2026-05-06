import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/checkout/'],
        },
        sitemap: 'https://ninetysix.com/sitemap.xml', // Replace with actual domain
    }
}
