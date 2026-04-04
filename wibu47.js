const Wibu47 = {
    name: "Wibu47",
    baseUrl: "https://wibu47.vip",

    async getHome() {
        const html = await this.request(this.baseUrl);
        const regex = /<div class="item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            results.push({
                name: match[2],
                url: match[1],
                poster: match[3]
            });
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
            results.push({
                name: match[2],
                url: match[1],
                poster: match[3]
            });
        }
        return results;
    },

    async getDetail(url) {
        const html = await this.request(url);
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        let episodes = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            episodes.push({
                name: `Tập ${match[2]}`,
                url: match[1]
            });
        }
        return { episodes };
    },

    async getStream(url) {
        const html = await this.request(url);
        const iframeRegex = /<iframe[\s\S]*?src="([^"]+)"/i;
        const match = iframeRegex.exec(html);
        if (!match) return null;
        
        const iframeUrl = match[1];
        return {
            links: [{
                url: iframeUrl,
                quality: "HD",
                isM3u8: iframeUrl.includes(".m3u8")
            }]
        };
    }
};
        const html = await this.request(url);
        // Soi cái danh sách tập phim trong class .list-episode
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        // Trả về danh sách tập cho đại ca "mlem"
    },

    // 4. BẮT LINK PLAYER (BƯỚC NHÓT NÃO NHẤT)
    async getStream(url) {
        const html = await this.request(url);
        // Wibu47 thường dùng Iframe giấu link. Ta phải "vun" cái link Iframe đó ra.
        const iframeRegex = /<iframe[\s\S]*?src="([^"]+)"/i;
        const iframeUrl = iframeRegex.exec(html)[1];

        // Nếu iframeUrl là link DailyMotion, DoodStream hay Gdrive...
        // CloudStream nó có sẵn "Extractors" để tự động vắt link m3u8/mp4.
        // Đại ca chỉ cần "vẩy" link iframe vào hệ thống là xong! 😒🥂
        return {
            links: [{
                url: iframeUrl,
                quality: "HD",
                isM3u8: iframeUrl.includes(".m3u8")
            }]
        };
    }
};
