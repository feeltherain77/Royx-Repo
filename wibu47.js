// --- WIBU47 PROVIDER - BẢN SẮC TRÙM CUỐI BY MẠNH DZ --- 😒🥂

const Wibu47 = {
    name: "Wibu47",
    baseUrl: "https://wibu47.vip",

    // 1. LẤY PHIM TRANG CHỦ
    async getHome() {
        const response = await this.request(this.baseUrl);
        // Bắt cụm: Link phim, Tiêu đề, Poster
        const regex = /<div class="item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            results.push({
                name: match[2].trim(),
                url: match[1],
                poster: match[3],
                type: "Anime"
            });
        }
        return results;
    },

    // 2. TÌM KIẾM PHIM
    async search(query) {
        const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const response = await this.request(searchUrl);
        const regex = /<div class="result-item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            results.push({
                name: match[2].trim(),
                url: match[1],
                poster: match[3]
            });
        }
        return results;
    },

    // 3. CHI TIẾT PHIM & DANH SÁCH TẬP
    async getDetail(url) {
        const response = await this.request(url);
        // Bắt link tập phim (episode-link)
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        let episodes = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            episodes.push({
                name: "Tập " + match[2].trim(),
                url: match[1]
            });
        }
        // Đảo ngược danh sách để Tập 1 hiện lên đầu cho đại ca đỡ nhót lòng
        return { episodes: episodes.reverse() };
    },

    // 4. BẮT LINK PLAYER (BƯỚC QUAN TRỌNG NHẤT)
    async getStream(url) {
        const response = await this.request(url);
        
        // Pháp thuật 1: Tìm Iframe Player
        const iframeMatch = /<iframe[\s\S]*?src="([^"]+)"/i.exec(response);
        
        if (iframeMatch) {
            let videoUrl = iframeMatch[1];
            // Fix link nếu thiếu https:
            if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl;

            return {
                links: [{
                    url: videoUrl,
                    name: "Wibu47 VIP",
                    quality: "HD",
                    isM3u8: videoUrl.includes(".m3u8")
                }]
            };
        }
        
        // Pháp thuật 2: Tìm link m3u8 ẩn trong Script (nếu có)
        const m3u8Match = /(https?:\/\/[^"']+\.m3u8[^"']*)/i.exec(response);
        if (m3u8Match) {
            return {
                links: [{
                    url: m3u8Match[1],
                    name: "Direct Link",
                    quality: "Auto",
                    isM3u8: true
                }]
            };
        }

        return null;
    }
};

// Đăng ký Provider với hệ thống CloudStream
// Đéo có dòng này là nó đéo chạy đâu đại ca nhé!
addProvider(Wibu47);
