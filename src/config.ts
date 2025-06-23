import type { ThemeConfig } from "@/types"

export const themeConfig: ThemeConfig = {
    // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    site: {
        // site title
        title: "LengYue's Blog",
        // site subtitle
        subtitle: "琥珀之月,空谷之兰,皆是孤芳,既是孤芳,但求自赏便罢!",
        // site description
        description:
            "一名拥有10年经验的移动端与全栈开发者的技术笔记。记录 Android、iOS、Flutter、前端、后端的实战技巧与思考，与你一起深入探索编程世界。",
        // use i18n title/subtitle/description from src/i18n/ui.ts instead of static ones above
        i18nTitle: false, // true, false
        // author name
        author: "LengYue",
        // site url
        url: "https://apkdv.com/",
        // favicon url
        // recommended formats: svg, png or ico
        favicon: "/icons/favicon.svg", // or https://example.com/favicon.svg
    },
    // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    color: {
        // default theme mode
        mode: "auto", // light, dark, auto
        light: {
            primary: "oklch(0.24 0.0172 280.05)",
            secondary: "oklch(0.40 0.0172 280.05)",
            background: "oklch(0.98 0.0172 280.05)",
            highlight: "oklch(0.93 0.195089 103.2532 / 0.5)",
        },
        dark: {
            primary: "oklch(0.92 0.0172 280.05)",
            secondary: "oklch(0.79 0.0172 280.05)",
            background: "oklch(0.24 0.0172 280.05)",
            highlight: "oklch(0.93 0.195089 103.2532 / 0.2)",
        },
    },
    // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    global: {
        // default language
        locale: "zh", // de, en, es, fr, ja, ko, pl, pt, ru, zh, zh-tw
        // more languages
        // not fill in the locale code above again, can be an empty array []
        moreLocales: [], // ['de', 'en', 'es', 'fr', 'ja', 'ko', 'pl', 'pt', 'ru', 'zh', 'zh-tw']
        // font styles for post text
        fontStyle: "sans", // sans, serif
        // date format for posts
        dateFormat: "YYYY-MM-DD", // YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY, MONTH DAY YYYY, DAY MONTH YYYY
        // enable table of contents for all posts by default
        toc: true, // true, false
        // enable KaTeX for mathematical formulas rendering
        katex: true, // true, false
        // reduce animations and transitions to improve performance
        reduceMotion: false, // true, false
    },
    // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    comment: {
        // enable comment system
        enabled: false, // true, false
        // giscus
        // https://giscus.app/
        giscus: {
            repo: "",
            repoID: "",
            category: "",
            categoryID: "",
            mapping: "pathname",
            strict: "0",
            reactionsEnabled: "1",
            emitMetadata: "0",
            inputPosition: "bottom",
        },
        // waline
        // https://waline.js.org/en/
        waline: {
            // server url
            serverURL: "https://retypeset-comment.radishzz.cc",
            // emoji url
            emoji: [
                "https://unpkg.com/@waline/emojis@1.2.0/tw-emoji",
                // 'https://unpkg.com/@waline/emojis@1.2.0/bmoji',
                // more emojis: https://waline.js.org/en/guide/features/emoji.html
            ],
            // gif search
            search: false, // true, false
            // image uploader
            imageUploader: false, // true, false
        },
    },
    // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // SEO SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    seo: {
        umamiAnalyticsID: "36be4b1a-531f-4d34-8225-80c3ef9444e4",
    },
    // SEO SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // FOOTER SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    footer: {
        // social links
        links: [
            {
                name: "RSS",
                url: "/atom.xml", // or /rss.xml
            },
            {
                name: "GitHub",
                url: "https://github.com/appdev",
            },
            {
                name: "Email",
                url: "email@run.ci",
            },
            // {
            //   name: 'X',
            //   url: 'https://x.com/radishzz_',
            // },
        ],
        // year of website start
        startYear: 2014,
    },
    // FOOTER SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

    // PRELOAD SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
    preload: {
        // image hosting url
        // optimize remote images in Markdown files to avoid cumulative layout shift
        imageHostURL: "image.radishzz.cc",
        // custom google analytics js
        // for users who route analytics javascript to a customized domain
        // See https://gist.github.com/xiaopc/0602f06ca465d76bd9efd3dda9393738
        customGoogleAnalyticsJS: "",
        // custom umami analytics js
        // for users who deploy umami on their own, or route analytics javascript to a customized domain
        // see https://github.com/umami-software/umami/discussions/1026
        customUmamiAnalyticsJS: "https://js.radishzz.cc/jquery.min.js",
    },
    // PRELOAD SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END
}

export default themeConfig

export const defaultLocale = themeConfig.global.locale
export const moreLocales = themeConfig.global.moreLocales
export const allLocales = [defaultLocale, ...moreLocales]
