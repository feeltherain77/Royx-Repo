const Wibu47 = {
    name: "Wibu47",
    baseUrl: "https://wibu47.vip",

    async getHome() {
        const html = await this.request(this.baseUrl);
        const regex = /<div class="item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            results.push({ name: match[2], url: match[1], poster: match[3] });
        }
        return results;
    },

    async search(query) {
        const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const html = await this.request(searchUrl);
        const regex = /<div class="result-item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            results.push({ name: match[2], url: match[1], poster: match[3] });
        }
        return results;
    },

    async getDetail(url) {
        const html = await this.request(url);
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        let episodes = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            episodes.push({ name: `Tập ${match[2]}`, url: match[1] });
        }
        return { episodes };
    },

    async getStream(url) {
        const html = await this.request(url);
        const match = /<iframe[\s\S]*?src="([^"]+)"/i.exec(html);
        if (!match) return null;
        return {
            links: [{
                url: match[1],
                quality: "HD",
                isM3u8: match[1].includes(".m3u8")
            }]
        };
    }
};
